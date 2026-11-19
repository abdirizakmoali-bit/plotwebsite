import json
import logging
import time
from datetime import timedelta
from http.client import HTTPException
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import OperationalError, close_old_connections
from django.utils import timezone

from leads.models import Enquiry

logger = logging.getLogger(__name__)
RECIPIENT = "info@plotdevelopments.com"


def send_notification(enquiry):
    text = (
        f"New website enquiry for {enquiry.service}\n\n"
        f"Name: {enquiry.full_name}\nPhone / WhatsApp: {enquiry.phone}\n"
        f"Email: {enquiry.email or 'Not provided'}\n"
        f"Preferred contact: {enquiry.get_contact_preference_display()}\n\n"
        f"Project location: {enquiry.location or 'Not provided'}\n"
        f"Stage: {enquiry.project_stage}\nBudget: {enquiry.budget}\nTimeline: {enquiry.timeline}\n\n"
        f"Project brief:\n{enquiry.brief}\n\nReference: {enquiry.reference}"
    )
    message = {
        "from": settings.ENQUIRY_FROM_EMAIL,
        "to": [RECIPIENT],
        "subject": f"PLOT website enquiry | {enquiry.service} | {enquiry.reference}",
        "text": text,
    }
    if enquiry.email:
        message["reply_to"] = enquiry.email
    request = Request("https://api.resend.com/emails", data=json.dumps(message).encode(),
                      headers={"Authorization": f"Bearer {settings.RESEND_API_KEY}",
                               "Content-Type": "application/json", "User-Agent": "PLOT-Enquiries/1.0",
                               "Idempotency-Key": f"plot-enquiry/{enquiry.reference}"})
    with urlopen(request, timeout=8) as response:
        if not json.load(response).get("id"):
            raise ValueError("Missing provider message ID")


def deliver_next():
    now = timezone.now()
    enquiry = Enquiry.objects.filter(email_due_at__lte=now).order_by("email_due_at", "pk").first()
    if enquiry is None:
        return False

    # Reserve this delivery. A stopped worker leaves a retryable record behind.
    reserved_until = now + timedelta(minutes=5)
    if not Enquiry.objects.filter(pk=enquiry.pk, email_due_at=enquiry.email_due_at).update(email_due_at=reserved_until):
        return True
    try:
        send_notification(enquiry)
    except (OSError, HTTPException, ValueError) as error:
        detail = f"HTTP {error.code}" if isinstance(error, HTTPError) else type(error).__name__
        logger.warning("Enquiry email %s is queued for retry (%s)", enquiry.reference, detail)
    else:
        Enquiry.objects.filter(pk=enquiry.pk, email_due_at=reserved_until).update(
            email_sent_at=timezone.now(), email_due_at=None)
    return True


class Command(BaseCommand):
    help = "Deliver queued project enquiry emails."

    def handle(self, *args, **options):
        if not settings.RESEND_API_KEY:
            raise CommandError("Set RESEND_API_KEY to deliver enquiry emails.")
        while True:
            close_old_connections()
            try:
                if deliver_next():
                    time.sleep(0.6)
                    continue
            except OperationalError:
                logger.warning("Enquiry email queue is temporarily unavailable")
            time.sleep(10)

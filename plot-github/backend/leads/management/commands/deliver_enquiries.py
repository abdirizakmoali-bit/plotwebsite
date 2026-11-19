import json
import logging
import time
from datetime import timedelta
from http.client import HTTPException
from smtplib import SMTPResponseException
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from django.conf import settings
from django.core.mail import EmailMessage
from django.core.management.base import BaseCommand
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
    message = EmailMessage(
        subject=f"PLOT website enquiry | {enquiry.service} | {enquiry.reference}",
        body=text,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[RECIPIENT],
        reply_to=[enquiry.email] if enquiry.email else [],
        headers={"Message-ID": f"<enquiry.{enquiry.reference}@plotdevelopments.com>"},
    )
    if settings.RESEND_API_KEY:
        payload = {
            "from": "PLOT Developments <enquiries@notify.plotdevelopments.com>",
            "to": message.to,
            "subject": message.subject,
            "text": message.body,
        }
        if message.reply_to:
            payload["reply_to"] = message.reply_to
        request = Request("https://api.resend.com/emails", data=json.dumps(payload).encode(), headers={
            "Authorization": f"Bearer {settings.RESEND_API_KEY}",
            "Content-Type": "application/json",
            "User-Agent": "PLOT-Enquiries/1.0",
            "Idempotency-Key": f"enquiry/{enquiry.reference}",
        })
        with urlopen(request, timeout=8) as response:
            result = json.load(response)
            if not isinstance(result, dict) or not result.get("id"):
                raise ValueError("Resend did not accept the notification")
        return
    if message.send() != 1:
        raise OSError("Enquiry email was not accepted")


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
        detail = type(error).__name__
        if isinstance(error, HTTPError):
            detail = f"HTTP {error.code}"
        elif isinstance(error, SMTPResponseException):
            detail = f"SMTP {error.smtp_code}"
        logger.warning("Enquiry email %s is queued for retry (%s)", enquiry.reference, detail)
    else:
        Enquiry.objects.filter(pk=enquiry.pk, email_due_at=reserved_until).update(
            email_sent_at=timezone.now(), email_due_at=None)
    return True


class Command(BaseCommand):
    help = "Deliver queued project enquiry emails."

    def handle(self, *args, **options):
        if not (settings.RESEND_API_KEY or settings.EMAIL_HOST_PASSWORD):
            self.stdout.write("Website enquiries are queued. Set RESEND_API_KEY for delivery on Railway Hobby.")
            return
        while True:
            close_old_connections()
            try:
                if deliver_next():
                    time.sleep(0.6)
                    continue
            except OperationalError:
                logger.warning("Enquiry email queue is temporarily unavailable")
            time.sleep(10)

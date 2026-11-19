import logging
import time
from datetime import timedelta
from smtplib import SMTPResponseException

from django.conf import settings
from django.core.mail import EmailMessage, get_connection
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
    except (OSError, ValueError) as error:
        detail = f"SMTP {error.smtp_code}" if isinstance(error, SMTPResponseException) else type(error).__name__
        logger.warning("Enquiry email %s is queued for retry (%s)", enquiry.reference, detail)
    else:
        Enquiry.objects.filter(pk=enquiry.pk, email_due_at=reserved_until).update(
            email_sent_at=timezone.now(), email_due_at=None)
    return True


class Command(BaseCommand):
    help = "Deliver queued project enquiry emails."

    def handle(self, *args, **options):
        if not settings.EMAIL_HOST_PASSWORD:
            # Check the encrypted SMTP greeting separately from mailbox authentication.
            try:
                with get_connection():
                    self.stdout.write("Namecheap SMTP is reachable. Enquiry email is waiting for EMAIL_HOST_PASSWORD.")
            except OSError as error:
                self.stderr.write(f"Could not connect to Namecheap SMTP ({type(error).__name__}). "
                                  "Enquiries remain queued. Check outbound SMTP access and EMAIL_HOST_PASSWORD.")
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

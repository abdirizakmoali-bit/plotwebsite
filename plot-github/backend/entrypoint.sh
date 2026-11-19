#!/bin/sh
set -eu
python manage.py migrate --noinput
python manage.py collectstatic --noinput
if [ -n "${RESEND_API_KEY:-}" ]; then
    python manage.py deliver_enquiries &
else
    echo "Enquiry email delivery is waiting for RESEND_API_KEY. New enquiries will be queued."
fi
exec gunicorn config.wsgi:application --bind "0.0.0.0:${PORT:-8000}" --workers 2 --timeout 60 --access-logfile - --error-logfile -

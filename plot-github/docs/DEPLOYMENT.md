# Deployment guide

The frontend exports static assets; the backend runs Python. Deploy them as separate services.

## Frontend

- Root directory: `frontend`
- Install: `npm ci`
- Build: `npm run build`
- Static output: `out`
- For Docker hosts, use `frontend/Dockerfile` with build context `frontend`.
- Nginx listens on the injected PORT (default 8080).
- Support `/contact/`, `/projects/` and other directory index routes.

Build-time variables:

| Variable | Purpose |
| --- | --- |
| NEXT_PUBLIC_API_URL | HTTPS origin of Django, without `/api`; empty enables download-only preview |
| NEXT_PUBLIC_SITE_URL | Public HTTPS frontend origin; empty keeps search indexing disabled |
| NEXT_PUBLIC_WHATSAPP_NUMBER | Verified business number in international digits; empty hides the button |

Never put secret values in NEXT_PUBLIC variables. All are visible in the browser.

## Django

- Root/build context: `backend`
- Install: `pip install -r requirements.lock.txt`
- Release: `python manage.py migrate --noinput`
- Static assets: `python manage.py collectstatic --noinput`
- Start: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 2`
- Docker entrypoint runs migrations and static collection before starting.
- Health check: `/health/` (process liveness, not database readiness).
- Create an admin through the host's shell: `python manage.py createsuperuser`.

Required production settings:

| Variable | Value |
| --- | --- |
| DEBUG | false |
| SECRET_KEY | Long random secret |
| DATABASE_URL | Managed PostgreSQL connection URL |
| REDIS_URL | Shared Redis connection URL for rate limits across workers |
| ALLOWED_HOSTS | Backend hostnames, comma separated, without schemes |
| CORS_ALLOWED_ORIGINS | Exact HTTPS frontend origin(s) |
| CSRF_TRUSTED_ORIGINS | Exact HTTPS frontend and admin origins |

The host must terminate HTTPS and pass `X-Forwarded-Proto` accurately. Do not trust that header directly from untrusted traffic. Restrict Redis/database access to your backend network and arrange backups. API throttling is a basic abuse control, not a complete denial-of-service defence. Consider host-level rate limits before running paid campaigns.

## Launch verification

1. Submit an enquiry from the deployed frontend and find it in admin.
2. Confirm service, budget, stage, timeline, contact method and consent fields.
3. Visit `/?utm_source=instagram&utm_medium=social&utm_campaign=launch` in a new session and verify attribution on a test enquiry.
4. Retry the same submission token: only one record should exist.
5. Check public GET requests cannot list enquiries and admin requires sign-in.
6. Test mobile navigation, gallery, form validation, Back/Continue and confirmation.
7. Confirm privacy contact arrangements and set an operational retention/deletion policy before collecting real data.
8. Configure any desired email/CRM integration separately; none is active by default.

## Upgrading an existing database

Migration 0002 assigns distinct UUIDs to existing records before enforcing non-null identifiers. Existing legacy enquiries retain consent=false and consent_at=null; consent is never fabricated for old data. New API submissions require explicit consent.

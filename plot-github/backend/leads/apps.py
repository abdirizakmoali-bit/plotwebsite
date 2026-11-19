from django.apps import AppConfig
from django.conf import settings


def allow_estimate_origin(sender, request, **kwargs):
    origin = request.headers.get("origin")
    if not origin or request.path != "/api/estimate-download/":
        return False
    return origin in ("https://plotdevelopments.com", settings.ESTIMATE_PREVIEW_ORIGIN)


class LeadsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "leads"

    def ready(self):
        from corsheaders.signals import check_request_enabled
        check_request_enabled.connect(allow_estimate_origin, dispatch_uid="leads.estimate_origin")

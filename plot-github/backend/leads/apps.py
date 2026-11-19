from django.apps import AppConfig
from django.conf import settings


def allow_estimate_preview(sender, request, **kwargs):
    origin = request.headers.get("origin")
    return bool(origin and request.path == "/api/estimate-download/" and origin == settings.ESTIMATE_PREVIEW_ORIGIN)


class LeadsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "leads"

    def ready(self):
        from corsheaders.signals import check_request_enabled
        check_request_enabled.connect(allow_estimate_preview, dispatch_uid="leads.estimate_preview")

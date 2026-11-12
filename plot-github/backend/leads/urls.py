from django.urls import path
from .views import CreateEnquiry
urlpatterns = [path("enquiries/", CreateEnquiry.as_view(), name="enquiry-create")]

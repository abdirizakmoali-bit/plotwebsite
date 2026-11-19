from django.urls import path
from .views import CreateEnquiry, available_plots

urlpatterns = [
    path("enquiries/", CreateEnquiry.as_view(), name="enquiry-create"),
    path("plots/", available_plots, name="available-plots"),
]

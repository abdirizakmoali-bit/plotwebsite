from django.urls import path
from .views import CreateEnquiry, available_listings

urlpatterns = [
    path("enquiries/", CreateEnquiry.as_view(), name="enquiry-create"),
    path("plots/", available_listings, {"plots_only": True}, name="available-plots"),
    path("listings/", available_listings, name="available-listings"),
]

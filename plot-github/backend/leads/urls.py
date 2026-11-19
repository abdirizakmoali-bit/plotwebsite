from django.urls import path
from .estimate_download import DownloadEstimate
from .views import CreateEnquiry, available_listings

urlpatterns = [
    path("estimate-download/", DownloadEstimate.as_view(), name="estimate-download"),
    path("enquiries/", CreateEnquiry.as_view(), name="enquiry-create"),
    path("plots/", available_listings, {"plots_only": True}, name="available-plots"),
    path("listings/", available_listings, name="available-listings"),
]

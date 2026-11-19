from django.http import JsonResponse
from django.views.decorators.http import require_safe
from .models import LandPlot
from rest_framework import generics, permissions, throttling, status
from rest_framework.response import Response
from .serializers import EnquirySerializer

class CreateEnquiry(generics.CreateAPIView):
    serializer_class = EnquirySerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [throttling.AnonRateThrottle]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        lead = serializer.save()
        # Never return contact details or expose a public list/retrieve endpoint.
        return Response({'reference':str(lead.reference), 'message':'Your enquiry has been received.'}, status=status.HTTP_201_CREATED)


@require_safe
def available_plots(request):
    listings = LandPlot.objects.filter(status=LandPlot.Status.AVAILABLE).values(
        'id', 'title', 'location', 'area_m2', 'dimensions', 'price_usd', 'description', 'photo_url',
    )
    response = JsonResponse({'plots': list(listings)})
    # This catalogue is public and fetched by the separately hosted storefront.
    response['Access-Control-Allow-Origin'] = '*'
    response['Cache-Control'] = 'no-store'
    return response

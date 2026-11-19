from django.db.models import Q
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
def available_listings(request, plots_only=False):
    category = 'land' if plots_only else request.GET.get('category', 'all')
    listings = LandPlot.objects.filter(status=LandPlot.Status.AVAILABLE)
    if category == 'land':
        listings = listings.filter(kind=LandPlot.Kind.LAND)
    elif category == 'property':
        listings = listings.exclude(kind=LandPlot.Kind.LAND)
    elif category != 'all':
        return JsonResponse({'error': 'Choose all, property or land.'}, status=400)

    query = request.GET.get('q', '')[:120].replace('\x00', ' ')
    for word in query.split():
        matches = Q(title__icontains=word) | Q(location__icontains=word) | Q(description__icontains=word) | Q(kind__icontains=word)
        if word.casefold() in ('land', 'plot', 'plots'):
            matches |= Q(kind=LandPlot.Kind.LAND)
        elif word.casefold() in ('property', 'properties'):
            matches |= ~Q(kind=LandPlot.Kind.LAND)
        listings = listings.filter(matches)

    fields = ['id', 'title', 'location', 'area_m2', 'dimensions', 'price_usd', 'description', 'photo_url']
    if not plots_only:
        fields.append('kind')
    response = JsonResponse({'plots' if plots_only else 'listings': list(listings.values(*fields))})
    response['Access-Control-Allow-Origin'] = '*'
    response['Cache-Control'] = 'no-store'
    return response

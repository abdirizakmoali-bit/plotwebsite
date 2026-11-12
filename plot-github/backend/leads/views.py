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

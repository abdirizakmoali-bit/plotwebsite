import re
from django.utils import timezone
from rest_framework import serializers
from .models import Enquiry

class EnquirySerializer(serializers.ModelSerializer):
    website = serializers.CharField(required=False, allow_blank=True, write_only=True, max_length=200)
    submission_id = serializers.UUIDField()
    consent = serializers.BooleanField(required=True)
    class Meta:
        model = Enquiry
        fields = ('submission_id','full_name','phone','email','service','location','brief','budget','timeline','project_stage','contact_preference','consent','utm_source','utm_medium','utm_campaign','landing_path','website')

    def validate_consent(self, value):
        if not value:
            raise serializers.ValidationError('Please agree to be contacted about this project.')
        return value

    def validate_phone(self, value):
        if len(re.sub(r'\D', '', value)) < 7:
            raise serializers.ValidationError('Enter a contact number with at least 7 digits.')
        return value

    def validate_brief(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError('Please tell us a little more, at least 10 characters.')
        return value

    def validate_website(self, value):
        if value:
            raise serializers.ValidationError('Invalid submission.')
        return value

    def validate(self, data):
        if data.get('contact_preference') == 'email' and not data.get('email'):
            raise serializers.ValidationError({'email':'Add your email address or choose another contact method.'})
        return data

    def create(self, validated_data):
        validated_data.pop('website', None)
        # A repeated request with the same random submission token cannot create another lead.
        submission_id = validated_data.pop('submission_id')
        enquiry, _ = Enquiry.objects.get_or_create(submission_id=submission_id, defaults={**validated_data, 'consent_at':timezone.now()})
        return enquiry

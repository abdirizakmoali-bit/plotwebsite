import uuid
from django.core.cache import cache
from django.test import TestCase
from django.urls import reverse
from .models import Enquiry

class EnquiryTests(TestCase):
    def setUp(self):
        cache.clear()
        self.payload = {'submission_id':str(uuid.uuid4()),'full_name':'Test Client','phone':'+252 63 0000000','service':'Architectural design','brief':'A family home design in Hargeisa.','consent':True,'budget':'$50,000–$100,000','timeline':'Within 3 months','utm_source':'instagram'}
    def post(self, **changes):
        return self.client.post(reverse('enquiry-create'), data={**self.payload, **changes}, content_type='application/json')
    def test_create_and_capture_context(self):
        response=self.post()
        self.assertEqual(response.status_code,201)
        lead=Enquiry.objects.get()
        self.assertEqual(lead.utm_source,'instagram')
        self.assertEqual(lead.budget,'$50,000–$100,000')
        self.assertIsNotNone(lead.consent_at)
        self.assertEqual(set(response.json()),{'reference','message'})
    def test_retry_does_not_duplicate(self):
        first=self.post();second=self.post()
        self.assertEqual(first.json()['reference'],second.json()['reference'])
        self.assertEqual(Enquiry.objects.count(),1)
    def test_missing_or_false_consent_rejected(self):
        self.assertEqual(self.post(consent=False).status_code,400)
        del self.payload['consent']
        self.assertEqual(self.post().status_code,400)
        self.assertEqual(Enquiry.objects.count(),0)
    def test_invalid_fields(self):
        for change in [{'phone':'12'},{'service':'invalid'},{'budget':'invalid'},{'brief':'short'},{'contact_preference':'email','email':''},{'website':'https://spam.test'}]:
            self.assertEqual(self.post(**change).status_code,400)
        self.assertEqual(Enquiry.objects.count(),0)
    def test_public_list_not_available(self):
        self.post()
        self.assertEqual(self.client.get(reverse('enquiry-create')).status_code,405)
    def test_internal_fields_cannot_be_set(self):
        self.post(status='won',notes='injected',privacy_version='bad')
        lead=Enquiry.objects.get()
        self.assertEqual(lead.status,'new')
        self.assertEqual(lead.notes,'')
        self.assertEqual(lead.privacy_version,'2026-11-13')
    def test_rate_limit(self):
        for _ in range(20):
            self.assertEqual(self.post().status_code,201)
        self.assertEqual(self.post().status_code,429)

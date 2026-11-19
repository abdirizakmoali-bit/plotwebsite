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


class PlotCatalogueTests(TestCase):
    def test_only_available_plots_are_public(self):
        from .models import LandPlot

        for status in LandPlot.Status:
            LandPlot.objects.create(title=status.label, location='Hargeisa', area_m2=432, status=status)
        response = self.client.get(reverse('available-plots'), HTTP_ORIGIN='https://plotdevelopments.com')
        self.assertEqual(response.status_code, 200)
        self.assertIn(response.headers['Access-Control-Allow-Origin'], ('*', 'https://plotdevelopments.com'))
        listings = response.json()['plots']
        self.assertEqual([plot['title'] for plot in listings], ['Available'])
        self.assertEqual(listings[0]['area_m2'], '432.00')
        self.assertIsNone(listings[0]['price_usd'])

        LandPlot.objects.filter(status=LandPlot.Status.AVAILABLE).update(status=LandPlot.Status.SOLD)
        self.assertEqual(self.client.get(reverse('available-plots')).json()['plots'], [])
        self.assertEqual(self.client.post(reverse('available-plots'), {}).status_code, 405)

    def test_search_by_category_and_words_preserves_land_catalogue(self):
        from .models import LandPlot

        def add(title, kind, status='available'):
            return LandPlot.objects.create(title=title, kind=kind, location='Jigjiga Yar, Hargeisa',
                                           area_m2=200, status=status)
        land = add('Corner parcel', 'land')
        house = add('Courtyard bungalow', 'house')
        flat = add('City apartment', 'apartment')
        for status in ['draft', 'reserved', 'sold']:
            add('Off market house', 'house', status)

        def ids(**params):
            response = self.client.get(reverse('available-listings'), params)
            self.assertEqual(response.status_code, 200)
            return {item['id'] for item in response.json()['listings']}

        self.assertEqual(ids(), {land.id, house.id, flat.id})
        self.assertEqual(ids(category='property', q='  hArGeIsA  '), {house.id, flat.id})
        self.assertEqual(ids(category='property', q='jigjiga bungalow'), {house.id})
        self.assertEqual(ids(category='land', q='plot jigjiga'), {land.id})
        self.assertEqual(ids(category='land', q='apartment'), set())
        self.assertEqual(ids(q='properties'), {house.id, flat.id})
        self.assertEqual(ids(q='no match here'), set())
        old_catalogue = self.client.get(reverse('available-plots')).json()['plots']
        self.assertEqual([row['id'] for row in old_catalogue], [land.id])


class EstimateDownloadTests(TestCase):
    def setUp(self):
        cache.clear()
        self.url = reverse("estimate-download")
        self.data = {"submission_id":str(uuid.uuid4()), "full_name":"Tijaabo Test",
                     "phone":"+252630000000", "email":"test@example.com", "consent":True,
                     "estimate":{"house":"bungalow","finish":"high","ground":"120","wall":"100","landscape":"50"}}

    def submit(self):
        return self.client.post(self.url, self.data, content_type="application/json")

    def test_download_and_retry_share_one_lead_and_reference(self):
        result = self.submit()
        self.assertEqual(result.status_code, 200)
        self.assertTrue(result.content.startswith(b"%PDF"))
        self.assertIn("attachment;", result["Content-Disposition"])
        lead = Enquiry.objects.get()
        self.assertEqual(lead.email, self.data["email"])
        self.assertEqual(lead.phone, self.data["phone"])
        self.assertIn("51,460.00", lead.brief)
        self.assertIn(str(lead.reference), result["Content-Disposition"])
        self.assertEqual(self.submit().status_code, 200)
        self.assertEqual(Enquiry.objects.count(), 1)

    def test_missing_contacts_consent_or_areas_never_release_pdf(self):
        for field, bad in [("phone","123"),("email","bad"),("full_name"," "),("consent",False),("estimate",{})]:
            previous = self.data[field]; self.data[field] = bad
            response = self.submit()
            self.assertEqual(response.status_code, 400)
            self.assertNotEqual(response["Content-Type"], "application/pdf")
            self.data[field] = previous
        self.assertFalse(Enquiry.objects.exists())

    def test_standard_and_framed_rates(self):
        from .estimate_download import EstimateInputs, calculate
        cases = [("bungalow","standard",[],"47500.00"), ("framed","high",["100","40"],"143805.00")]
        for house, finish, floors, expected in cases:
            serializer = EstimateInputs(data={**self.data["estimate"],"house":house,"finish":finish,"upper":floors})
            serializer.is_valid(raise_exception=True)
            self.assertEqual(str(calculate(serializer.validated_data)[1]), expected)

    def test_preview_origin_only_applies_to_download(self):
        origin = "https://preview.example.com"
        with self.settings(ESTIMATE_PREVIEW_ORIGIN=origin):
            opts = {"HTTP_ORIGIN":origin, "HTTP_ACCESS_CONTROL_REQUEST_METHOD":"POST"}
            self.assertEqual(self.client.options(self.url, **opts).get("Access-Control-Allow-Origin"), origin)
            self.assertIsNone(self.client.options(reverse("enquiry-create"), **opts).get("Access-Control-Allow-Origin"))

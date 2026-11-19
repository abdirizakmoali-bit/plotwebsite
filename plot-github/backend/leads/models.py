import uuid
from decimal import Decimal
from django.core.validators import MinValueValidator, URLValidator
from django.db import models

SERVICES = [(s, s) for s in ['Architectural design', 'Structural engineering', 'Cost estimation / BOQ', 'Construction management', 'Property development', 'Other / Not sure yet']]
BUDGETS = [(s, s) for s in ['Not decided', 'Under $50,000', '$50,000–$100,000', '$100,000–$250,000', '$250,000+']]
TIMELINES = [(s, s) for s in ['Exploring options', 'Within 3 months', '3–6 months', '6–12 months']]
STAGES = [(s, s) for s in ['Idea stage', 'Land secured', 'Design in progress', 'Ready to build', 'Already building']]

class Enquiry(models.Model):
    reference = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    submission_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    full_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=60)
    email = models.EmailField(blank=True)
    service = models.CharField(max_length=100, choices=SERVICES)
    location = models.CharField(max_length=100, blank=True)
    brief = models.TextField(max_length=1500)
    budget = models.CharField(max_length=50, choices=BUDGETS, default='Not decided')
    timeline = models.CharField(max_length=50, choices=TIMELINES, default='Exploring options')
    project_stage = models.CharField(max_length=50, choices=STAGES, default='Idea stage')
    contact_preference = models.CharField(max_length=20, choices=[('phone','Phone'),('whatsapp','WhatsApp'),('email','Email')], default='phone')
    consent = models.BooleanField(default=False)
    consent_at = models.DateTimeField(null=True, blank=True)
    privacy_version = models.CharField(max_length=20, default='2026-11-13')
    utm_source = models.CharField(max_length=150, blank=True)
    utm_medium = models.CharField(max_length=150, blank=True)
    utm_campaign = models.CharField(max_length=150, blank=True)
    landing_path = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=20, choices=[('new','New'),('contacted','Contacted'),('qualified','Qualified'),('proposal','Proposal sent'),('won','Won'),('lost','Lost')], default='new')
    notes = models.TextField(blank=True)
    follow_up_on = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_reviewed = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'enquiries'

    def __str__(self):
        return f'{self.full_name} | {self.service}'


class LandPlot(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        AVAILABLE = 'available', 'Available'
        RESERVED = 'reserved', 'Reserved'
        SOLD = 'sold', 'Sold'

    title = models.CharField(max_length=120)
    location = models.CharField(max_length=150, help_text='Neighbourhood and town, as shown to buyers.')
    area_m2 = models.DecimalField('area (m²)', max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    dimensions = models.CharField(max_length=80, blank=True, help_text='Optional, for example 18 × 24 m.')
    price_usd = models.DecimalField('asking price (USD)', max_digits=14, decimal_places=2, blank=True, null=True,
                                    validators=[MinValueValidator(Decimal('0.01'))], help_text='Leave blank for price on request.')
    description = models.TextField(blank=True, max_length=800)
    photo_url = models.URLField('plot photo URL', max_length=1000, blank=True,
                                validators=[URLValidator(schemes=['https'])], help_text='HTTPS link to a photo of this plot.')
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.DRAFT,
                              help_text='Only available plots appear on the website.')

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.title

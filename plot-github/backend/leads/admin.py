from django.contrib import admin
from .models import Enquiry, LandPlot

@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ('full_name','service','budget','timeline','status','follow_up_on','utm_source','created_at')
    list_filter = ('status','service','timeline','budget','contact_preference','created_at')
    search_fields = ('full_name','phone','email','location','brief','utm_campaign')
    list_editable = ('status','follow_up_on')
    readonly_fields = ('reference','submission_id','created_at','consent_at','privacy_version')
    fieldsets = (
        ('Follow-up', {'fields':('status','follow_up_on','notes','is_reviewed')}),
        ('Contact', {'fields':('full_name','phone','email','contact_preference')}),
        ('Project', {'fields':('service','location','budget','timeline','project_stage','brief')}),
        ('Attribution & consent', {'fields':('utm_source','utm_medium','utm_campaign','landing_path','consent','consent_at','privacy_version')}),
        ('Record', {'fields':('reference','submission_id','created_at')}),
    )


@admin.register(LandPlot)
class LandPlotAdmin(admin.ModelAdmin):
    list_display = ('title', 'kind', 'location', 'area_m2', 'price_usd', 'status')
    list_filter = ('status', 'kind')
    search_fields = ('title', 'location')
    list_editable = ('status',)


admin.site.site_header = 'PLOT | Sales and enquiries'
admin.site.site_title = 'PLOT Admin'
admin.site.index_title = 'Your project pipeline'

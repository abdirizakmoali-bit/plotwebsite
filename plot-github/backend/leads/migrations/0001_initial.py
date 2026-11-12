from django.db import migrations, models

class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [migrations.CreateModel(
        name="Enquiry",
        fields=[
            ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
            ("full_name", models.CharField(max_length=100)),
            ("phone", models.CharField(max_length=60)),
            ("email", models.EmailField(blank=True, max_length=254)),
            ("service", models.CharField(max_length=100)),
            ("location", models.CharField(blank=True, max_length=100)),
            ("brief", models.TextField(max_length=1500)),
            ("created_at", models.DateTimeField(auto_now_add=True)),
            ("is_reviewed", models.BooleanField(default=False)),
        ],
        options={"ordering":["-created_at"], "verbose_name_plural":"enquiries"},
    )]

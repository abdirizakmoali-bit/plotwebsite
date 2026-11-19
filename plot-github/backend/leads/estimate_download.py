from decimal import Decimal, ROUND_HALF_UP
from io import BytesIO
from xml.sax.saxutils import escape

from django.http import HttpResponse
from django.utils import timezone
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import EnquirySerializer

CENT = Decimal("0.01")


def cost(value):
    return value.quantize(CENT, rounding=ROUND_HALF_UP)


def usd(value):
    return f"${value:,.2f}".removesuffix(".00")


class EstimateInputs(serializers.Serializer):
    house = serializers.ChoiceField(choices=["bungalow", "framed"])
    finish = serializers.ChoiceField(choices=["standard", "high"])
    ground = serializers.DecimalField(max_digits=14, decimal_places=2, min_value=CENT)
    upper = serializers.ListField(child=serializers.DecimalField(max_digits=14, decimal_places=2, min_value=CENT), max_length=100, default=list)
    wall = serializers.DecimalField(max_digits=14, decimal_places=2, min_value=0, default=Decimal(0))
    landscape = serializers.DecimalField(max_digits=14, decimal_places=2, min_value=0, default=Decimal(0))

    def validate(self, data):
        if data["house"] == "bungalow" and data["upper"]:
            raise serializers.ValidationError("Upper floors require a framed house.")
        return data


def calculate(data):
    multiplier = Decimal("1.15") if data["finish"] == "high" else Decimal(1)
    lower_rate = (200 if data["house"] == "bungalow" else 400) * multiplier
    measured = [("Dabaqa hoose", data["ground"], lower_rate)]
    measured.extend((f"Dabaqa {i}aad", area, 350 * multiplier) for i, area in enumerate(data["upper"], 1))
    measured.extend([("Dayrka", data["wall"], 150), ("Habaynta daaradda", data["landscape"], 20)])
    rows = [(label, f"{area.normalize():f} m² × {usd(rate)}/m²", cost(area * rate)) for label, area, rate in measured]
    subtotal = sum(row[2] for row in rows)
    rows.extend([("Korontada iyo tuubooyinka", "10% × " + usd(subtotal), cost(subtotal / 10)),
                 ("Haanta bulaacadda", "Hal haan", Decimal(3500))])
    return rows, sum(row[2] for row in rows)


def make_pdf(name, reference, house, finish, rows, total):
    stream = BytesIO()
    doc = SimpleDocTemplate(stream, pagesize=A4, leftMargin=20*mm, rightMargin=20*mm,
                            topMargin=23*mm, bottomMargin=22*mm, title="PLOT | Qiyaasta dhismaha")
    ink, green, pale = "#192E29", "#254D40", "#EFF3EF"
    text = ParagraphStyle("Body", fontName="Helvetica", fontSize=10, leading=15, textColor=colors.HexColor(ink))
    title = ParagraphStyle("Title", parent=text, fontName="Times-Bold", fontSize=28, leading=33, spaceAfter=12)
    small = ParagraphStyle("Small", parent=text, fontSize=9, leading=14)
    parts = [Paragraph("Qiyaasta dhismaha gurigaaga", title),
             Paragraph(f"Loo diyaariyey <b>{escape(name)}</b>", text),
             Paragraph(f"Hargeysa · {house} · Dhammaystir {finish.lower()} ah", text),
             Paragraph(f"{timezone.localdate():%d/%m/%Y} · Tixraac {escape(str(reference))}", small), Spacer(1, 14)]
    content = [["Qaybta shaqada", "Cabbirka iyo qiimaha", "Kharashka (USD)"]]
    content += [[label, detail, usd(amount)] for label, detail, amount in rows]
    table = Table(content, colWidths=[59*mm, 70*mm, 40*mm], repeatRows=1, hAlign="LEFT")
    table.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,0),colors.HexColor(green)), ("TEXTCOLOR",(0,0),(-1,0),colors.white),
        ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"), ("FONTSIZE",(0,0),(-1,-1),9),
        ("ALIGN",(-1,0),(-1,-1),"RIGHT"), ("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white,colors.HexColor(pale)]),
        ("TOPPADDING",(0,0),(-1,-1),8), ("BOTTOMPADDING",(0,0),(-1,-1),8)]))
    parts += [table, Spacer(1, 16), Paragraph(f"Wadarta qiyaasta · <b>{usd(total)}</b>", ParagraphStyle("Total",parent=text,fontSize=18,leading=24)),
              Spacer(1, 14), Paragraph("Qiimaha dhismaha waxa ku jira saqafka, albaabbada, daaqadaha, marmarka sagxadda iyo rinjiga. Dhammaystirka heerka sare ah wuxuu ku darayaa 15% qiimaha dhismaha guriga.", text),
              Spacer(1, 7), Paragraph("Qiyaastani waa hordhac. Qiimaha kama dambaysta ahi wuxuu ku xiran yahay naqshadda, goobta iyo agabka aad doorato.", text),
              Spacer(1, 10), Paragraph('Su’aal ma qabtaa? <link href="https://wa.me/252638339599" color="#254D40"><u>PLOT kala hadal WhatsApp · +252 63 833 9599</u></link>', text)]
    def furniture(canvas, document):
        w, h = A4
        canvas.setFillColor(colors.HexColor(green)); canvas.setFont("Helvetica-Bold", 12)
        canvas.drawString(20*mm, h-14*mm, "PLOT")
        canvas.setFont("Helvetica",9); canvas.drawRightString(w-20*mm, h-14*mm, "HARGEYSA  /  SOMALILAND")
        canvas.setStrokeColor(colors.HexColor("#B19C72")); canvas.line(20*mm,h-17*mm,w-20*mm,h-17*mm)
        canvas.drawString(20*mm,12*mm,"PLOT · Engineering & Property Development")
        canvas.drawRightString(w-20*mm,12*mm,str(document.page))
    doc.build(parts, onFirstPage=furniture, onLaterPages=furniture)
    return stream.getvalue()


class DownloadEstimate(APIView):
    def post(self, request):
        raw = request.data
        if not isinstance(raw, dict):
            raise serializers.ValidationError("Expected an estimate and contact details.")
        inputs = EstimateInputs(data=raw.get("estimate", {}))
        inputs.is_valid(raise_exception=True)
        data = inputs.validated_data
        rows, total = calculate(data)
        house = "Guri baloog ah" if data["house"] == "bungalow" else "Guri shub ah"
        finish = "Heer sare" if data["finish"] == "high" else "Caadi"
        brief = f"Estimate PDF | Hargeysa | {house} | {finish} | USD {total:,.2f}\n" + "\n".join(
            f"{label}: {detail} = {usd(amount)}" for label, detail, amount in rows)
        fields = {k:raw[k] for k in ("submission_id","full_name","phone","email","consent","website","utm_source","utm_medium","utm_campaign") if k in raw}
        if not str(fields.get("full_name", "")).strip() or not fields.get("email"):
            raise serializers.ValidationError("Name, phone and email are required.")
        lead_input = EnquirySerializer(data={**fields, "service":"Cost estimation / BOQ", "contact_preference":"email",
                                             "location":"Hargeysa", "landing_path":"/qiyaas/", "brief":brief[:1500]})
        lead_input.is_valid(raise_exception=True)
        lead = lead_input.save()
        if any(getattr(lead, k) != lead_input.validated_data[k] for k in ("full_name", "email", "phone", "brief")):
            return Response({"detail":"Submission ID already used."}, status=status.HTTP_409_CONFLICT)
        pdf = make_pdf(lead.full_name, lead.reference, house, finish, rows, total)
        response = HttpResponse(pdf, content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="PLOT-Qiyaas-{lead.reference}.pdf"'
        response["Cache-Control"] = "private, no-store"
        return response

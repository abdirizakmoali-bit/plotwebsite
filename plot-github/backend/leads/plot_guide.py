"""Illustrated Somali guide and rectangular site diagram used in the estimate PDF."""
from decimal import Decimal
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import Flowable


ASSETS = Path(__file__).parent / "report_assets"
GREEN, GOLD, PALE, LIGHT, LEAF = "#203e32", "#ad8c53", "#f6f3e9", "#e5eddf", "#7fa781"
EDGES = {"back": "Dhabarka", "front": "Hore", "left": "Bidix", "right": "Midig"}
EXAMPLE = (Decimal(20), Decimal(30), Decimal(120), "back")
GUIDE_FILE = "PLOT-Hagaha-Dhulka.pdf"


def number(value):
    whole = format(value, ",.2f")
    return whole.rstrip("0").rstrip(".")


def label(c, x, y, value, size=11, font="Helvetica", color=GREEN):
    c.setFillColor(HexColor(color))
    c.setFont(font, size)
    c.drawString(x, y, value)


def pattern(c, x, y, width, height):
    if width <= 0 or height <= 0:
        return
    c.setFillColor(HexColor(LEAF))
    c.rect(x, y, width, height, stroke=0, fill=1)
    c.saveState()
    path = c.beginPath()
    path.rect(x, y, width, height)
    c.clipPath(path, stroke=0, fill=0)
    c.setStrokeColor(HexColor("#537e57"))
    c.setLineWidth(.55)
    for i in range(-int(height)-1, int(width)+1, 7):
        c.line(x+i, y, x+i+height, y+height)
    c.restoreState()


def photo_guide(c):
    label(c, 0, 641, "HARGEYSA   /   HAGAHA DHULKA", 10, "Helvetica-Bold", "#687b66")
    label(c, 0, 598, "Akhri qorshaha dhulkaaga.", 29, "Times-Bold")
    label(c, 0, 567, "Saddex cabbir ayaa kaa caawinaya inaad qorshayso bedka dhulka,")
    label(c, 0, 551, "darbiga dayrka iyo qaybta bannaanka ee aad rabto inaad habayso.")
    width, gap = 224, 15
    entries = [
        ("courtyard.jpg", "Dayrka guriga", "Hargeysa · Guri iyo darbiga ku wareegsan.",
         "Unieco · CC BY-SA 1.0 · la jaray", "https://commons.wikimedia.org/wiki/File:House_in_Hargeisa_2.jpg",
         "https://creativecommons.org/licenses/by-sa/1.0/"),
        ("district.jpg", "Dhulalka xaafadda", "Hargeysa · Muuqaalka dhulal isku dhow.",
         "Retlaw Snellac Photography · CC BY 2.0 · la jaray", "https://commons.wikimedia.org/wiki/File:Hargskyl1.jpg",
         "https://creativecommons.org/licenses/by/2.0/")]
    for i, (file, title, desc, credit, source, license_url) in enumerate(entries):
        x = i*(width+gap)
        c.drawImage(str(ASSETS / file), x, 350, width=width, height=158)
        label(c, x, 327, title, 16, "Times-Bold")
        label(c, x, 309, desc, 9)
        label(c, x, 294, credit, 7.3, color="#526953")
        c.linkURL(source, (x, 350, x+width, 508), relative=1, thickness=0)
        c.linkURL(license_url, (x, 290, x+width, 303), relative=1, thickness=0)
    for y, title, line in [
        (237, "Cabbir dhulka", "Dhul leydi ah, ballaca ku dhufo dhererka si aad u hesho bedka (m²)."),
        (178, "Cabbir darbiga dayrka", "Dhererka darbiga la dhisayo (m) ku dhufo jooggiisa (m). Hal dhinac cabbir."),
        (119, "Cabbir daaradda la habaynayo", "Isku dar meelaha aad rabto inaad cagaarayso ama aad bannaanka ka habayso.")]:
        c.setStrokeColor(HexColor("#cbd4c7"))
        c.line(0, y+19, 463, y+19)
        label(c, 0, y, title, 13, "Helvetica-Bold")
        label(c, 0, y-19, line, 10)
    label(c, 0, 45, "Su'aal ku saabsan cabbirrada? WhatsApp  +252 63 833 9599", 11, "Helvetica-Bold")
    c.linkURL("https://wa.me/252638339599", (0,39,360,59), relative=1, thickness=0)


def site_plan(c, data=None):
    personal = data is not None and "plot_width" in data
    w, d, area, edge = ((data["plot_width"], data["plot_depth"], data["landscape"], data["landscape_edge"])
                        if personal else EXAMPLE)
    size, boundary = w*d, 2*(w+d)
    label(c, 0, 641, "DHULKA   /   JAANTUSKA GOOBTA", 10, "Helvetica-Bold", "#687b66")
    label(c, 0, 598, "Qorshaha dhulkaaga" if personal else "Qorshe tusaale ah", 29, "Times-Bold")
    label(c, 0, 569, "Jaantuskani wuxuu ku salaysan yahay cabbirrada aad gelisay." if personal else
          "Tusaale keliya. Cabbirrada halkan ku yaal waa kuwo tusaale ah.", 11)
    label(c, 0, 549, "Xariiqda madow waa xadka dhulka. Xariijimaha cagaaran waa daaradda la habaynayo.", 10)
    c.setFillColor(HexColor(PALE))
    c.roundRect(0, 239, 463, 285, 8, fill=1, stroke=0)
    ratio = min(300/float(w), 208/float(d))
    pw, pd = float(w)*ratio, float(d)*ratio
    x, y = (463-pw)/2, 378-pd/2
    c.setFillColor(HexColor("#ffffff")); c.rect(x, y, pw, pd, fill=1, stroke=0)
    portion = float(area/size)
    sw, sh = (pw*portion, pd) if edge in ("left","right") else (pw, pd*portion)
    pattern(c, x+(pw-sw if edge == "right" else 0), y+(pd-sh if edge == "back" else 0), sw, sh)
    c.setLineWidth(1.8); c.setStrokeColor(HexColor(GREEN)); c.rect(x,y,pw,pd,fill=0)
    c.setFont("Helvetica-Bold", 10); c.setFillColor(HexColor(GREEN))
    c.drawCentredString(x+pw/2, y+pd+9, number(w)+" m")
    c.saveState(); c.translate(x-10,y+pd/2); c.rotate(90); c.drawCentredString(0,0,number(d)+" m"); c.restoreState()
    label(c, 12, 249, "HORE  /  Dhinaca hoose ee jaantuska", 8, color="#5a6a5a")
    for x, head, val in [(0, "Bedka dhulka", number(size)+" m²"), (158,"Wareegga xadka",number(boundary)+" m"),
                         (316,"Daaradda",number(area)+" m²")]:
        label(c, x, 210, head, 9, "Helvetica-Bold", "#637663")
        label(c, x, 186, val, min(18, 210/len(val)), "Times-Bold")
    label(c, 0, 140, "Sida loo akhriyo jaantuska", 15, "Times-Bold")
    label(c, 0, 118, "Meesha habaynta: "+(EDGES[edge] if area else "Lama dooran")+".", 10)
    label(c, 0, 99, "Habaynta waxaa loo sawiray xarriiq leydi ah oo bedkeedu la mid yahay cabbirka.", 10)
    label(c, 0, 80, "Xadka waxaa lagu cabbiray mitir. Bedka darbiga dayrka waxaa lagu cabbiraa m².", 10)
    label(c, 0, 61, "Goobta saxda ah iyo qaabka dhabta ah ku xaqiiji cabbir goobta lagu sameeyo.", 10)


class IllustratedSheet(Flowable):
    width, height = 463, 657

    def __init__(self, painter, *args):
        super().__init__()
        self.width, self.height = 463, 657
        self.painter, self.args = painter, args

    def draw(self):
        self.painter(self.canv, *self.args)


def write_sample(path):
    c = Canvas(str(path), pagesize=A4, invariant=1)
    c.setTitle("PLOT | Hagaha dhulka iyo qorshe tusaale ah")
    for index, painter in enumerate((photo_guide, site_plan), 1):
        label(c, 64, 789, "PLOT", 19, "Helvetica-Bold")
        label(c, 407, 793, "HARGEYSA / SOMALILAND", 8)
        c.setStrokeColor(HexColor(GOLD)); c.line(64,778,528,778)
        c.saveState(); c.translate(64, 91); painter(c); c.restoreState()
        label(c, 64, 39, "PLOT · Engineering & Property Development", 8)
        label(c, 513, 39, str(index), 9)
        c.showPage()
    c.save()


if __name__ == "__main__":
    import sys
    write_sample(sys.argv[1])

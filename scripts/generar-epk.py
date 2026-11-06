"""Build the downloadable EPK: python scripts/generar-epk.py (Pillow, reportlab)."""
from pathlib import Path
from io import BytesIO
from html import escape
from urllib.parse import quote
import json
import reportlab
from PIL import Image
import fitz
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'media/prensa/punkies-y-cerebro-epk.pdf'
DATA = json.loads((ROOT / 'content/site.json').read_text())
RIDER = ROOT / 'media/prensa/punkies-y-cerebro-rider-tecnico.pdf'
if not RIDER.is_file():
    raise FileNotFoundError('Genera primero el rider con python scripts/generar-rider.py')
PRESS_TEXT = (ROOT / 'content/punkies-y-cerebro-biografia.txt').read_text()
BIO = PRESS_TEXT.split('\n\n', 1)[1].split('\n\nEN LOS ESCENARIOS DE COLOMBIA')[0]
TRAJECTORY = PRESS_TEXT.split('EN LOS ESCENARIOS DE COLOMBIA\n\n', 1)[1].split('\n\nFORMACIÓN', 1)[0]
SITE = 'https://punkiesycerebro.com/'
WA = 'https://wa.me/573045377640?text=' + quote('Hola, quiero información de contratación de Punkies y Cerebro. Vi su EPK.')
EMAIL = 'punkiesycerebro@gmail.com'
RED, WHITE, MUTED, PANEL, LINE = map(HexColor, ['#c90c19', '#ffffff', '#cdcdcd', '#171717', '#393939'])
W, H = A4
M, CW = 40, W - 80
fonts = Path(reportlab.__file__).parent / 'fonts'
pdfmetrics.registerFont(TTFont('Body', str(fonts / 'Vera.ttf')))
pdfmetrics.registerFont(TTFont('BodyBold', str(fonts / 'VeraBd.ttf')))
pdfmetrics.registerFont(TTFont('Anton', str(ROOT / 'assets/fonts/Anton-Regular.ttf')))
OUT.parent.mkdir(parents=True, exist_ok=True)
c = canvas.Canvas(str(OUT), pagesize=A4, pageCompression=1)
c.setTitle('Punkies y Cerebro — EPK | Electronic Press Kit')
c.setAuthor('Punkies y Cerebro')
c.setSubject('Biografía, formación, música, materiales de prensa, contratación y rider técnico')
c.setCreator('Punkies y Cerebro · EPK oficial')


def text(value, x, y, size=11, font='Body', color=WHITE):
    c.setFillColor(color)
    c.setFont(font, size)
    c.drawString(x, y, value)


def label(value, x, y):
    c.setFillColor(RED)
    t = c.beginText(x, y)
    t.setFont('BodyBold', 9)
    t.setCharSpace(1.4)
    t.textOut(value)
    t.setCharSpace(0)
    c.drawText(t)


def para(value, x, top, width, size=11, leading=18, color=MUTED):
    p = Paragraph(escape(value), ParagraphStyle('p', fontName='Body', fontSize=size, leading=leading, textColor=color))
    _, height = p.wrap(width, H)
    p.drawOn(c, x, top-height)
    return top-height


def photo(path, x, y, width, height):
    with Image.open(ROOT / path) as original:
        im = original.copy()
    im.thumbnail((round(width*2.5), round(height*2.5)), Image.Resampling.LANCZOS)
    buf = BytesIO()
    if 'A' in im.getbands():
        im.save(buf, format='PNG')
    else:
        im.convert('RGB').save(buf, format='JPEG', quality=88, optimize=True)
    buf.seek(0)
    c.drawImage(ImageReader(buf), x, y, width=width, height=height, preserveAspectRatio=True, anchor='c', mask='auto')


def link(label_text, url, x, y, width, height=35, primary=False):
    c.setFillColor(RED if primary else PANEL)
    c.setStrokeColor(RED if primary else LINE)
    c.rect(x, y, width, height, fill=1, stroke=1)
    size = 10
    while pdfmetrics.stringWidth(label_text, 'BodyBold', size) > width-20:
        size -= .25
    text(label_text, x+10, y+(height-size)/2+2, size, 'BodyBold')
    c.linkURL(url, (x, y, x+width, y+height), relative=0, thickness=0)


def page(number, section):
    c.setFillColor(HexColor('#080808'))
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(RED)
    c.rect(0, 0, 7, H, fill=1, stroke=0)
    label('PUNKIES Y CEREBRO / ' + section, M, H-43)
    c.setStrokeColor(LINE)
    c.line(M, 40, W-M, 40)
    text('punkiesycerebro.com', M, 24, 8, color=MUTED)
    c.linkURL(SITE+'#epk', (M, 20, M+160, 36), relative=0, thickness=0)
    text(f'EPK · {number:02d} / 07', W-M-83, 24, 8, color=MUTED)


# 01 — Cover, preserving the original wordmark.
page(1, 'KIT DE PRENSA')
photo('assets/logo-letras.png', M, 663, CW, 112)
text('Electronic Press Kit · Kit de prensa electrónico', M, 650, 11, color=MUTED)
text('PUNK ROCK LIBRE.', M, 594, 38, 'Anton')
text('DESDE MEDELLÍN.', M, 547, 38, 'Anton')
text('Medellín, Colombia   /   Desde 2005   /   Punk rock', M, 515, 10, color=MUTED)
photo('media/punkies-y-cerebro-concierto.jpeg', M, 196, CW, 290)
c.setFillColor(RED)
c.rect(M, 190, CW, 4, fill=1, stroke=0)
text('«Que caiga lo que apeste a poder».', M, 149, 22, 'Anton')
text('Música, trayectoria y material oficial para prensa y contratación.', M, 119, 10, color=MUTED)
link('VER EPK EN LÍNEA', SITE+'#epk', M, 65, 175)
c.showPage()

# 02 — Band and formation.
page(2, 'LA BANDA')
text('UNA HISTORIA. EL MISMO RUIDO.', M, 739, 31, 'Anton')
y = 702
for p in BIO.split('\n\n'):
    y = para(p, M, y, CW, 11, 18) - 12
label('FORMACIÓN', M, 452)
band = [
    ('Jimmy Jazz', 'Voz y bajo', 'media/Jimmy Jazz_Voz y Bajo.jpeg'),
    ('Juan Camilo R', 'Batería y coros', 'media/Juan Camilo R_Bateria.jpeg'),
    ('Alejandro Cuadros', 'Guitarra y coros', 'media/Alejo_Guitarra.jpeg'),
    ('Sebastián Prieto', 'Guitarra y coros', 'media/Sebas_Guitarra.jpeg'),
]
gap = 13
pw = (CW-gap*3)/4
for i, (name, role, image) in enumerate(band):
    x = M+i*(pw+gap)
    c.setFillColor(PANEL)
    c.rect(x, 225, pw, 206, fill=1, stroke=0)
    photo(image, x+4, 230, pw-8, 196)
    text(name, x, 205, 11, 'Anton')
    text(role, x, 189, 8, color=MUTED)
label('EN LOS ESCENARIOS DE COLOMBIA', M, 154)
para(TRAJECTORY, M, 134, CW, 10, 16)
c.showPage()

# 03 — All releases, with real links and upcoming material identified.
page(3, 'MÚSICA Y VIDEO')
text('ESCUCHA LA PROPUESTA.', M, 739, 34, 'Anton')
para('Punk rock con letras de contenido social y crítico. Abre cada enlace para escuchar o descargar el material.', M, 711, CW, 10, 16)
gap = 16
cardw = (CW-gap*2)/3
for i, release in enumerate(DATA['discos']):
    x = M+(i%3)*(cardw+gap)
    bottom = 425-(i//3)*257
    c.setFillColor(PANEL)
    c.rect(x, bottom, cardw, 242, fill=1, stroke=0)
    photo(release['imagen'], x+10, bottom+100, cardw-20, 132)
    label(str(release['anio']), x+10, bottom+85)
    p = Paragraph(escape(release['titulo']), ParagraphStyle('album', fontName='BodyBold', fontSize=9, leading=12, textColor=WHITE))
    _, h = p.wrap(cardw-20, 70)
    p.drawOn(c, x+10, bottom+72-h)
    kind = release['tipo']
    url = release['enlace'] or SITE+'#musica'
    caption = 'PRÓXIMAMENTE' if kind=='proximamente' else ('SPOTIFY' if kind=='spotify' else 'DESCARGAR')
    text(caption, x+10, bottom+14, 8, 'BodyBold', RED)
    c.linkURL(url, (x, bottom, x+cardw, bottom+242), relative=0, thickness=0)
link('SPOTIFY DE LA BANDA', DATA['spotify'], M, 95, (CW-16)/2)
link('VIDEOS EN YOUTUBE', DATA['youtube'], M+(CW+16)/2, 95, (CW-16)/2)
c.showPage()

# 04 — Contact, approved rider and original downloadable press materials.
page(4, 'PRENSA Y CONTRATACIÓN')
text('HABLEMOS.', M, 725, 60, 'Anton')
label('MANAGEMENT & BOOKING', M, 680)
text('Juan Camilo R.', M, 640, 29, 'Anton')
text('+57 304 537 76 40', M, 606, 20)
c.linkURL('tel:+573045377640', (M, 600, M+300, 630), relative=0, thickness=0)
text(EMAIL, M, 575, 16)
c.linkURL('mailto:'+EMAIL, (M, 568, W-M, 595), relative=0, thickness=0)
para('Contratación, conciertos, colaboraciones y prensa.', M, 547, CW, 11, 18)
link('HABLAR POR WHATSAPP', WA, M, 479, (CW-16)/2, primary=True)
link('DESCARGAR RIDER TÉCNICO', SITE+'media/prensa/punkies-y-cerebro-rider-tecnico.pdf?v=20261106-guia-bateria', M+(CW+16)/2, 479, (CW-16)/2)
label('MATERIAL ORIGINAL PARA DIFUSIÓN', M, 435)
resources = [
    ('FOTOS DE LOS INTEGRANTES', SITE+'#epk'),
    ('FOTO DEL CONCIERTO', SITE+'media/punkies-y-cerebro-concierto.jpeg'),
    ('LOGO DE PUNKIES Y CEREBRO', SITE+'assets/logo-letras.png'),
    ('EMBLEMA DE LA BANDA', SITE+'assets/logo-emblema.png'),
    ('BIOGRAFÍA PARA PRENSA', SITE+'content/punkies-y-cerebro-biografia.txt'),
]
for i, (caption, url) in enumerate(resources):
    y = 384-i*44
    link(caption, url, M, y, CW, 34)
text('ENLACES OFICIALES', M, 166, 12, 'Anton')
for i, (label_text, key) in enumerate([('SPOTIFY', 'spotify'), ('YOUTUBE', 'youtube'), ('INSTAGRAM', 'instagram'), ('FACEBOOK', 'facebook')]):
    width = (CW-24)/4
    link(label_text, DATA[key], M+i*(width+8), 112, width, 30)
text('Kit de prensa · Noviembre de 2026', M, 72, 9, color=MUTED)
c.showPage()
c.save()
# Append the same approved technical rider available on the website.
base = fitz.open(OUT)
rider = fitz.open(RIDER)
if len(rider) != 3:
    raise ValueError('Revisar la paginación del rider antes de generar el EPK')
merged = fitz.open()
merged.insert_pdf(base)
merged.insert_pdf(rider)
merged.set_metadata(base.metadata)
for i in range(4, len(merged)):
    page_pdf = merged[i]
    page_pdf.add_redact_annot(fitz.Rect(W-M-95, H-56, W-M+2, H-42), fill=(1,1,1))
    page_pdf.apply_redactions()
    page_pdf.insert_text((W-M-83, H-46), f'EPK · {i+1:02d} / 07', fontsize=8, fontname='helv', color=(.1,.1,.1))
payload = merged.tobytes(garbage=4, deflate=True)
merged.close()
rider.close()
base.close()
OUT.write_bytes(payload)
print(OUT)

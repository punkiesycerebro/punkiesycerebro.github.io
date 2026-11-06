"""Illustrate the drummer-confirmed layout, with labels and audience orientation."""
from pathlib import Path
import math
import fitz
import reportlab
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'media/prensa/punkies-y-cerebro-set-bateria.png'
TEMP = Path('/tmp/pyc-set-bateria.pdf')
FONTS = Path(reportlab.__file__).parent / 'fonts'
pdfmetrics.registerFont(TTFont('SetRegular', str(FONTS/'Vera.ttf')))
pdfmetrics.registerFont(TTFont('SetBold', str(FONTS/'VeraBd.ttf')))
c = canvas.Canvas(str(TEMP), pagesize=(1000,900))
c.setFillColor(HexColor('#ffffff')); c.rect(0,0,1000,900,fill=1,stroke=0)

def text(s,x,y,size=17,bold=False,color='#191919'):
    c.setFillColor(HexColor(color)); c.setFont('SetBold' if bold else 'SetRegular',size)
    c.drawCentredString(x,y,s)

def label(s,x,y,width=180):
    c.setFillColor(HexColor('#ffffff')); c.setStrokeColor(HexColor('#333333'))
    c.roundRect(x-width/2,y-10,width,31,4,fill=1,stroke=1)
    text(s,x,y,16,True)

def cymbal(x,y,r,name):
    c.setFillColor(HexColor('#d8a64a')); c.setStrokeColor(HexColor('#8d6022'))
    c.circle(x,y,r,fill=1,stroke=1)
    c.setLineWidth(.6)
    for i in range(1,15):
        c.setStrokeColor(HexColor('#b78332' if i%2 else '#e6bd66'))
        c.circle(x,y,r*i/15,fill=0,stroke=1)
    c.setFillColor(HexColor('#a76e24')); c.circle(x,y,r*.15,fill=1,stroke=0)
    c.setFillColor(HexColor('#303030')); c.circle(x,y,5,fill=1,stroke=0)
    label(name,x,y-r*.52,160 if name!='HI-HAT' else 130)

def drum(x,y,r,name,width=180):
    c.setFillColor(HexColor('#c38536')); c.setStrokeColor(HexColor('#64421f'))
    c.setLineWidth(2); c.circle(x,y,r,fill=1,stroke=1)
    c.setFillColor(HexColor('#f1ece2')); c.setStrokeColor(HexColor('#777777'))
    c.circle(x,y,r-9,fill=1,stroke=1)
    for n in range(10):
        a=n*math.tau/10
        c.setFillColor(HexColor('#999999'))
        c.circle(x+(r-4)*math.cos(a),y+(r-4)*math.sin(a),3,fill=1,stroke=0)
    label(name,x,y-5,width)

text('DISTRIBUCIÓN DE BATERÍA',500,858,26,True)
text('1 TOM DE AIRE + 1 TOM DE PISO',500,827,16,True,color='#c90c19')
c.setStrokeColor(HexColor('#c90c19')); c.setLineWidth(3); c.line(90,801,910,801)
text('FRENTE DEL ESCENARIO / PÚBLICO',500,771,16,True)
# Bass drum is behind the rack tom from the drummer's viewpoint.
c.setFillColor(HexColor('#c98732')); c.setStrokeColor(HexColor('#72502b'))
c.roundRect(385,475,210,235,35,fill=1,stroke=1)
c.setStrokeColor(HexColor('#eeeeee')); c.setLineWidth(5)
c.line(395,690,585,690); c.line(395,495,585,495)
label('BOMBO',490,649,135)
# Bass-drum pedal and floor-tom legs.
c.setFillColor(HexColor('#747474')); c.setStrokeColor(HexColor('#333333'))
c.roundRect(474,238,32,122,8,fill=1,stroke=1)
c.setStrokeColor(HexColor('#cccccc')); c.setLineWidth(2)
for y in range(255,345,10): c.line(480,y,500,y)
for dx,dy in [(-90,-85),(95,-75),(20,125)]:
    c.line(760,300,760+dx,300+dy)
cymbal(170,640,110,'CRASH 1')
cymbal(810,640,110,'CRASH 2')
drum(365,465,84,'TOM DE AIRE',180)
cymbal(595,455,116,'RIDE')
cymbal(155,330,81,'HI-HAT')
drum(355,270,83,'REDOBLANTE',185)
drum(760,300,105,'TOM DE PISO',190)
# Hi-hat pedal and drummer's stool define the orientation unambiguously.
c.setFillColor(HexColor('#777777')); c.setStrokeColor(HexColor('#333333'))
c.roundRect(141,120,28,106,7,fill=1,stroke=1)
c.setStrokeColor(HexColor('#cccccc'))
for y in range(132,218,10): c.line(147,y,163,y)
c.setFillColor(HexColor('#242424')); c.setStrokeColor(HexColor('#666666'))
c.circle(490,135,65,fill=1,stroke=1)
text('ASIENTO',490,130,15,True,color='#ffffff')
text('VISTA DESDE EL BATERISTA',500,21,16,True)
text('Esquema de montaje · No está a escala',500,48,13,color='#555555')
c.save()
doc=fitz.open(TEMP)
OUT.parent.mkdir(parents=True,exist_ok=True)
doc[0].get_pixmap(matrix=fitz.Matrix(1.5,1.5)).save(OUT)
print(OUT)

from pathlib import Path
from io import BytesIO
from html import escape
from urllib.parse import quote
import reportlab
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.platypus import Table, TableStyle, Paragraph
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from docx import Document
from docx.shared import Inches, Pt, Cm, RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
import fitz

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'media/prensa'
OUT.mkdir(parents=True,exist_ok=True)
PREVIEW=Path('/tmp/pyc-rider-publicado')
PREVIEW.mkdir(parents=True,exist_ok=True)
PDF=OUT/'punkies-y-cerebro-rider-tecnico.pdf'
DOCX=OUT/'punkies-y-cerebro-rider-tecnico.docx'
W,H=A4
M=40; CW=W-80
RED=HexColor('#c90c19'); INK=HexColor('#191919'); GREY=HexColor('#eeeeee')
fonts=Path(reportlab.__file__).parent/'fonts'
for name,path in [('Body',fonts/'Vera.ttf'),('Bold',fonts/'VeraBd.ttf'),('Title',ROOT/'assets/fonts/Anton-Regular.ttf')]:pdfmetrics.registerFont(TTFont(name,str(path)))
pdfmetrics.registerFontFamily('Body',normal='Body',bold='Bold',italic='Body',boldItalic='Bold')

drums=[
 ['Cascos','1 bombo, 1 redoblante y 3 toms (1, 2 y 3).'],
 ['Pedal de bombo','1 pedal sencillo.'],
 ['Platillos','1 ride, 2 crash, 1 splash y 1 hi-hat (Charles).'],
 ['Soportes','Parales y bases necesarios para todos los elementos.'],
 ['Asiento','1 sillín adecuado para el baterista.'],
]
amps=[
 ['Bajo','1','Ampeg BA-210 v2, 450 W, o similar.'],
 ['Guitarras','2','Mesa/Boogie Dual Rectifier.'],
 ['Alternativas para guitarra','—','Marshall JCM900 o Marshall JCM800.'],
]
mics=[
 ['Hi-hat (Charles)','1','SM81 o similar.'],
 ['Redoblante','1','SM57 o similar.'],
 ['Toms 1, 2 y 3','3','SM57 o similar; uno por tom.'],
 ['Bombo','1','AKG D112 o similar.'],
 ['Overheads','3','SM81 o similar.'],
 ['Guitarras 1 y 2','2','SM57 o SM58, o similar; uno por guitarra.'],
 ['Bajo','1','AKG D112 o similar.'],
 ['Voz principal y coros','4 + 1','4 SM58 o similares en uso y 1 de respaldo.'],
]
monitors=[
 ['1','Jimmy Jazz (Jaime López)','Voz y bajo','A'],
 ['2','Alejandro Cuadros','Guitarra 1 y coros','B'],
 ['3','Sebastián Prieto','Guitarra 2 y coros','C'],
 ['4 y 5','Juan Camilo R.','Batería y coros','D'],
]

c=canvas.Canvas(str(PDF),pagesize=A4,pageCompression=1)
c.setTitle('Rider técnico — Punkies y Cerebro | Noviembre de 2026')
c.setAuthor('Punkies y Cerebro')
c.setSubject('Backline, microfonía, monitores y plano de escenario — edición aprobada para publicación')

def text(s,x,y,size=10,font='Body',color=INK):
 c.setFillColor(color);c.setFont(font,size);c.drawString(x,y,s)

def para(s,x,top,width=CW,size=10,leading=15,color=INK):
 p=Paragraph(escape(s),ParagraphStyle('p',fontName='Body',fontSize=size,leading=leading,textColor=color))
 _,h=p.wrap(width,H);p.drawOn(c,x,top-h);return top-h

def table(headers,rows,widths,top):
 style=ParagraphStyle('cell',fontName='Body',fontSize=9.4,leading=14,textColor=INK)
 hs=ParagraphStyle('head',parent=style,fontName='Bold',fontSize=8.4,leading=12,textColor=white)
 vals=[[Paragraph(escape(v),hs) for v in headers]]+[[Paragraph(escape(str(v)),style) for v in row] for row in rows]
 t=Table(vals,colWidths=widths,hAlign='LEFT')
 t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),INK),('ROWBACKGROUNDS',(0,1),(-1,-1),[white,GREY]),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),10),('RIGHTPADDING',(0,0),(-1,-1),10),('TOPPADDING',(0,0),(-1,-1),9),('BOTTOMPADDING',(0,0),(-1,-1),9),('LINEBELOW',(0,0),(-1,0),2,RED),('LINEBELOW',(0,1),(-1,-1),.4,HexColor('#cccccc'))]))
 _,h=t.wrap(CW,H);t.drawOn(c,M,top-h);return top-h

def title(s,y):text(s,M,y,31,'Title')
def sub(s,y):text(s,M,y,13,'Bold');return y-18
def page(n,title_text):
 c.setFillColor(white);c.rect(0,0,W,H,fill=1,stroke=0)
 c.setFillColor(HexColor('#050505'));c.rect(0,H-112,W,112,fill=1,stroke=0)
 c.drawImage(ImageReader(str(ROOT/'assets/logo-letras.png')),M,H-87,width=365,height=79.5,preserveAspectRatio=True,anchor='c',mask='auto')
 c.setFillColor(RED);c.rect(0,H-116,W,4,fill=1,stroke=0)
 text('RIDER TÉCNICO · NOVIEMBRE DE 2026',M,H-137,10,'Bold',RED)
 title(title_text,H-178)
 c.setStrokeColor(HexColor('#cccccc'));c.line(M,62,W-M,62)
 text('MALOPTERS RECORDS · PRODUCCIONES',M,46,7.5,'Bold')
 text('+57 304 537 76 40  ·  punkiesycerebro@gmail.com',M,32,8)
 text('Contacto alterno: juancamilo1504@gmail.com',M,19,7.5)
 text(f'{n:02d} / 03',W-M-38,46,8,'Bold')
 c.linkURL('mailto:punkiesycerebro@gmail.com',(M,26,W-M,41),relative=0,thickness=0)

page(1,'01 / BACKLINE')
para('Backline solicitado para la presentación de Punkies y Cerebro.',M,635,size=9.5,color=HexColor('#555555'))
sub('BATERÍA COMPLETA',573)
y=table(['ELEMENTO','REQUISITO'],drums,[130,CW-130],552)
sub('AMPLIFICADORES',y-37)
y=table(['INSTRUMENTO','CANT.','MODELO / REFERENCIA'],amps,[142,49,CW-191],y-58)
para('Para coordinación técnica: Juan Camilo R. · +57 304 537 76 40.',M,y-18,size=9,color=HexColor('#555555'))
c.showPage()

page(2,'02 / MICROFONÍA')
para('Distribución solicitada. Se aceptan modelos similares a las referencias indicadas.',M,635,size=10)
y=table(['FUENTE','CANT.','MICRÓFONO / OBSERVACIÓN'],mics,[155,60,CW-215],590)
sub('VOCES EN ESCENARIO',y-36)
para('V1: Jimmy Jazz · V2: Alejandro Cuadros · V3: Sebastián Prieto · V4: Juan Camilo R.',M,y-54,size=10)
para('Cuatro micrófonos de voz en uso y uno adicional de respaldo. El micrófono de respaldo no corresponde a una quinta voz.',M,y-104,size=10)
para('Se solicitan tres micrófonos de overhead.',M,y-154,size=9,color=HexColor('#555555'))
c.showPage()

page(3,'03 / MONITORES Y ESCENARIO')
para('Cinco monitores de escenario, distribuidos en cuatro mezclas independientes —una por músico— y separadas de la mezcla de sala (FOH).',M,635,size=10)
y=table(['MONITOR','MÚSICO','FUNCIÓN','MEZCLA'],monitors,[75,170,182,CW-427],588)
text('PLANO DE ESCENARIO',M,y-28,12,'Bold')
text('Vista desde el público · Esquema de posiciones, no a escala.',M,y-45,8.5,color=HexColor('#555555'))
text('V1–V4 identifican las voces; no son números de canal de consola.',M,y-59,8,color=HexColor('#555555'))
sx,sy,sw,sh=M,114,CW,242
c.setFillColor(HexColor('#fafafa'));c.setStrokeColor(HexColor('#777777'));c.rect(sx,sy,sw,sh,fill=1,stroke=1)

def box(cx,cy,w,h,name,role,vocal):
 c.setFillColor(INK);c.roundRect(cx-w/2,cy-h/2,w,h,4,fill=1,stroke=0)
 for s,dy,size,font in [(name,10,9,'Bold'),(role,-4,8,'Body'),(vocal,-17,8,'Body')]:
  c.setFont(font,size);c.setFillColor(white);c.drawCentredString(cx,cy+dy,s)
def mon(cx,cy,n,mix):
 c.setFillColor(RED);p=c.beginPath();p.moveTo(cx-18,cy-9);p.lineTo(cx+18,cy-9);p.lineTo(cx+12,cy+9);p.lineTo(cx-12,cy+9);p.close();c.drawPath(p,fill=1,stroke=0)
 c.setFont('Bold',8);c.setFillColor(white);c.drawCentredString(cx,cy-3,str(n))
 c.setFont('Body',6.5);c.setFillColor(INK);c.drawCentredString(cx,cy-20,'Mezcla '+mix)
cx=M+CW/2
box(cx,316,160,55,'JUAN CAMILO R.','Batería y coros','V4')
mon(cx-32,271,4,'D');mon(cx+32,271,5,'D')
box(M+94,219,165,55,'ALEJANDRO CUADROS','Guitarra 1 y coros','V2')
box(W-M-94,219,165,55,'SEBASTIÁN PRIETO','Guitarra 2 y coros','V3')
mon(M+94,173,2,'B');mon(W-M-94,173,3,'C')
box(cx,198,142,55,'JIMMY JAZZ','Bajo y voz','V1')
mon(cx,150,1,'A')
c.setFont('Bold',8);c.setFillColor(INK);c.drawCentredString(cx,91,'PÚBLICO / FRENTE DEL ESCENARIO')
c.showPage();c.save()

# Render the real PDF and reuse its diagram in the editable document.
pdf=fitz.open(PDF)
for i,p in enumerate(pdf):p.get_pixmap(matrix=fitz.Matrix(1.3,1.3)).save(PREVIEW/f'pagina-{i+1}.png')
pdf[2].get_pixmap(matrix=fitz.Matrix(2,2),clip=fitz.Rect(M-3,H-359,W-M+3,H-86)).save(OUT/'punkies-y-cerebro-plano-escenario.png')

doc=Document();sec=doc.sections[0];sec.top_margin=Cm(1.5);sec.bottom_margin=Cm(1.7);sec.left_margin=Cm(1.7);sec.right_margin=Cm(1.7)
normal=doc.styles['Normal'];normal.font.name='Calibri';normal.font.size=Pt(10);normal.paragraph_format.space_after=Pt(6)
for name in ['Heading 1','Heading 2']:
 doc.styles[name].font.name='Calibri';doc.styles[name].font.color.rgb=RGBColor.from_string('C90C19')
header=sec.header.paragraphs[0];header.text='PUNKIES Y CEREBRO  |  RIDER TÉCNICO';header.runs[0].bold=True;header.runs[0].font.size=Pt(12)
footer=sec.footer.paragraphs[0];footer.text='RIDER TÉCNICO · NOVIEMBRE DE 2026\nMalopters Records · Producciones\n+57 304 537 76 40 · punkiesycerebro@gmail.com · juancamilo1504@gmail.com';footer.runs[0].font.size=Pt(8)

def dt(headers,rows):
 t=doc.add_table(rows=1,cols=len(headers));t.style='Light Shading Accent 1'
 for cell,label in zip(t.rows[0].cells,headers):cell.text=label
 prop=t.rows[0]._tr.get_or_add_trPr();repeat=OxmlElement('w:tblHeader');prop.append(repeat)
 for row in rows:
  for cell,value in zip(t.add_row().cells,row):cell.text=str(value)
 for row in t.rows:
  p=row._tr.get_or_add_trPr();n=OxmlElement('w:cantSplit');p.append(n)
 return t

doc.add_heading('01 / Backline',0)
doc.add_paragraph('Rider técnico de Punkies y Cerebro. Edición: noviembre de 2026.')
doc.add_heading('Batería completa',1);dt(['Elemento','Requisito'],drums)
doc.add_heading('Amplificadores',1);dt(['Instrumento','Cantidad','Modelo / referencia'],amps)
doc.add_paragraph('Para coordinación técnica: Juan Camilo R. · +57 304 537 76 40.')
doc.add_page_break()
doc.add_heading('02 / Microfonía',0)
doc.add_paragraph('Se aceptan modelos similares a las referencias indicadas.')
dt(['Fuente','Cantidad','Micrófono / observación'],mics)
doc.add_heading('Voces en escenario',1)
doc.add_paragraph('V1: Jimmy Jazz · V2: Alejandro Cuadros · V3: Sebastián Prieto · V4: Juan Camilo R.')
doc.add_paragraph('Cuatro micrófonos de voz en uso y uno adicional de respaldo. El respaldo no corresponde a una quinta voz. Se solicitan tres micrófonos de overhead.')
doc.add_page_break()
doc.add_heading('03 / Monitores y escenario',0)
doc.add_paragraph('Cinco monitores de escenario, distribuidos en cuatro mezclas independientes —una por músico— y separadas de la mezcla de sala (FOH).')
dt(['Monitor','Músico','Función','Mezcla'],monitors)
doc.add_heading('Plano de escenario',1)
doc.add_paragraph('Vista desde el público. Esquema de posiciones, no a escala. V1–V4 identifican las voces; no son números de canal de consola.')
doc.add_picture(str(OUT/'punkies-y-cerebro-plano-escenario.png'),width=Cm(17.2))
doc.save(DOCX)
print(PDF);print(DOCX)

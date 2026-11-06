# Rider técnico de Punkies y Cerebro

Versión aprobada para publicación en noviembre de 2026, basada en el documento
«RIDER TÉCNICO - PUNKIES Y CEREBRO 2018 N.docx» aportado por el propietario.
Se corrigieron ortografía, redacción y formato, manteniendo backline y referencias
de microfonía originales.

Aclaraciones confirmadas por el propietario:
- Cuatro micrófonos de voz en uso y uno de respaldo.
- Cinco monitores: uno para Jimmy, uno para Alejandro, uno para Sebastián y dos
  para batería. Jimmy pidió cambiar de dos monitores a uno antes de publicar.
- Cuatro mezclas independientes, una por músico, separadas de FOH.
- Numeración: Jimmy 1/mezcla A, Alejandro 2/B, Sebastián 3/C y batería 4–5/D.
- V1–V4 son referencias de las voces, no canales de consola.

Archivos públicos en media/prensa/:
- punkies-y-cerebro-rider-tecnico.pdf: rider independiente, tres páginas.
- punkies-y-cerebro-rider-tecnico.docx: versión editable.
- punkies-y-cerebro-plano-escenario.png: esquema de posiciones, no a escala.
- punkies-y-cerebro-epk.pdf: EPK completo de siete páginas con el mismo rider.

Regeneración:
1. python scripts/generar-set-bateria.py
2. python scripts/generar-rider.py
3. python scripts/generar-epk.py

Dependencias: Pillow, reportlab, PyMuPDF y python-docx. Los originales gráficos
se conservan. Las vistas previas del rider se generan solo en /tmp.

Validación: PDF del rider de tres páginas y EPK de siete, verificación de márgenes,
contactos, texto, numeración, enlaces PDF y filas del Word. Revisión visual del
plano actualizado y su inclusión en el EPK. No se modifican catálogos, formularios
ni sus scripts.

## Distribución de batería confirmada con fotografías

El propietario confirmó una configuración con un tom de aire y un tom de piso.
Se actualizó el backline a dos toms y su microfonía a dos SM57 o similares, uno por
tom. La lista de platillos corresponde a las fotografías: un ride, dos crash y
hi-hat, sin splash. Se conservan los tres overheads y el resto de microfonía y
amplificación previamente aprobados. El plano también indica los dos toms.

La página, rider PDF/Word, plano y anexo técnico del EPK se regeneraron con la
misma configuración. Se mantienen cinco monitores, cuatro mezclas y cuatro voces
más un micrófono de respaldo.

## Guía ilustrada de montaje

`punkies-y-cerebro-set-bateria.png` es una vista cenital rotulada de la distribución
confirmada por el baterista: un tom de aire, uno de piso, bombo, redoblante, ride,
dos crash y hi-hat. El asiento y el frente/público indican la orientación. Es un
esquema ilustrado sin medidas, no una fotografía ni un plano a escala.

Se muestra como una imagen pequeña ampliable y descargable junto al rider en la
web y dentro de la primera página de los PDF/Word del rider. El EPK completo
incluye esa misma página. Se genera con `scripts/generar-set-bateria.py`.
La microfonía, los cinco monitores y las cuatro mezclas permanecen sin cambios.

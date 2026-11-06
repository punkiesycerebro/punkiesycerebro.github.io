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
1. python scripts/generar-rider.py
2. python scripts/generar-epk.py

Dependencias: Pillow, reportlab, PyMuPDF y python-docx. Los originales gráficos
se conservan. Las vistas previas del rider se generan solo en /tmp.

Validación: PDF del rider de tres páginas y EPK de siete, verificación de márgenes,
contactos, texto, numeración, enlaces PDF y filas del Word. Revisión visual del
plano actualizado y su inclusión en el EPK. No se modifican catálogos, formularios
ni sus scripts.

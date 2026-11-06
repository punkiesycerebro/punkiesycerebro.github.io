# EPK de Punkies y Cerebro

La sección #epk está entre #jimmy-jazz y #contacto, al igual que su enlace del menú.
Usa el logo original, la tipografía Anton del sitio y los colores negro, rojo y blanco.

Incluye:
- Presentación, origen en Medellín y actividad desde 2005.
- Biografía breve basada exclusivamente en la historia aprobada en content/site.json.
- Formación actual y festivales mencionados en esa historia.
- Álbum de 2018 con enlace real a Spotify y próximo álbum de 2026, todavía marcado Próximamente.
- Enlaces oficiales de Spotify, YouTube, Instagram y Facebook.
- Fotos originales de los cuatro integrantes, panorámica y logos descargables.
- Biografía de prensa descargable como texto UTF-8.
- Management de Juan Camilo R., WhatsApp +57 304 537 76 40 y punkiesycerebro@gmail.com.
- Rider técnico aprobado, plano de escenario y descargas; véase `docs/rider-tecnico.md`.

La biografía del HTML y content/punkies-y-cerebro-biografia.txt deben actualizarse juntas.
Los enlaces musicales proceden de content/site.json, sin modificar sus datos ni catálogos.
Las descargas usan recursos del mismo dominio y el atributo download del navegador.
No se prometen cifras actuales de audiencia, reseñas, premios ni documentación no aportada.

El CSS es específico de .epk y conserva el resto del sitio. Se ajusta el espacio
del menú entre 761 y 1100 px para acomodar el nuevo enlace, conservando el menú
desplegable en móvil y el emblema con regreso al inicio.

Comprobaciones sin entorno de ejecución:
- IDs únicos y destinos de enlaces internos existentes.
- Posición de EPK en el menú y en el documento.
- Referencias a fotos, logos y discografía existentes en el repositorio.
- Datos de contacto y coincidencia entre biografía visible y descargable.
- Diff limitado a EPK, navegación y documentación.

El entorno de ejecución está fallido: no se pudo ejecutar Chromium ni las regresiones
DOM del carrito y contacto en este cambio. No se modifican sus scripts ni datos.

## PDF completo descargable

El botón principal «Descargar EPK en PDF» apunta a
`media/prensa/punkies-y-cerebro-epk.pdf`, un PDF A4 de siete páginas con
portada y logo original, biografía y formación, discografía, contacto/materiales y
las tres páginas del rider técnico.
Tiene texto seleccionable, fuentes incrustadas y enlaces clicables. El álbum
próximo se conserva marcado Próximamente. El rider técnico incorpora las especificaciones aportadas y confirmadas por el propietario.

Para regenerarlo tras cambios de biografía o discografía:
Primero `python scripts/generar-rider.py` y después `python scripts/generar-epk.py`
(requieren Pillow, reportlab, PyMuPDF y python-docx).
La biografía se lee de `content/punkies-y-cerebro-biografia.txt` y la discografía
y redes, de `content/site.json`. Las imágenes provienen de archivos originales.
La fecha de edición se debe actualizar al generar una nueva versión.

La versión PDF se revisó renderizando sus páginas, verificando márgenes,
texto, número de páginas y enlaces. La descarga es directa, del mismo dominio,
sin servicios externos ni generación de PDF en el navegador del visitante.

## Rider aprobado

La sección Producción técnica muestra el resumen y el plano y permite descargar
el rider PDF independiente. El EPK completo también incluye el rider al final,
con numeración global de siete páginas. El botón de management que antes solicitaba
el rider por correo ahora permite descargarlo. La URL del EPK usa una versión de
caché nueva para descargar el archivo actualizado.

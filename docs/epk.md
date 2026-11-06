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
- Solicitud de rider técnico por correo: no se publica un rider inventado.

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

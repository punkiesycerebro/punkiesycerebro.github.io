# Punkies y Cerebro — sitio oficial

Sitio estático para GitHub Pages: https://punkiesycerebro.github.io/.
No necesita framework, compilación, cuentas adicionales ni un editor visual.

## Estructura

- `index.html`: portada, fotografías originales, nuevo álbum y acceso a los contenidos existentes.
- `assets/site.css`: diseño responsive negro/blanco/rojo y tipografía local.
- `assets/site.js`: menú móvil y visor accesible de fotografías.
- `assets/contenido.js`: contenido de `content/site.json` y formulario AJAX reutilizado.
- `assets/fonts/`: Anton y su licencia SIL Open Font License.
- `content/site.json`: historia, enlaces, contacto y listas de discos, conciertos y productos.
- `assets/tienda.js` y `assets/tienda.css`: catálogos de Punkies y Jimmy Jazz G.P., selector de tallas y cantidades, carrito compartido y pedidos separados por WhatsApp. Véase `docs/tienda.md`.
- `media/`: fotografías y logos originales; no eliminarlos ni sobrescribirlos.
- `archivo.html`: versión anterior conservada, marcada noindex.
- `propuesta/`: versiones de diseño anteriores, marcadas noindex.
- `docs/diagnostico-inicial.md`: revisión técnica y decisiones del rediseño.

El editor anterior y sus archivos se conservan como referencia. La portada nueva no carga
sus ajustes de apariencia o composición. Las cuatro fotos de portada y galería están
definidas directamente en el HTML con sus encuadres en CSS.

## Trabajo y publicación

Trabajar en una rama `codex/…`, comprobar cambios y abrir un pull request.
Fusionar únicamente con aprobación del propietario. GitHub Pages publica desde main.
No cambiar DNS ni conectar `punkiesycerebro.com` sin una instrucción nueva.

Respaldo anterior al rediseño: `codex/respaldo-antes-rediseno-20261020`.

Para revisión local: `python -m http.server 4173 --bind 127.0.0.1`.

## Contenido y formulario

No se presentan carátulas, fechas, canciones, precios o productos sin confirmar.
La sección Música muestra la carátula oficial de Este lado hacia el enemigo, aportada por el propietario.
Los nombres y funciones de las fotografías proceden de los archivos aportados por el propietario.

El formulario usa FormSubmit por AJAX, con destinatario `correo_formulario` o `contacto`
y copias opcionales `copias_formulario` en `content/site.json`. Los controles de destinatarios
se mantienen fuera del navegador como configuración pública del sitio; no son secretos.
La entrega real y la activación del servicio requieren verificación con los destinatarios.
Las pruebas del rediseño simulan respuestas HTTP y no envían correos.

## Validación del rediseño

Chromium: 320, 390, 768, 1024 y 1480 px, sin desbordamiento horizontal;
imágenes y fuente cargadas; cuatro retratos y cuatro redes; enlaces internos; menú y Escape;
visor de fotos y cierre; historia desplegable; formulario con error y éxito simulados,
conservación de los campos ante error y sin navegación al enviar.
`node --check` para ambos scripts y `git diff --check`.

# Google Analytics 4

Propiedad de la banda: ID de medición público `G-X3D4L0VJWZ`.

## Instalación

`index.html` carga `assets/analitica.js`. Este añade una sola etiqueta
`gtag/js`, configura GA4 y registra las acciones por delegación, incluso
cuando los enlaces se crean después desde el catálogo.
No se instala el contenedor GTM-WP9F9JZP ni una segunda etiqueta de página.
El diseño, el carrito, el formulario y `assets/visitas.js` no cambian.

Solo funciona en punkiesycerebro.com y www.punkiesycerebro.com. Se excluyen
otros hosts, la vista editor=1 y navegadores que expresen GPC o Do Not Track.
No se activan señales de Google ni personalización publicitaria desde la etiqueta.
La URL de página configurada omite query y fragmento.

## Eventos personalizados

| Evento | Significado |
| --- | --- |
| spotify_click | Clic a open.spotify.com |
| epk_download_click | Clic al PDF oficial del EPK |
| whatsapp_click | Clic a WhatsApp; pedido, reserva o contratación |
| support_click | Clic en un botón de apoyo hacia Wompi |

Parámetros propios: `link_location` (encabezado, carrito, epk, contacto,
conciertos, musica u otro) y `contact_type` (pedido_punkies, pedido_jimmy,
reserva o contratacion, solo en WhatsApp).
No se leen campos del formulario, nombres de visitantes, contenido del
pedido ni mensajes de WhatsApp para los eventos personalizados.
Si se quieren desglosar esos parámetros en informes, se deben registrar
como dimensiones personalizadas con alcance de evento en GA4.

El propietario dejó activada la medición mejorada del flujo de Google.
Esta también puede producir eventos automáticos click o file_download:
los informes del panel deben filtrar por los eventos personalizados de arriba,
sin sumar ambos tipos como si fueran acciones distintas del visitante.

Un clic no confirma una reproducción, descarga terminada, mensaje enviado,
venta o aporte pagado. No se emiten eventos purchase ni ingresos.

## Verificación y panel

Tras el despliegue, abrir el sitio y comprobar en Analytics > Informes >
En tiempo real. Probar Spotify, EPK, WhatsApp y apoyo sin enviar mensajes
ni completar pagos. El informe de eventos procesado puede tardar más.
Bloqueadores y preferencias de privacidad pueden impedir la medición.
Los nuevos datos empiezan en la instalación; no se reconstruye historial.
El contador público usa otro servicio y no equivale a usuarios únicos de GA4.

No hay acceso de la herramienta de edición a la cuenta de Google:
la recepción real se confirma con el propietario. El panel privado de
Data Studio no se crea por instalar esta etiqueta; requiere conectar la
propiedad y compartir el informe solo con las cuentas autorizadas.

## Validación previa

Pruebas de sintaxis y comportamiento con DOM, URL y etiquetas simulados: carga única, cuatro tipos de acción, dos vendedores de WhatsApp, exclusión de enlaces ajenos y de desarrollo/editor/GPC/DNT, sin contenido de mensajes en los eventos personalizados. Sin solicitudes reales a Google.

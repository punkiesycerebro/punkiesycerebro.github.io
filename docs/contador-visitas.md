# Contador de visitas

El pie conserva `assets/logo-letras.png`, el logo original de la banda, y añade
«Visitas al sitio» con seis dígitos como mínimo, blanco/negro y borde rojo.

`assets/visitas.js` registra una carga de página mediante el endpoint público de
CountAPI de Miles Hilliard (https://countapi.mileshilliard.com/). La clave exclusiva
es `punkiesycerebro-com-visitas-20261021-b8f37a`. El proveedor almacena el total
compartido. No se usan cifras ficticias ni un total guardado por navegador.
La primera carga real del dominio inicializa el contador. No se recuperan visitas
anteriores. Cambiar de sección mediante anclas no crea una nueva carga; recargar
sí lo hace. El retorno desde la caché de navegación no vuelve a ejecutar el script.

Solo se registra desde punkiesycerebro.com y www.punkiesycerebro.com; el editor y
las vistas locales no cuentan. El script se carga con defer, no envía campos del
formulario ni del carrito, omite credenciales y referencia de la página. El
proveedor recibe los datos normales de conexión necesarios para una petición HTTP.

Cuenta cargas, no personas únicas. Como cualquier contador público sin
autenticación, no sirve para auditorías: puede recibir tráfico automatizado o
peticiones ajenas al sitio. La disponibilidad y persistencia dependen del
proveedor externo, que no ofrece SLA. Si falla, muestra «Temporalmente no
disponible», sin inventar un número ni reintentar una carga ya posiblemente contada.

La documentación y el código del proveedor confirman el endpoint y soporte CORS.
Las herramientas web no permitieron consultar el endpoint JSON durante la
revisión, por lo que no se comprobó una respuesta real de producción. Las pruebas
locales simulan respuestas sin incrementar el contador real.

Validación: `NODE_PATH=/tmp/tienda-check/node_modules node tests/visitas.cjs`.

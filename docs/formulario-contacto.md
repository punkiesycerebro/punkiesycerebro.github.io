# Formulario de contacto: envío y diagnóstico

El sitio usa Web3Forms por AJAX para el formulario creado por el propietario con
`punkiesycerebro@gmail.com`. La configuración pública está en `content/site.json`.
La aceptación se muestra dentro de la página; la recepción en el buzón requiere
una prueba real del propietario. Las secciones siguientes documentan también el
diagnóstico y el modo anterior FormSubmit, que se conserva compatible.

## Comportamiento de envío y compatibilidad FormSubmit

- POST AJAX con `URLSearchParams`, codificación de formulario estándar y `Accept: application/json`. Evita el preflight adicional requerido por Content-Type application/json.
- No se envía `_cc` cuando no hay destinatarios en copia.
- Los rechazos del servicio se muestran como texto, nunca HTML.
- Se distinguen activación, límite de solicitudes, fallo del servidor, respuesta no JSON, fallo de conexión y tiempo de espera.
- Una respuesta de activación nunca se considera entrega aunque incluya `success: true`.
- Aviso de demora a los 20 segundos y tiempo máximo de 60 segundos, sin reintentos
  automáticos ni borrado de campos ante fallo. Un timeout no prueba que el servidor
  no haya procesado el envío.
- El estado de éxito indica aceptación por el servicio; no garantiza llegada a la bandeja de entrada.
- Ante error se ofrecen WhatsApp de management y el correo configurado, con nombre,
  correo, asunto y mensaje completos. El visitante debe confirmar el envío en la
  aplicación elegida; no se envían mensajes automáticamente.

## Incidente de tiempo de espera

El propietario confirmó de nuevo la activación y conservar `juancamilo1504@gmail.com`.
Después confirmó que el mensaje de la prueba sí llegó normalmente a su buzón,
aunque la página mostró timeout. Se amplió la espera de confirmación a 60 segundos
y a los 20 se indica demora, sin habilitar un segundo envío ni anunciar fallo.
Su captura muestra que se agotaron los 20 segundos, sin respuesta del proveedor.
También fallaron por timeout las consultas de solo lectura a la ayuda de FormSubmit
durante la revisión. Esto no permite determinar si recibió el POST original ni
asegurar que el correo llegó. Las alternativas mitigan el fallo, pero no reparan
ni verifican la disponibilidad del proveedor externo.

`NODE_PATH=/tmp/tienda-check/node_modules node tests/contacto-alternativas.cjs`
comprueba el timeout simulado, los datos conservados, el texto íntegro en ambas
alternativas, la seguridad del contenido y la ausencia de reintentos automáticos.

## Validación

Nueve escenarios simulados en Chromium: activación, HTTP 429, HTTP 503, rechazo de validación,
respuesta no JSON, fallo de red, timeout, mensaje con etiquetas HTML y aceptación.
Comprobados el POST codificado, la ausencia de `_cc` vacío, conservación de campos ante fallo,
limpieza al aceptar, botón recuperado y permanencia en la página.
No se enviaron mensajes reales. La prueba desde el navegador del propietario sigue siendo
necesaria para conocer la respuesta real y confirmar recepción.

Referencias oficiales consultadas:
- https://formsubmit.co/documentation
- https://formsubmit.co/help

## Servicio actual: Web3Forms

El propietario pidió conservar el envío dentro de la página y evitar demoras. La
propuesta de navegación directa a FormSubmit se cerró sin publicar. La captura
posterior confirmó explícitamente `Form Activated` para el dominio; el propietario
también confirmó recepción tardía de una prueba.

El propietario creó un formulario asociado a `punkiesycerebro@gmail.com` y aportó
su Access Key pública. Se conectó configurando `servicio_formulario: web3forms`,
`web3forms_access_key` y `correo_formulario` en `content/site.json`. El identificador no es una contraseña; se usa en el cliente
como alias del destinatario, según la documentación del proveedor.

El adaptador envía nombre, email, asunto y mensaje mediante JSON a la API oficial,
sin navegación ni redirección y sin reintentar por otro proveedor. No se anuncia
éxito hasta que la respuesta HTTP y `success` confirman aceptación. Una clave
faltante bloquea el formulario, en vez de cambiar de proveedor silenciosamente.
La prueba simulada verifica datos, destino, aceptación y permanencia en la página.
Las pruebas simuladas con la configuración de producción comprobaron aceptación,
rechazo HTTP 400, datos conservados ante error y recuperación del botón. No se
garantiza rapidez o entrega real hasta verificar una prueba en el buzón del
propietario. No se enviaron mensajes reales desde las herramientas.

Referencias:
- https://web3forms.com/
- https://docs.web3forms.com/getting-started/examples/ajax-contact-form-using-javascript

# Formulario de contacto: envío y diagnóstico

El sitio usa FormSubmit con el correo configurado en `content/site.json`.
El propietario confirmó que ya activó el destinatario. La captura del error original
no contiene la respuesta del proveedor, por lo que no permite determinar la causa.

## Ajustes

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

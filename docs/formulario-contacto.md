# Formulario de contacto: envío y diagnóstico

## Configuración actual

El sitio usa POST nativo a FormSubmit, con el identificador público aportado en el
correo de activación (`formsubmit_id`) y `envio_formulario: directo` en
`content/site.json`. El destinatario continúa siendo `juancamilo1504@gmail.com`.
El identificador es un destino público del formulario, no una contraseña.

La verificación antispam del proveedor queda habilitada: no se envía `_captcha=false`.
El navegador abre la respuesta de FormSubmit, que puede mostrar la verificación,
una aceptación o un error. `_next` dirige a `gracias.html` al aceptar el servicio.
Esa página no garantiza recepción en la bandeja de entrada.
No se envían copias vacías ni se reintenta automáticamente. El formulario conserva
sus campos y diseño. La vista del editor bloquea los envíos.

## Incidente

Las pruebas por AJAX agotaron primero 20 y después 60 segundos sin confirmación.
El propietario inicialmente dijo que recibió un correo, pero la captura posterior
mostró que era una solicitud de activación, no prueba de recepción del mensaje.
Luego confirmó que pulsó ACTIVATE FORM y vio la confirmación de activación; aun así,
la siguiente prueba por AJAX quedó esperando. No se conoce la respuesta HTTP de
esas peticiones, por lo que no se atribuye una causa definitiva a los timeouts.

El envío directo permite ver la respuesta del proveedor y usar su verificación
antispam recomendada, sin el timeout artificial del código AJAX. Esto no garantiza
la disponibilidad de FormSubmit ni la entrega de correo; hace falta una prueba
del propietario que confirme la recepción del contenido, no otro correo de activación.

## Validación

`NODE_PATH=/tmp/tienda-check/node_modules node tests/contacto-alternativas.cjs`
comprueba, sin solicitudes reales, que el modo directo usa el identificador correcto,
envía todos los campos y el retorno HTTPS, habilita la seguridad del proveedor,
excluye copias vacías y no realiza AJAX ni inicia temporizadores.
También comprueba la ruta AJAX conservada: demora, aceptación tardía, conservación
de campos ante timeout y alternativas de WhatsApp/correo con el mensaje completo.
Se ejecutó además la regresión del carrito y la comprobación de sintaxis y diff.

No se enviaron correos reales desde las herramientas.

Documentación oficial: https://formsubmit.co/documentation

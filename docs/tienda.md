# Tienda y pedidos por WhatsApp

La sección `#tienda` usa `assets/tienda.js`, `assets/tienda.css` y el catálogo
`tienda` de `content/site.json`. No usa servicios de pago ni envía mensajes
por sí sola: abre WhatsApp al +57 304 537 7640 con el pedido para que el cliente
lo revise y pulse Enviar. El total está en COP y no incluye envío.

Cada producto tiene `id` estable, `producto`, `descripcion`, `categoria`, `precio`
(numérico en COP), `imagen` y `tallas` (lista vacía si no aplica). Pages CMS
permite editar esos campos y subir la imagen. No cambiar el ID de un producto
publicado: el carrito lo usa para recuperar la selección guardada.

El carrito distingue cada producto y talla, admite entre 1 y 99 unidades por
variante, permite quitar y seguir comprando. Guarda solo ID, talla y cantidad
en localStorage (`pyc-cart-v1`); recalcula precios y nombres desde el catálogo
actual. Funciona en memoria si el navegador bloquea almacenamiento. Al volver,
descarta productos o tallas eliminados del catálogo. Escucha cambios de otras
pestañas. No supone disponibilidad de inventario: se confirma por WhatsApp.

## Fotos pendientes

Las tres fotos fueron visibles en el chat, pero no llegaron al entorno como
archivos descargables. Las rutas C:/Users/jcrestrepo/Downloads/ pertenecen al
computador del propietario y no son accesibles desde este entorno. Por eso
`imagen` está vacío y se muestra «Imagen pendiente», sin sustituirlas por otras
fotos. Subir los originales por Pages CMS o agregarlos a `media/productos/` y
actualizar `imagen` antes de completar la publicación:

- CD_cualquier parecido.jpeg
- Camisa 2.jpeg
- Gorra.jpeg

## Validación

Se comprobó en DOM con jsdom: catálogo integrado con renderCMSContent, talla
obligatoria, variantes M/L separadas, suma de unidades repetidas, modificación
de cantidades, rechazo de vacíos/cero/negativos/decimales/>99, eliminación,
estado vacío, cierre y vuelta a tienda, recuperación al recargar, sincronización
entre pestañas, limpieza de datos inválidos, almacenamiento bloqueado y mensaje
codificado con destinatario, productos, tallas, cantidades, subtotales y total.
Los cambios se comprobaron con node --check y git diff --check.
No se envió ningún mensaje real. Falta revisión visual en navegador y fotos.

Caso de referencia: CD ×1 + camisa M ×2 + camisa L ×1 + gorra ×1 = $275.000.

# Tienda y pedidos por WhatsApp

La sección `#tienda` usa `assets/tienda.js`, `assets/tienda.css` y el catálogo
`tienda` de `content/site.json`. No usa servicios de pago ni envía mensajes
por sí sola: abre WhatsApp con el pedido del vendedor para que el cliente
lo revise y pulse Enviar. Punkies y Cerebro recibe sus productos en
+57 304 537 7640; Jimmy Jazz G.P., en +57 305 231 8020. El total está en COP y no incluye envío.

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

## Fotos de los productos

Las tres fotos originales aportadas en `Tienda.zip` están en `media/productos/`:

- `cd-cualquier-parecido-2018.jpeg`: CD de 2018.
- `camisa-mod-2.jpeg`: camisa Mod 2.
- `gorra-punkies.jpeg`: gorra.

El catálogo referencia estos archivos locales. Las fotos se conservan sin
recortes ni modificaciones; las tarjetas usan `object-fit: contain` para
mostrar el producto completo. Se verificaron formato JPEG, integridad y rutas.
Se pueden sustituir desde el campo `imagen` en Pages CMS.

## Validación

Se comprobó en DOM con jsdom: catálogo integrado con renderCMSContent, talla
obligatoria, variantes M/L separadas, suma de unidades repetidas, modificación
de cantidades, rechazo de vacíos/cero/negativos/decimales/>99, eliminación,
estado vacío, cierre y vuelta a tienda, recuperación al recargar, sincronización
entre pestañas, limpieza de datos inválidos, almacenamiento bloqueado y mensaje
codificado con destinatario, productos, tallas, cantidades, subtotales y total.
Los cambios se comprobaron con node --check y git diff --check.
No se envió ningún mensaje real. Falta revisión visual en navegador. Las tres fotos ya están incorporadas.

Caso de referencia: CD ×1 + camisa M ×2 + camisa L ×1 + gorra ×1 = $275.000.

## Jimmy Jazz G.P. y pedidos por vendedor

El enlace del menú `#jimmy-jazz` lleva a la sección dedicada a Jimmy, con una
presentación breve basada en la historia de la banda. Su catálogo independiente
está en `tienda_jimmy` de `content/site.json` y se edita en Pages CMS con los
mismos campos que la tienda de Punkies. Inicialmente está vacío, a la espera de
los productos del propietario.

`renderShop(tienda, tienda_jimmy)` determina el vendedor por la lista de origen.
Los IDs de Jimmy usan internamente el prefijo reservado `jimmy:`; no incluir
ese prefijo al editar IDs en el CMS. Esto permite que ambos catálogos tengan
un mismo ID sin mezclar sus productos y conserva los carritos anteriores.
El vendedor y el teléfono nunca proceden de datos guardados en el navegador.

El carrito muestra vendedor, total general y subtotal de cada uno. Cada botón
de WhatsApp incluye únicamente las líneas y el subtotal de su destinatario.
En pedidos mixtos se muestran ambos botones y una explicación: el visitante
debe abrirlos y enviar cada mensaje por separado. Disponibilidad, pago y envío
se acuerdan con cada vendedor. Los botones abren mensajes preparados y no
anuncian que se hayan enviado.

La prueba `tests/carrito-vendedores.cjs` usa jsdom y productos ficticios solo
en memoria. Verifica separación de mensajes y totales, teléfonos, IDs iguales,
tallas, cambios, eliminaciones, restauración, carritos antiguos y bloqueos de
almacenamiento, sincronización entre pestañas, integración con CMS y regreso
a la sección de Jimmy. Para ejecutarla sin dependencias en el sitio:

```sh
npm install --prefix /tmp/pyc-tests jsdom
NODE_PATH=/tmp/pyc-tests/node_modules node tests/carrito-vendedores.cjs
```

No se envían mensajes reales. No hay productos ficticios en el catálogo publicado.

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
mismos campos que la tienda de Punkies. Sus primeros cuatro productos son: los discos Humores y En la sima ($20.000 cada uno),
Las píldoras de la ira ($30.000) y Manual práctico del suicida ($50.000).
Sus cuatro fotos originales están en `media/productos/jimmy-jazz/`.

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

## Organización y nueva tanda de libros

El catálogo de Jimmy muestra Libros primero y Discos debajo, en grupos separados.
Ambas tiendas conservan sus grupos. Las tarjetas de ambas tiendas tienen
imágenes de 180 px de alto que se muestran completas, con cuatro columnas en
escritorio y tres, dos o una según el ancho de pantalla.

Se añadieron los 24 libros de `Libros.zip` con sus PNG originales y el precio
provisional indicado de $50.000 COP cada uno. Se conservaron los precios de los
cuatro artículos anteriores. El catálogo tiene 26 libros y dos discos.
La prueba del catálogo verifica los grupos en ese orden, los 28 productos,
los IDs únicos de los controles, los precios y un pedido de $1.320.000 por una
unidad de cada artículo de Jimmy. La tanda inicial se publicó con precios provisionales; la lista definitiva ya se incorporó según se describe a continuación.

## Lista definitiva de precios

Se aplicó la lista de 27 libros aportada por el propietario. Se completó el título
Catálogo de tronquitos con anecdotario y se distinguió Tablaturas de canciones
rosa, volumen II. Vademécum argólico, volumen II se añadió como producto separado
a $50.000. Su portada original, recibida en un ZIP independiente, está en
`media/productos/jimmy-jazz/libro-vademecum-argolico-ii.png`. Se distingue
de la imagen del primer volumen y se comprobó la integridad del PNG.

El catálogo tiene 27 libros y dos discos. Una unidad de cada libro suma
$1.295.000 COP; el total con los dos discos es $1.335.000 COP. Se comprobaron
el pedido con esos importes y la recuperación de carritos guardados usando
los precios actuales, incluso si el navegador contiene importes anteriores.
Los precios de los discos no cambian.

## CASIORQUESTA

Se añadió Disco — CASIORQUESTA a Jimmy Jazz por $20.000 COP, en el grupo Discos.
Su carátula original de `CASIORQUESTA.zip` se conserva en
`media/productos/jimmy-jazz/disco-casiorquesta.png`. El catálogo de Jimmy tiene
27 libros y tres discos. Los pedidos de este álbum usan el mismo carrito y
el WhatsApp de Jimmy, +57 305 231 8020.

## Nueva tanda de discos de Jimmy Jazz

Se incorporaron 17 discos de `Discos_Jimmy Jazz.zip`, con sus imágenes originales
y manteniendo Libros antes de Discos. Los discos cuestan $20.000 COP, salvo los
identificados como GP, a $30.000: Bodas de sangre, De GP para la sociedad,
La sagrada familia del mal, Los pecados capitales, Pintura de guerra y Punk Unpunked.
Los pecados capitales y Punk Unpunked se identificaron como GP por sus carátulas,
aunque sus nombres de archivo no incluían esa sigla.

`Conlas manos arriba - GP.png` contiene la misma carátula de Aquí no se mueve nadie.
El propietario aportó después la carátula correcta en `Con las manos arriba - GP.zip`.
Se incorporó como Disco — Con las manos arriba — GP por $30.000 COP, con el original
en `media/productos/jimmy-jazz/disco-con-las-manos-arriba-gp.png`.
El catálogo completo suma 27 libros y 21 discos, todos con pedidos al WhatsApp de Jimmy.

## Próximamente en la tienda de Punkies

Este lado hacia el enemigo · 2026 abre el grupo Discos, seguido del CD de 2018.
Debajo aparece el grupo Demás artículos con camisa y gorra. El nuevo álbum
usa `proximamente: true`, precio nulo y la carátula original de la sección Música.
Solo muestra «Próximamente»: no presenta precio, cantidad ni botón de compra.
Pages CMS permite cambiar el indicador cuando se confirme su lanzamiento.

El renderizador admite productos próximos sin precio, pero los excluye de los
carritos restaurados y de las altas al carrito. Las pruebas verifican el orden,
el reconocimiento de la categoría «CD · 2018», la ausencia de controles de compra
y la exclusión del álbum de pedidos incluso ante datos guardados o formularios
manipulados. El resto del carrito y los catálogos conservan su funcionamiento.

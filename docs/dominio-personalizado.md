# Dominio personalizado: punkiesycerebro.com

El dominio permanece registrado en GoDaddy. El sitio continúa en el repositorio
público `punkiesycerebro/punkiesycerebro.github.io`, publicado gratuitamente por
GitHub Pages desde `main`. No se necesita hosting ni un certificado de pago.

## Estado comprobado al preparar el cambio

- El repositorio tiene GitHub Pages habilitado; el último flujo dinámico
  `pages build and deployment` de `main` terminó correctamente.
- Antes de esta propuesta no había CNAME en el repositorio.
- Esta propuesta prepara CNAME, canonical, Open Graph, sitemap y robots para
  `https://punkiesycerebro.com/`.
- La conexión de GitHub disponible no expone la API de configuración de Pages.
  No se ha podido leer ni cambiar directamente Custom domain o Enforce HTTPS.
- La consulta DNS y la apertura del dominio no están disponibles en este entorno.
  Un error de consulta aquí no demuestra que el dominio no exista o esté mal.
- Faltan los registros actuales de GoDaddy para identificar los cambios exactos.
  No se han cambiado registros DNS ni verificado el certificado del dominio.

## Activación coordinada

No fusionar esta propuesta sin coordinar el paso DNS: configurar el dominio
personalizado puede redirigir la dirección github.io hacia el nuevo dominio
antes de que este resuelva. Conservar una copia de los registros anteriores.

1. Revisar los registros actuales y servidores de nombres en GoDaddy. Si los
   DNS los administra otro proveedor, editar la zona autoritativa allí.
2. En la configuración de la cuenta de GitHub, Pages permite verificar el dominio
   mediante un TXT. El valor lo genera GitHub; no se debe inventar.
3. Preparar la zona de GoDaddy sin guardarla aún. En GitHub, Settings → Pages,
   conservar la fuente actual y guardar `punkiesycerebro.com` en Custom domain.
   Para la publicación desde rama, el CNAME debe contener exactamente ese nombre,
   sin esquema, ruta ni www. Fusionar esta propuesta coordinando el guardado DNS.
   Si GitHub creó el CNAME al guardar, conservar su contenido idéntico.
4. Guardar los cinco registros siguientes en GoDaddy, usando TTL de 1 hora.
5. Esperar el DNS check de GitHub y la emisión del certificado. Cuando se
   habilite la opción, marcar Enforce HTTPS y comprobar las redirecciones.

## DNS requerido en GoDaddy

| Tipo | Nombre | Valor | TTL |
| --- | --- | --- | --- |
| A | @ | 185.199.108.153 | 1 hora |
| A | @ | 185.199.109.153 | 1 hora |
| A | @ | 185.199.110.153 | 1 hora |
| A | @ | 185.199.111.153 | 1 hora |
| CNAME | www | punkiesycerebro.github.io | 1 hora |

Reemplazar los A de @ que apunten a aparcamiento o a otro hosting; no añadir
estos A conservando valores incompatibles. Reemplazar cualquier A/AAAA/CNAME
existente en www por el CNAME indicado. No usar redirección de GoDaddy ni
Forward Domain: la redirección www → raíz la gestiona GitHub Pages.

Si hay AAAA en @ que apuntan a otro servicio, eliminarlos o sustituirlos por
los cuatro IPv6 de GitHub Pages: `2606:50c0:8000::153`, `2606:50c0:8001::153`,
`2606:50c0:8002::153`, `2606:50c0:8003::153`. No es necesario añadir AAAA
si no hay IPv6. Conservar MX, TXT de correo, NS, SOA y registros de otros
servicios. Si existen CAA restrictivos, revisar que autoricen letsencrypt.org.

## Redirecciones y HTTPS

El dominio principal será https://punkiesycerebro.com/.
Con ambas variantes apuntando a Pages y Custom domain configurado, Pages
redirige www.punkiesycerebro.com al dominio principal. Enforce HTTPS redirige
HTTP a HTTPS. GitHub proporciona el certificado gratuitamente. Los cambios
DNS pueden tardar hasta 24–48 horas y la opción HTTPS hasta 24 horas en aparecer.
No indicar al público que HTTPS funciona hasta comprobar el certificado.

Verificar las cuatro entradas (HTTP y HTTPS, con y sin www), el destino final,
la conservación de rutas y fragmentos, y la ausencia de errores de certificado.
La dirección github.io también puede redirigir al dominio personalizado.

## Funcionalidades

Los recursos, catálogo y enlaces internos usan rutas relativas; los pedidos
WhatsApp conservan sus números y separan ambos vendedores. El formulario usa
FormSubmit y genera su URL de regreso según el origen actual. No se envían
correos reales como parte de estas comprobaciones.

La prueba DOM `tests/carrito-vendedores.cjs` acepta `PYC_TEST_ORIGIN` para
comprobar el sitio en ambos dominios. Las pruebas no sustituyen la verificación
real de DNS, HTTPS, redirecciones y entrega del formulario tras la activación.
El navegador guarda el carrito por origen: las selecciones del dominio github.io
no se transfieren automáticamente al dominio .com y deberán volver a elegirse.

Fuentes oficiales:
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https
- https://www.godaddy.com/help/add-an-a-record-19238

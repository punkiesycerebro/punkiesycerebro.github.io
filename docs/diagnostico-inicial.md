# Diagnóstico y primera propuesta — Punkies y Cerebro

Revisión del repositorio en el commit `5d19a669d69aea005f7bebd3b459f534a7853795` (20 de octubre de 2026). Se inspeccionaron la estructura completa, HTML, CSS, JavaScript, configuración de Pages CMS, JSON y todos los recursos gráficos. La versión anterior se renderizó localmente. No se ha auditado la configuración privada de GitHub Pages ni la entrega de correo real.

## Estado técnico

- Sitio estático, sin framework ni compilación; apropiado para GitHub Pages y para mantenimiento sencillo.
- `index.html` carga tres capas: contenido (`script.js`), apariencia (`apariencia.js`) y composición (`diseno.js`). El contenido principal se completa mediante cuatro peticiones JSON sin caché. Un fallo de carga deja textos provisionales.
- `styles.css` acumula reglas sucesivas y sobrescrituras del editor, dificultando predecir cambios. El editor ocupa aproximadamente 54 KB de JavaScript, pero no se carga directamente como script en la portada.
- El editor usa borradores locales y exportación; no se encontraron credenciales incrustadas en su flujo. No se modificó el editor.
- SEO actual: título, idioma y descripción presentes; falta un h1 real, metadatos sociales y datos estructurados. No hay sitemap ni robots.txt. Confirmar URL oficial antes de fijar canonical o configurar dominio.
- Accesibilidad actual: menú sin `aria-expanded`, ausencia de enlace para saltar navegación y sin adaptación del movimiento suave a preferencias de movimiento reducido. Algunos controles y tipografías son pequeños. No se presenta esto como auditoría WCAG exhaustiva.
- Imágenes: 11 archivos, varios duplicados/variantes; PNG de hasta 1,43 MB. La foto real pesa solo 42,7 KB. No se borró ni recomprimió ningún original.
- Formulario: ya implementa envío AJAX a FormSubmit, destinatario desde `correo_formulario` o `contacto` y copias desde `copias_formulario`. No se debe confundir aceptación de la petición con entrega confirmada en la bandeja. No se enviaron mensajes de prueba.
- CAPTCHA desactivado y límite de envío en cliente: no constituyen protección robusta del servidor. Para su fase habrá que verificar activación del servicio, destinatarios, spam, errores, privacidad y entrega real. Los campos alternativos de destinatarios no figuran en `.pages.yml`.
- No hay workflows de despliegue en el checkout, ni tests/build existentes. README describe todavía una entrega mediante ZIP y debe sustituirse cuando se apruebe la nueva arquitectura.

## Estado visual y editorial

- Identidad auténtica disponible: logo de letras, emblema y fotografía de Juan Camilo Restrepo.
- La composición anterior concentra logo, lema, álbum y botones en un bloque; la imagen de fondo está oscurecida y la historia completa crea un tramo largo de lectura. Las tarjetas redondeadas y tamaños repetidos reducen la diferenciación visual.
- `content/site.json` contiene historia, correo y cuatro canales oficiales. No contiene registros de discos, conciertos ni productos. `content/galeria.json` contiene una foto, duplicada también en el árbol de medios.
- Los archivos llamados «bajo las sombras» no incluyen metadatos que permitan afirmar título, año o función de portada. No se usaron como carátula del nuevo álbum.
- La historia menciona actividad desde 2005 y una primera presentación en 2006; el lema dice 22 años y el encargo indica más de 22. Se conserva la trayectoria aportada por el usuario, pendiente de confirmar cronología y vigencia de la formación.

## Propuesta implementada

`propuesta/index.html` es una propuesta independiente, con CSS y JavaScript propios. Conserva todos los archivos anteriores y sus contenidos, usa las imágenes originales mediante rutas relativas y funciona sin compilación en GitHub Pages. No está conectada a los controles del editor.

Dirección: negro profundo, blanco cálido y acento militar; logo original en cabecera; fotografía real en portada con tratamiento monocromo mediante CSS; tipografía grande; anuncio tipográfico del álbum, sin carátula inventada; historia breve basada en el texto oficial; aviso honesto sobre fechas; contacto y redes verificadas contra el JSON original. «Sin pedir permiso» y «Contra el silencio» son propuestas de copy editorial, no títulos de canciones.

Inicio, Música e Historia navegan por esta propuesta. Conciertos, Galería, Tienda, historia completa y contacto enlazan explícitamente a la versión anterior del mismo checkout. Son accesos provisionales mientras se diseñan las otras secciones. No se implementó una nueva discografía, tienda o formulario en esta fase.

La página lleva `noindex, nofollow` y una franja de revisión. No añade canonical del dominio futuro ni cambia DNS. Tras aprobación se decidirá la migración a la raíz y el SEO de producción.

## Protección

- Respaldo remoto: `codex/respaldo-antes-rediseno-20261020`, en el commit original.
- Propuesta: `codex/propuesta-inicio`, para revisión mediante PR en borrador.
- No se modifica main, no se fusiona, no se publica ni se cambia el dominio.

## Validación

- Renderizado en Chromium local y capturas completas de escritorio y celular.
- Comprobación de ancho a 320, 390, 768, 1024 y 1440 px, sin desbordamiento horizontal tras corregir el tamaño de titulares.
- Menú móvil: apertura, `aria-expanded`, cierre con Escape y recuperación del foco.
- Un único h1; enlaces de salto; foco visible; movimiento reducido; dimensiones de imágenes; carga diferida fuera de portada; foto principal prioritaria.
- Sin errores JavaScript observados en la propuesta. Enlaces externos con `noopener noreferrer`.
- Los logos y emblema mantienen sus píxeles originales. La propuesta reutiliza unos 436 KB de imágenes únicas, sin fuentes externas ni reproductores de terceros cargados automáticamente.
- No se certifican métricas Lighthouse, disponibilidad de plataformas externas, entrega de correo ni configuración remota de Pages.

## Próximos datos a confirmar después de revisar el inicio

Cronología de la banda, formación vigente y fotografías de grupo; portada definitiva, canciones y fecha del nuevo álbum; discografía con años y enlaces; agenda real; productos y precios; destinatarios y proveedor del formulario. No es necesario completar estos datos para comentar la propuesta visual.

## Segunda revisión visual

A petición del propietario y tomando como referencia la captura aportada de Ska-P: logo original ampliado y centrado, redes oficiales visibles arriba, navegación roja con letras blancas, titulares en blanco sólido y fotografía en su color original. Se mantiene el acento militar en llamadas a la acción. Las fotografías de los integrantes todavía están pendientes; no se realizó un montaje sin esos archivos.

Revalidado en Chromium a 320, 390, 768, 1024 y 1440 px, sin desbordamiento horizontal, imágenes rotas ni errores JavaScript; menú móvil y Escape correctos. La versión pública sigue intacta.

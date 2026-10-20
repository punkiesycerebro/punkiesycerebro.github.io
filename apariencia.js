/* Apariencia editable. No modifica los datos de la banda. */
const cmsCSS=(k,v)=>document.documentElement.style.setProperty(k,v);
const validHex=s=>typeof s==='string' && /^#[a-fA-F0-9]{6}$/.test(s);
const fonts={'Barlow Condensed':"'Barlow Condensed',Arial,sans-serif",'DM Sans':"'DM Sans',Arial,sans-serif",'Arial':'Arial,sans-serif','Georgia':'Georgia,serif','Impact':'Impact,Arial,sans-serif'};
const nsize=(n,min,max)=>Number.isFinite(Number(n))?Math.max(min,Math.min(max,Number(n)))+'px':null;
const localImg=s=>typeof s==='string' && /^(\/)?(?:assets|media)\/[a-zA-Z0-9_./%\-]+$/.test(s) && !s.includes('..');
const imgurl=s=>s.startsWith('/')?s:'/'+s;
fetch('/content/apariencia.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('No se cargó apariencia');return r.json()}).then(d=>{
 for(const [key,css] of Object.entries({color_fondo:'--bg',color_secciones:'--cms-dark',color_texto:'--cream',color_menu:'--cms-menu',color_acento:'--olive',color_tarjetas:'--cms-card'}))if(validHex(d[key]))cmsCSS(css,d[key]);
 for(const [key,css] of Object.entries({fuente_menu:'--cms-head-font',fuente_titulos:'--cms-title-font',fuente_cuerpo:'--cms-body-font'}))if(fonts[d[key]])cmsCSS(css,fonts[d[key]]);
 for(const [key,css,min,max] of [['tamano_menu','--cms-menu-size',10,28],['tamano_marca','--cms-brand-size',16,52],['tamano_titulos','--cms-title-size',28,130],['tamano_parrafos','--cms-text-size',12,24],['tamano_historia','--cms-story-size',14,28],['alto_portada','--cms-hero-height',350,1100]]){const v=nsize(d[key],min,max);if(v)cmsCSS(css,v)}
 if(localImg(d.fondo_portada))document.querySelector('.hero').style.backgroundImage=`linear-gradient(90deg,rgba(4,8,4,.54),rgba(4,8,4,.26),rgba(4,8,4,.54)),url("${imgurl(d.fondo_portada)}")`;
 if(localImg(d.fondo_historia))cmsCSS('--cms-story-bg',`url("${imgurl(d.fondo_historia)}")`);
 for(const [key,id] of [['logo_portada','logo-portada-img'],['imagen_disco','imagen-disco-img']]){if(localImg(d[key]))document.getElementById(id).src=imgurl(d[key])}
 if(localImg(d.logo_menu)){const i=document.getElementById('logo-menu-img');i.src=imgurl(d.logo_menu);i.hidden=false;document.getElementById('nombre-menu').hidden=true}
 for(const [key,id] of [['mostrar_lema','.tagline'],['mostrar_historia','#historia'],['mostrar_tienda','#tienda'],['mostrar_contacto','#contacto']])if(d[key]===false){const e=document.querySelector(id);if(e)e.hidden=true}
}).catch(e=>console.warn('Apariencia personalizada no disponible:',e));
const textOnly=s=>String(s??'');
fetch('/content/galeria.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('No se encontró galeria.json');return r.json()}).then(d=>{
 const heading=document.getElementById('titulo-galeria');if(d.titulo)heading.textContent=d.titulo;
 const grid=document.getElementById('galeria-grid');const photos=Array.isArray(d.fotos)?d.fotos.filter(x=>localImg(x.imagen)):[];
 if(!photos.length)return;grid.replaceChildren();for(const photo of photos){const fig=document.createElement('figure'),im=document.createElement('img'),cap=document.createElement('figcaption');im.src=imgurl(photo.imagen);im.loading='lazy';im.alt=textOnly(photo.pie)||'Fotografía de Punkies y Cerebro';cap.textContent=textOnly(photo.pie);fig.append(im,cap);grid.append(fig)}
}).catch(e=>console.warn('Galería no disponible:',e));

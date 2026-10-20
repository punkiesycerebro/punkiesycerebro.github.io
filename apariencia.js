/* Apariencia desde Pages CMS y desde el editor visual de vista previa. */
(()=>{
 const fonts={'Barlow Condensed':"'Barlow Condensed',Arial,sans-serif",'DM Sans':"'DM Sans',Arial,sans-serif",Arial:'Arial,sans-serif',Georgia:'Georgia,serif',Impact:'Impact,Arial,sans-serif',Verdana:'Verdana,Arial,sans-serif'};
 const validHex=v=>typeof v==='string'&&/^#[0-9a-fA-F]{6}$/.test(v);
 const localImg=p=>typeof p==='string'&&/^\/?(?:assets|media)\/[a-zA-Z0-9_./%\-]+$/.test(p)&&!p.includes('..');
 const imgSrc=(p)=>window.__visualImages?.[p]||p;
 const vars={color_fondo:'--bg',color_secciones:'--cms-dark',color_texto:'--cream',color_menu:'--cms-menu',color_acento:'--olive',color_tarjetas:'--cms-card'};
 const fontVars={fuente_menu:'--cms-head-font',fuente_titulos:'--cms-title-font',fuente_cuerpo:'--cms-body-font'};
 const sizeVars={tamano_menu:['--cms-menu-size',10,28],tamano_marca:['--cms-brand-size',16,52],tamano_titulos:['--cms-title-size',28,130],tamano_parrafos:['--cms-text-size',12,24],tamano_historia:['--cms-story-size',14,30],alto_portada:['--cms-hero-height',350,1100]};
 window.aplicarApariencia=d=>{
  if(!d)return;
  for(const [k,v] of Object.entries(vars))if(validHex(d[k]))document.documentElement.style.setProperty(v,d[k]);
  for(const [k,v] of Object.entries(fontVars))if(fonts[d[k]])document.documentElement.style.setProperty(v,fonts[d[k]]);
  for(const [k,[v,min,max]] of Object.entries(sizeVars)){const n=Number(d[k]);if(Number.isFinite(n))document.documentElement.style.setProperty(v,Math.min(max,Math.max(min,n))+'px')}
  const hero=document.querySelector('.hero');
  if(hero&&localImg(d.fondo_portada))hero.style.backgroundImage=`linear-gradient(90deg,rgba(4,8,4,.52),rgba(4,8,4,.27),rgba(4,8,4,.52)),url("${imgSrc(d.fondo_portada)}")`;
  document.documentElement.style.setProperty('--cms-story-bg',localImg(d.fondo_historia)?`url("${imgSrc(d.fondo_historia)}")`:'none');
  for(const [k,id] of [['logo_portada','logo-portada-img'],['imagen_disco','imagen-disco-img']])if(localImg(d[k])){const e=document.getElementById(id);if(e)e.src=imgSrc(d[k])}
  const menuImg=document.getElementById('logo-menu-img'),menuTxt=document.getElementById('nombre-menu');
  if(menuImg&&menuTxt){if(localImg(d.logo_menu)){menuImg.src=imgSrc(d.logo_menu);menuImg.hidden=false;menuTxt.hidden=true}else{menuImg.hidden=true;menuTxt.hidden=false}}
  for(const [k,s] of [['mostrar_lema','.tagline'],['mostrar_historia','#historia'],['mostrar_tienda','#tienda'],['mostrar_contacto','#contacto']]){const e=document.querySelector(s);if(e)e.hidden=d[k]===false}
 };
 window.actualizarGaleria=d=>{
  if(!d)return;const h=document.getElementById('titulo-galeria');if(h&&d.titulo)h.textContent=String(d.titulo);
  const grid=document.getElementById('galeria-grid');if(!grid)return;
  const fotos=Array.isArray(d.fotos)?d.fotos.filter(x=>localImg(x.imagen)):[];
  grid.replaceChildren();if(!fotos.length){const p=document.createElement('p');p.className='empty';p.textContent='Próximamente fotografías de la banda.';grid.append(p);return}
  for(const photo of fotos){const fig=document.createElement('figure'),im=document.createElement('img'),cap=document.createElement('figcaption');im.src=imgSrc(photo.imagen);im.loading='lazy';im.alt=String(photo.pie||'Fotografía de la banda');cap.textContent=String(photo.pie||'');fig.append(im,cap);grid.append(fig)}
 };
 fetch('content/apariencia.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('apariencia.json');return r.json()}).then(window.aplicarApariencia).catch(console.warn);
 fetch('content/galeria.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('galeria.json');return r.json()}).then(window.actualizarGaleria).catch(console.warn);
})();

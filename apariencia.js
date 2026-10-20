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
  if(hero&&localImg(d.fondo_portada)){
    const opacity=Math.max(0,Math.min(100,Number(d.fondo_portada_opacity??100)))/100;
    const overlay=Math.max(0,Math.min(95,Number(d.fondo_portada_overlay??35)))/100;
    const x=Math.max(0,Math.min(100,Number(d.fondo_portada_x??50)));
    const y=Math.max(0,Math.min(100,Number(d.fondo_portada_y??50)));
    const zoom=Math.max(50,Math.min(250,Number(d.fondo_portada_zoom??100)))/100;
    hero.style.backgroundImage=`linear-gradient(rgba(0,0,0,${overlay}),rgba(0,0,0,${overlay})),linear-gradient(rgba(0,0,0,${1-opacity}),rgba(0,0,0,${1-opacity})),url("${imgSrc(d.fondo_portada)}")`;
    hero.style.backgroundSize=`cover, cover, ${zoom*100}% auto`;
    hero.style.backgroundPosition=`center,center,${x}% ${y}%`;
  }
  document.documentElement.style.setProperty('--cms-story-bg',localImg(d.fondo_historia)?`url("${imgSrc(d.fondo_historia)}")`:'none');
  for(const [k,id] of [['logo_portada','logo-portada-img'],['imagen_disco','imagen-disco-img']])if(localImg(d[k])){const e=document.getElementById(id);if(e)e.src=imgSrc(d[k])}
  const menuImg=document.getElementById('logo-menu-img'),menuTxt=document.getElementById('nombre-menu');
  if(menuImg&&menuTxt){if(localImg(d.logo_menu)){menuImg.src=imgSrc(d.logo_menu);menuImg.hidden=false;menuTxt.hidden=true}else{menuImg.hidden=true;menuTxt.hidden=false}}
  for(const [k,s] of [['mostrar_lema','.tagline'],['mostrar_historia','#historia'],['mostrar_tienda','#tienda'],['mostrar_contacto','#contacto']]){const e=document.querySelector(s);if(e)e.hidden=d[k]===false}
 };
 window.actualizarGaleria=d=>{
  if(!d)return;
  const h=document.getElementById('titulo-galeria');if(h)h.textContent=String(d.titulo||'GALERÍA');
  const grid=document.getElementById('galeria-grid');if(!grid)return;
  const fotos=Array.isArray(d.fotos)?d.fotos.filter(x=>localImg(x.imagen)):[];
  const mode=['cuadricula','carrusel','mosaico'].includes(d.modo)?d.modo:'cuadricula';
  const height=Math.min(750,Math.max(120,Number(d.alto)||300));
  const columns=Math.min(5,Math.max(1,Number(d.columnas)||3));
  const gap=Math.min(55,Math.max(0,Number(d.espacio)??16));
  grid.replaceChildren();grid.className='galeria-grid gallery-'+mode;
  grid.style.setProperty('--gal-height',height+'px');grid.style.setProperty('--gal-cols',columns);grid.style.setProperty('--gal-gap',gap+'px');
  if(!fotos.length){const empty=document.createElement('p');empty.className='empty';empty.textContent='Próximamente fotografías de la banda.';grid.append(empty);return}
  for(let i=0;i<fotos.length;i++){
   const photo=fotos[i],fig=document.createElement('figure'),im=document.createElement('img'),cap=document.createElement('figcaption');
   im.src=imgSrc(photo.imagen);im.loading='lazy';im.alt=String(photo.pie||'Fotografía de Punkies y Cerebro');
   im.style.objectFit=['cover','contain','fill'].includes(photo.imagen_fit)?photo.imagen_fit:photo.ajuste||'cover';im.style.transform=`scale(${Math.max(.5,Math.min(2.5,Number(photo.imagen_zoom??100)/100))})`;im.style.opacity=Math.max(0,Math.min(1,Number(photo.imagen_opacity??100)/100));
   im.style.objectPosition=`${Math.min(100,Math.max(0,Number(photo.imagen_x??photo.posX??50)))}% ${Math.min(100,Math.max(0,Number(photo.imagen_y??photo.posY??50)))}%`;
   if(photo.alto)fig.style.setProperty('--item-height',Math.min(750,Math.max(120,Number(photo.alto)))+'px');
   if(photo.ancho&&mode!=='carrusel')fig.style.setProperty('--item-width',Math.min(100,Math.max(25,Number(photo.ancho)))+'%');
   cap.textContent=String(photo.pie||'');fig.append(im,cap);if(Number(photo.imagen_overlay)>0){const o=document.createElement('div');o.className='gallery-image-overlay';o.style.background=`rgba(0,0,0,${Math.min(.95,Math.max(0,Number(photo.imagen_overlay)/100))})`;fig.append(o)}grid.append(fig);
  }
  const section=document.getElementById('galeria');let nav=section?.querySelector('.gallery-controls');nav?.remove();
  if(mode==='carrusel'&&fotos.length>1&&section){
   nav=document.createElement('div');nav.className='gallery-controls';
   const prev=document.createElement('button'),next=document.createElement('button');
   prev.type=next.type='button';prev.textContent='← Anterior';next.textContent='Siguiente →';
   prev.setAttribute('aria-label','Fotografía anterior');next.setAttribute('aria-label','Fotografía siguiente');
   const status=document.createElement('span');status.setAttribute('aria-live','polite');
   const jump=(step)=>{const index=Math.round(grid.scrollLeft/Math.max(1,grid.clientWidth));const newIndex=Math.max(0,Math.min(fotos.length-1,index+step));grid.children[newIndex]?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});status.textContent=(newIndex+1)+' / '+fotos.length};
   prev.onclick=()=>jump(-1);next.onclick=()=>jump(1);status.textContent='1 / '+fotos.length;
   nav.append(prev,status,next);grid.after(nav);
  }
 };
 fetch('content/apariencia.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('apariencia.json');return r.json()}).then(window.aplicarApariencia).catch(console.warn);
 fetch('content/galeria.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('galeria.json');return r.json()}).then(window.actualizarGaleria).catch(console.warn);
})();

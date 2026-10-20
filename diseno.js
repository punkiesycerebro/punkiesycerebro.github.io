/* Estructura editable: orden, bloques, titulares y fondos. */
(()=>{
 const mapa={
  lema:'.tagline',etiqueta_disco:'.album-tile [data-texto-bloque="etiqueta_disco"]',estado_disco:'.album-tile [data-texto-bloque="estado_disco"]',presentacion_musica:'#musica>.section-head+p',titular_musica:'#musica>.section-head h2',
  titular_conciertos:'#conciertos>.section-head h2',presentacion_conciertos:'#conciertos>.section-head+p',
  titular_historia:'#historia>.section-head h2',titular_tienda:'#tienda>.section-head h2',
  presentacion_tienda:'#tienda>.section-head+p',titular_contacto:'#contacto>.section-head h2',
  presentacion_contacto:'#contacto>.section-head+p',titular_streaming:'.info-tile h3',
  menu_inicio:'.links a[href="#inicio"]',menu_musica:'.links a[href="#musica"]',menu_conciertos:'.links a[href="#conciertos"]',menu_historia:'.links a[href="#historia"]',menu_tienda:'.links a[href="#tienda"]',menu_galeria:'.links a[href="#galeria"]',menu_contacto:'.links a[href="#contacto"]'
 };
 const localImg=p=>typeof p==='string'&&/^\/?(?:assets|media)\/[a-zA-Z0-9_./%\-]+$/.test(p)&&!p.includes('..');
 const src=p=>window.__visualImages?.[p]||p;
 const HEX=s=>typeof s==='string'&&/^#[0-9a-f]{6}$/i.test(s);
 const ids=['inicio','musica','conciertos','historia','tienda','galeria','contacto'];
 const setText=(el,str)=>{if(el&&typeof str==='string')el.textContent=str};
 const make=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=String(txt);return e};
 function addExtra(b){
  if(!b||typeof b!=='object'||!/^x\d{3,15}$/.test(b.id))return;
  const s=make('section','section custom-section');s.id=b.id;
  const head=make('div','section-head');const num=make('span','number','✦ /');const h=make('h2','',b.titulo||'Nueva sección');head.append(num,h);s.append(head);
  if(localImg(b.imagen)){const img=make('img','custom-cover');img.src=src(b.imagen);img.alt=String(b.titulo||'Imagen');s.append(img)}
  if(b.texto)s.append(make('p','',b.texto));
  if(b.boton&&/^https:\/\/[^\s]+/.test(b.enlace||'')){const a=make('a','btn primary',b.boton);a.href=b.enlace;a.target='_blank';a.rel='noopener noreferrer';s.append(a)}
  s.dataset.extra='yes';return s;
 }
 window.aplicarDiseno=d=>{
  if(!d)return;const texts=d.textos||{};
  for(const [k,sel] of Object.entries(mapa))setText(document.querySelector(sel),texts[k]);
  // Aplicación segura de formato individual: solo propiedades CSS permitidas.
  const safeFont=/^(Barlow Condensed|DM Sans|Impact|Georgia|Arial|Verdana)$/;
  const formatTargets={...mapa,album_bloque:'#album-music',banda:'#nombre-menu',subtitulo:'#subtitulo',album:'#album',descripcion:'#descripcion',acerca:'#acerca'};
  for(const [key,sel] of Object.entries(formatTargets)){
   const el=document.querySelector(sel);if(!el)continue;
   const f=d.formato?.[key]||{};
   el.dataset.visualText=key;el.hidden=d.ocultos_texto?.[key]===true;
   el.style.fontWeight=f.negrita===true?'800':'';
   el.style.fontStyle=f.cursiva===true?'italic':'';
   el.style.textDecoration=f.subrayado===true?'underline':'';
   el.style.textTransform=f.mayusculas===true?'uppercase':'';
   el.style.color=HEX(f.color)?f.color:'';
   el.style.fontFamily=safeFont.test(f.fuente||'')?`"${f.fuente}", sans-serif`:'';
   el.style.textAlign=['left','center','right','justify'].includes(f.alinear)?f.alinear:'';
   el.style.fontSize=Number(f.tamano)>=10&&Number(f.tamano)<=130?f.tamano+'px':'';
   el.style.letterSpacing=Number(f.espaciado)>=0&&Number(f.espaciado)<=18?f.espaciado+'px':'';
  }
  const root=document.documentElement;
  for(const [k,css,min,max] of [['espaciado','--editor-spacing',28,140],['radio_tarjetas','--editor-card-radius',0,36],['ancho_contenido','--editor-content-width',680,1500]]){
   const n=Number(d[k]);if(Number.isFinite(n))root.style.setProperty(css,Math.max(min,Math.min(max,n))+'px');
  }
  const hero=document.getElementById('inicio');if(hero)hero.style.textAlign=d.alineacion_portada==='izquierda'?'left':'center';
  document.querySelectorAll('[data-extra="yes"]').forEach(el=>el.remove());
  const main=document.querySelector('main');if(!main)return;
  const extras=Array.isArray(d.extras)?d.extras.slice(0,30):[];
  for(const x of extras){const node=addExtra(x);if(node)main.append(node)}
  const secciones=d.secciones||{};
  for(const [name,sel] of Object.entries({disco:'.album-tile',streaming:'.info-tile',redes:'#contactLinks',formulario:'.contact-form-area',botones_portada:'.hero .buttons',botones_musica:'#musicLinks'})){
    const e=document.querySelector(sel);if(e)e.hidden=d.bloques?.[name]?.oculto===true;
  }
  window.configurarHeaderSocials?.(d.encabezado_sociales||{});
  const formCfg=d.formulario||{};
  const form=document.getElementById('formulario-contacto');
  if(form){
    const title=document.getElementById('titulo-formulario');if(title && typeof formCfg.titulo==='string')title.textContent=formCfg.titulo;
    for(const [name,text] of [['name','Nombre'],['email','Correo electrónico'],['asunto','Asunto'],['mensaje','Mensaje']]){
      const input=form.elements.namedItem(name);const label=input?.closest('label');
      if(label && typeof formCfg['etiqueta_'+name]==='string'){
        // Preserva el control al sustituir únicamente el nodo de texto del label.
        const textNode=[...label.childNodes].find(n=>n.nodeType===Node.TEXT_NODE);
        if(textNode)textNode.textContent=formCfg['etiqueta_'+name];
      }
      if(input && typeof formCfg['placeholder_'+name]==='string')input.placeholder=formCfg['placeholder_'+name];
    }
  }

  const order=Array.isArray(d.orden)?d.orden:ids;
  [...ids,...extras.map(x=>x.id)].forEach(id=>{
   const el=document.getElementById(id);if(!el)return;
   const config=secciones[id]||{};el.dataset.visualHidden=config.oculta===true?'true':'false';
   el.style.order=order.includes(id)?order.indexOf(id):99;
   if(id!=='inicio'){
    el.style.backgroundColor=HEX(config.color)?config.color:'';
    el.style.backgroundImage=localImg(config.imagen)?`linear-gradient(rgba(0,0,0,.64),rgba(0,0,0,.64)),url("${src(config.imagen)}")`:'';
    el.style.backgroundSize=localImg(config.imagen)?'cover':'';
    el.style.backgroundPosition=localImg(config.imagen)?'center':'';
   }
  });
  document.querySelectorAll('nav.links a[href^="#"]').forEach(a=>{
   const key=a.getAttribute('href').slice(1);a.style.display=secciones[key]?.oculta===true?'none':'';
  });
 };
 fetch('content/diseno.json',{cache:'no-store'}).then(r=>r.ok?r.json():{}).then(window.aplicarDiseno).catch(console.warn);
})();

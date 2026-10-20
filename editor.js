/* Editor visual de Punkies y Cerebro — sin tokens ni credenciales.
   Edición en vivo, borradores locales y exportación ZIP para GitHub Pages. */
(()=>{'use strict';
const $=s=>document.querySelector(s), T=$('#properties'), frame=$('#preview');
const sections=['inicio','musica','conciertos','historia','tienda','galeria','contacto'];
const blockLabels={disco:'Tarjeta del nuevo disco',streaming:'Tarjeta de plataformas musicales',redes:'Enlaces de redes sociales',formulario:'Formulario de contacto',botones_portada:'Botones de portada',botones_musica:'Botones de música'};
const names={inicio:'Portada',musica:'Música',conciertos:'Conciertos',historia:'Historia',tienda:'Tienda',galeria:'Galería',contacto:'Contacto'};
const fields=[
 ['banda','Nombre de la banda','#nombre-menu','site'],['subtitulo','Subtítulo de portada','#subtitulo','site'],
 ['album','Nombre del nuevo álbum','#album','site'],['descripcion','Descripción de portada','#descripcion','site'],
 ['acerca','Historia completa','#acerca','site'],['lema','Lema de la portada','.tagline','dis'],
 ['titular_musica','Título: Música','#musica>.section-head h2','dis'],['presentacion_musica','Texto: Música','#musica>.section-head+p','dis'],
 ['titular_streaming','Título: Plataformas musicales','.info-tile h3','dis'],
 ['etiqueta_disco','Etiqueta del disco nuevo','.album-tile [data-texto-bloque="etiqueta_disco"]','dis'],
 ['estado_disco','Estado del disco nuevo','.album-tile [data-texto-bloque="estado_disco"]','dis'],
 ['titular_conciertos','Título: Conciertos','#conciertos>.section-head h2','dis'],['presentacion_conciertos','Texto: Conciertos','#conciertos>.section-head+p','dis'],
 ['titular_historia','Título: Historia','#historia>.section-head h2','dis'],
 ['titular_tienda','Título: Tienda','#tienda>.section-head h2','dis'],['presentacion_tienda','Texto: Tienda','#tienda>.section-head+p','dis'],
 ['titular_contacto','Título: Contacto','#contacto>.section-head h2','dis'],['presentacion_contacto','Texto: Contacto','#contacto>.section-head+p','dis'],
 ...sections.map(id=>['menu_'+id,'Menú: '+names[id],`.links a[href="#${id}"]`,'dis'])
];
const imageFields=[['fondo_portada','Fondo del pantano / portada'],['fondo_historia','Fondo de la historia'],['logo_portada','Logo de portada'],['logo_menu','Imagen del encabezado (opcional)'],['imagen_disco','Imagen del disco']];
const colors=[['color_menu','Letras del menú'],['color_texto','Texto general'],['color_fondo','Fondo del sitio'],['color_secciones','Fondo de secciones'],['color_tarjetas','Fondo de tarjetas'],['color_acento','Color destacado / botones']];
const fonts=[['Barlow Condensed','Punk / condensada'],['DM Sans','Moderna'],['Impact','Impact'],['Georgia','Georgia'],['Arial','Arial'],['Verdana','Verdana']];
const fallbackAppearance={color_fondo:'#11140F',color_secciones:'#0C100C',color_texto:'#E9E7D8',color_menu:'#FFFFFF',color_acento:'#A5BD6A',color_tarjetas:'#1C2419',fuente_menu:'Barlow Condensed',fuente_titulos:'Barlow Condensed',fuente_cuerpo:'DM Sans',tamano_menu:15,tamano_marca:28,tamano_titulos:76,tamano_parrafos:16,tamano_historia:19,alto_portada:680,fondo_portada:'/assets/pantano.jpg',fondo_historia:'',logo_portada:'/assets/logo-letras.png',logo_menu:'',imagen_disco:'/assets/logo-emblema.png',mostrar_lema:true,mostrar_historia:true,mostrar_tienda:true,mostrar_contacto:true};
const initial={site:{},app:fallbackAppearance,dis:{textos:{},secciones:{},orden:sections.slice(),extras:[],formato:{}},gal:{titulo:'GALERÍA',fotos:[]}};
const state={site:{},app:{},dis:{},gal:{}};let tab='textos',selText='subtitulo',selSection='inicio',selBlock='disco',selPhotoIndex=0,imageTarget=null,images={},pending=false,undo=[],toastTimeout=null,loaded=false;
const clone=o=>JSON.parse(JSON.stringify(o));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const attr=esc;
const alertMsg=t=>{let e=$('#toast');e.textContent=t;e.hidden=false;clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>e.hidden=true,4000)};
const setStatus=s=>$('#estado').textContent=s;
const projectBase='punkies-editor-borrador-v2';
let assetsDb=null,serverBaseline=null;
async function openDB(){if(!window.indexedDB)return;return new Promise(resolve=>{const r=indexedDB.open('punkies_editor_assets',1);r.onupgradeneeded=()=>r.result.createObjectStore('images',{keyPath:'path'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>resolve(null)})}
async function restoreImages(){if(!assetsDb)return;return new Promise(resolve=>{const tx=assetsDb.transaction('images','readonly').objectStore('images').getAll();tx.onsuccess=()=>{for(const a of tx.result)images[a.path]=a.data;resolve()};tx.onerror=resolve})}
function saveAsset(path,data){if(!assetsDb)return;assetsDb.transaction('images','readwrite').objectStore('images').put({path,data})}
function clearAssets(){if(!assetsDb)return;assetsDb.transaction('images','readwrite').objectStore('images').clear()}
async function fetchJson(path,fallback){try{const r=await fetch(path,{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);return await r.json()}catch(e){console.warn(path,e);return clone(fallback)}}
function remember(){try{localStorage.setItem(projectBase,JSON.stringify({state,time:Date.now()}))}catch(e){alertMsg('No se pudo guardar el borrador local; exporta los cambios ahora')}}
function snapshot(){undo.push(clone(state));if(undo.length>30)undo.shift()}
function commit(){pending=true;setStatus('● Cambios sin publicar');remember();previewNow()}
function modify(callback){snapshot();callback();commit()}
const persistControl=(obj,key,v)=>modify(()=>obj[key]=v);
function previewNow(){if(!loaded)return;const w=frame.contentWindow;
 try{w.__visualImages=images;w.renderCMSContent?.(state.site);w.aplicarApariencia?.(state.app);w.actualizarGaleria?.(state.gal);w.aplicarDiseno?.(state.dis);w.configurarHeaderSocials?.(state.dis.encabezado_sociales||{});w.document.querySelectorAll('#galeria-grid figure').forEach(el=>el.setAttribute('draggable','true'))}catch(e){console.error('vista previa',e);alertMsg('Espera un momento: la vista está actualizando')}
}
function fieldValue(f){return f[3]==='site'?state.site[f[0]]:state.dis.textos?.[f[0]]}
function selectTab(t){tab=t;$('#tabs').querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.tab===t));renderProps()}
function textBlock(f){const key=f[0],value=fieldValue(f)||'',multi=['acerca','descripcion','presentacion_musica','presentacion_conciertos','presentacion_tienda','presentacion_contacto'].includes(key);
 return `<div class="control"><label for="txt-${key}">${esc(f[1])}</label>${multi?`<textarea id="txt-${key}" rows="${key==='acerca'?9:3}" data-kind="text" data-key="${key}">${esc(value)}</textarea>`:`<input id="txt-${key}" type="text" data-kind="text" data-key="${key}" value="${attr(value)}">`}</div>`}
const selectHTML=(key,label,value,options,kind='app')=>`<div class="control"><label>${esc(label)}</label><select data-kind="${kind}" data-key="${key}">${options.map(([v,t])=>`<option value="${attr(v)}" ${value===v?'selected':''}>${esc(t)}</option>`).join('')}</select></div>`;
const colorHTML=(key,label,obj,kind='app')=>{const val=/^#[a-fA-F0-9]{6}$/.test(obj[key])?obj[key]:'#ffffff';return `<div class="control"><label>${esc(label)}</label><div class="color-row"><input aria-label="Elegir color" type="color" value="${val}" data-kind="${kind}" data-key="${key}"><input aria-label="Código hexadecimal" type="text" maxlength="7" value="${val}" data-kind="${kind}" data-key="${key}"></div></div>`};
const slider=(key,label,obj,min,max,step=1,kind='app')=>{const val=Number(obj[key])||min;return `<div class="control"><div class="slider-head"><label>${esc(label)}</label><output>${val}px</output></div><input type="range" min="${min}" max="${max}" step="${step}" value="${val}" data-kind="${kind}" data-key="${key}"></div>`};
function num(v,fallback){return Number.isFinite(Number(v))?Number(v):fallback}
function advancedImage(kind,key,obj,label){
 const ident=kind==='photo'?'photo':kind==='section'?'section':'app';
 const p=obj[key]||'',uri=images[p]||p,scale=num(obj[key+'_zoom'],100),x=num(obj[key+'_x'],50),y=num(obj[key+'_y'],50);
 const isBackground=(kind==='app'&&key.startsWith('fondo'))||kind==='section';
 const opacity=num(obj[key+'_opacity'],100),dark=num(obj[key+'_overlay'],isBackground?35:0);
 const fit=obj[key+'_fit']||'cover';
 return `<div class="advanced-img"><h3>${esc(label)} · Ajuste visual</h3><p class="note">Arrastra la imagen sobre el marco para mover el encuadre. Puedes verla completa, acercarla y oscurecer el fondo sin modificar el original.</p>
 ${p?`<div class="image-crop-frame" data-crop-kind="${ident}" data-crop-key="${key}" data-crop-index="${kind==='photo'?obj.__index:''}" title="Arrastra para desplazar el encuadre"><img draggable="false" src="${attr(uri)}" style="object-fit:${fit};object-position:${x}% ${y}%;transform:scale(${scale/100});opacity:${opacity/100}"><div class="crop-shade" style="background:rgba(0,0,0,${dark/100})"></div><div class="crop-cross">✥ Arrastrar para encuadrar</div></div>`:`<div class="crop-placeholder">Primero agrega una imagen</div>`}
 <button type="button" class="file-btn" data-img-kind="${kind==='photo'?'galphoto':kind}" data-img-key="${key}" ${kind==='photo'?`data-gallery-img="${obj.__index}"`:''}>↥ ${p?'Reemplazar imagen':'Subir imagen'}</button>
 ${selectHTML(key+'_fit','Cómo se ajusta',fit,[['cover','Llenar marco (recorta)'],['contain','Ver completa (sin recortar)'],['fill','Estirar al marco']],'imgprop:'+kind+':'+key+(kind==='photo'?':'+obj.__index:''))}
 ${slider(key+'_zoom','Zoom (%)', {[key+'_zoom']:scale},50,250,5,'imgprop:'+kind+':'+key+(kind==='photo'?':'+obj.__index:''))}
 ${slider(key+'_x','Punto focal horizontal (%)',{[key+'_x']:x},0,100,1,'imgprop:'+kind+':'+key+(kind==='photo'?':'+obj.__index:''))}
 ${slider(key+'_y','Punto focal vertical (%)',{[key+'_y']:y},0,100,1,'imgprop:'+kind+':'+key+(kind==='photo'?':'+obj.__index:''))}
 ${slider(key+'_opacity','Opacidad de imagen (%)',{[key+'_opacity']:opacity},0,100,5,'imgprop:'+kind+':'+key+(kind==='photo'?':'+obj.__index:''))}
 ${slider(key+'_overlay','Oscurecer / capa negra (%)',{[key+'_overlay']:dark},0,95,5,'imgprop:'+kind+':'+key+(kind==='photo'?':'+obj.__index:''))}
 <button type="button" class="action" data-reset-crop="${kind}:${key}${kind==='photo'?':'+obj.__index:''}">↺ Ajuste automático / restaurar encuadre</button>
 </div>`;
}
const imgHTML=(key,label,obj,kind='app')=>{const p=obj[key]||'',uri=images[p]||p;
 return `<div class="control"><label>${esc(label)}</label>${p?`<img class="img-preview" src="${attr(uri)}" alt="${esc(label)}">`:''}<button type="button" class="file-btn" data-img-kind="${kind}" data-img-key="${key}">＋ Elegir imagen de mi computador</button><small>${esc(p||'No se ha elegido imagen')}</small>${p?`<button type="button" data-clear-img="${key}" data-img-kind="${kind}" class="action" style="margin-top:7px">Quitar imagen</button>`:''}</div>`};

// Formato individual, editable sin afectar colores o letras de las demás secciones.
const textAligns=[['left','Izquierda'],['center','Centrado'],['right','Derecha'],['justify','Justificado']];
function formatControls(key){
 const f=state.dis.formato?.[key]||{};
 return `<div class="format-panel"><h3>Formato individual del texto</h3><p class="note">Solo cambia el elemento seleccionado. Elige primero el texto desde la vista previa.</p>
 <div class="format-tools">
 <button type="button" class="format-toggle ${f.negrita?'active':''}" data-format="negrita" aria-pressed="${!!f.negrita}" title="Negrita"><b>B</b></button>
 <button type="button" class="format-toggle ${f.cursiva?'active':''}" data-format="cursiva" aria-pressed="${!!f.cursiva}" title="Cursiva"><i>I</i></button>
 <button type="button" class="format-toggle ${f.subrayado?'active':''}" data-format="subrayado" aria-pressed="${!!f.subrayado}" title="Subrayado"><u>U</u></button>
 <button type="button" class="format-toggle ${f.mayusculas?'active':''}" data-format="mayusculas" aria-pressed="${!!f.mayusculas}" title="Mayúsculas">AA</button>
 </div>
 ${colorHTML('color','Color de este texto',f,'format')}
 ${selectHTML('fuente','Tipografía específica',f.fuente||'',[['','Heredar la tipografía general'],...fonts],'format')}
 ${selectHTML('alinear','Alineación',f.alinear||'',[['','Predeterminada'],...textAligns],'format')}
 ${slider('tamano','Tamaño de este texto',f,10,130,1,'format')}
 ${slider('espaciado','Separación entre letras',f,0,18,1,'format')}
 <button type="button" id="reset-format" class="action">Restaurar formato de este texto</button>
 </div>`;
}

function renderProps(){if(!Object.keys(state.site).length){T.innerHTML='<p class="note">Esperando los datos de la web...</p>';return}
 let h='';
 if(tab==='textos'){
   const f=fields.find(x=>x[0]===selText)||fields[1];
   h=`<h2>Editar textos</h2><p class="note">Haz clic sobre un texto de la vista previa o selecciónalo aquí.</p>${selectHTML('field','Texto que quieres editar',selText,fields.map(x=>[x[0],x[1]]),'selection')}${textBlock(f)}${formatControls(selText)}<button class="action danger" id="toggle-text">${state.dis.ocultos_texto?.[selText]?'↺ Restaurar texto':'✕ Quitar este texto del sitio'}</button>${['album','etiqueta_disco','estado_disco'].includes(selText)?'<button class="action danger" id="hide-album-card">✕ Quitar tarjeta completa del nuevo disco</button>':''}<h3>Otros contenidos</h3><p class="note">Los conciertos, discos y productos continúan en Pages CMS; así conservamos las fichas y enlaces de la banda.</p><a class="action" style="text-decoration:none;display:inline-block" target="_blank" rel="noopener" href="https://app.pagescms.org/">Abrir Pages CMS ↗</a>`;
 }else if(tab==='estilo'){
   h='<h2>Colores y fuentes</h2><p class="note">Cambia una opción y verás el resultado inmediatamente.</p>';
   h+=colors.map(([k,l])=>colorHTML(k,l,state.app)).join('');
   h+='<h3>Tipografías</h3>';
   h+=[['fuente_menu','Letra del menú'],['fuente_titulos','Letra de los títulos'],['fuente_cuerpo','Letra de los párrafos']].map(([k,l])=>selectHTML(k,l,state.app[k],fonts)).join('');
   h+='<h3>Tamaños de letra</h3>';
   h+=[['tamano_menu','Tamaño del menú',10,28],['tamano_marca','Nombre de la banda',16,52],['tamano_titulos','Títulos de las secciones',28,130],['tamano_parrafos','Párrafos',12,24],['tamano_historia','Texto de historia',14,30],['alto_portada','Altura de portada',350,1100]].map(([k,l,min,max])=>slider(k,l,state.app,min,max)).join('');
   h+='<h3>Espacios y distribución</h3>'+slider('espaciado','Espacio vertical',state.dis,28,140,1,'dis')+slider('radio_tarjetas','Redondeado tarjetas',state.dis,0,36,1,'dis')+slider('ancho_contenido','Ancho máximo del contenido',state.dis,680,1500,10,'dis');
   h+=selectHTML('alineacion_portada','Alineación de portada',state.dis.alineacion_portada||'centro',[['centro','Centrada'],['izquierda','Izquierda']],'dis');
 }else if(tab==='imagenes'){
   h='<h2>Imágenes y fondos</h2><p class="note">Sube imágenes JPG, PNG o WebP. El editor las adapta y las incluye en el ZIP.</p>';
   h+=imageFields.map(([k,l])=>advancedImage('app',k,state.app,l)).join('');
 }else if(tab==='secciones'){
   const all=[...sections,...(state.dis.extras||[]).map(x=>x.id)];
   if(!all.includes(selSection))selSection='inicio';const sect=state.dis.secciones?.[selSection]||{},extra=(state.dis.extras||[]).find(x=>x.id===selSection);
   h='<h2>Secciones y distribución</h2><p class="note">Arrastra las filas o utiliza las flechas para cambiar el orden. Las secciones ocultas desaparecen de la web.</p>';
   h+=`<div class="ordered">${(state.dis.orden||all).filter(k=>all.includes(k)).map(id=>`<div class="row-ordered" draggable="true" data-drag="${id}"><span>${esc(names[id]||((state.dis.extras||[]).find(x=>x.id===id)?.titulo||'Sección nueva'))}</span><button title="Subir" data-move="${id}" data-dir="-1">↑</button><button title="Bajar" data-move="${id}" data-dir="1">↓</button><button title="Editar" data-section="${id}">✎</button></div>`).join('')}</div>`;
   h+=`<button class="big-action" id="add-section">＋ Añadir nueva sección</button><h3>Editar sección seleccionada</h3>${selectHTML('sec','Sección',selSection,all.map(id=>[id,names[id]||(state.dis.extras||[]).find(x=>x.id===id)?.titulo||id]),'selectSection')}`;
   h+=`<label class="control-check"><input type="checkbox" data-kind="section" data-key="oculta" ${sect.oculta===true?'checked':''}> Quitar esta sección de la página (reversible)</label>
   <div class="actions-row"><button class="action danger" id="hide-section">${sect.oculta?'↺ Recuperar sección':'✕ Eliminar de la vista pública'}</button><button class="action" id="section-up">↑ Subir sección</button><button class="action" id="section-down">↓ Bajar sección</button></div>`;
   if(selSection!=='inicio')h+=colorHTML('color','Color de fondo',sect,'section')+advancedImage('section','imagen',sect,'Imagen de fondo de sección');
   if(extra){h+=`<h3>Contenido del bloque añadido</h3>${['titulo','texto','boton','enlace'].map((k)=>`<div class="control"><label>${{titulo:'Título',texto:'Párrafo',boton:'Texto del botón',enlace:'Enlace HTTPS del botón'}[k]}</label>${k==='texto'?`<textarea data-kind="extra" data-key="${k}" rows="5">${esc(extra[k]||'')}</textarea>`:`<input type="text" value="${attr(extra[k]||'')}" data-kind="extra" data-key="${k}">`}</div>`).join('')}${imgHTML('imagen','Imagen del bloque',extra,'extra')}<button class="action danger" id="delete-extra">Eliminar sección nueva</button>`}
 }else if(tab==='bloques'){
   state.dis.bloques??={};const block=state.dis.bloques[selBlock]||{};
   h=`<h2>Editar elemento</h2><p class="note">Haz clic sobre una tarjeta, formulario, botones o foto de la vista previa para seleccionarlos. Puedes quitarlos de la página sin borrar su información.</p>
   ${selectHTML('block','Elemento seleccionado',selBlock,Object.entries(blockLabels),'selectBlock')}
   <div class="selected-element"><strong>${esc(blockLabels[selBlock]||selBlock)}</strong><p class="note">Si lo ocultas, podrás volver a mostrarlo aquí cuando quieras.</p></div>
   <label class="control-check"><input type="checkbox" data-kind="block" data-key="oculto" ${block.oculto===true?'checked':''}> Ocultar / quitar este elemento de la web</label>
   <button class="big-action" type="button" id="toggle-block">${block.oculto?'↺ Recuperar elemento':'✕ Quitar elemento de la página'}</button>`;
   if(selBlock==='disco')h+='<p class="note">Para cambiar la portada del disco, selecciona la imagen en la vista previa. El título y el estado se editan haciendo clic en los textos.</p>';
   if(selBlock==='formulario')h+='<button class="big-action" type="button" id="go-form">✉ Configurar formulario y correo</button>';
   h+=`<h3>Secciones completas</h3><p class="note">Puedes seleccionar una sección y ocultarla sin destruirla.</p>`;
   h+=Object.keys(names).map(k=>`<button class="action" style="margin:5px" data-section="${k}">${esc(names[k])}</button>`).join('');
 }else if(tab==='contacto'){
   state.dis.formulario??={};const form=state.dis.formulario;
   h=`<h2>Formulario de contacto</h2><p class="note">Selecciona el formulario en la vista previa o configura aquí dónde llegan los mensajes. No necesitas modificar ningún código.</p>
   <div class="control"><label>Correo principal — recibe todos los mensajes</label><input type="email" data-kind="site" data-key="correo_formulario" value="${attr(state.site.correo_formulario||'')}" placeholder="contacto@tudominio.com"></div>
   <div class="control"><label>Otros correos que reciben copia (uno por línea)</label><textarea rows="4" data-kind="site" data-key="copias_formulario" placeholder="integrante1@gmail.com&#10;integrante2@gmail.com">${esc(String(state.site.copias_formulario||'').replace(/[,;]+/g,'\n'))}</textarea><p class="note">Puedes agregar 2, 3 o más correos; presiona Enter para escribir el siguiente. Cada uno recibirá una copia del mismo mensaje.</p></div>
   <div class="control"><label>Correo público de la banda (opcional)</label><input type="email" data-kind="site" data-key="contacto" value="${attr(state.site.contacto||'')}" placeholder="banda@ejemplo.com"></div>
   <p class="note">Los mensajes se envían sin sacar a los visitantes de la página y les mostramos una confirmación. Cuando cambies el correo principal, deberás activarlo mediante el enlace de FormSubmit que llegará al nuevo buzón. Los destinatarios pueden quedar visibles en el código público.</p>`;
   h+=[['titulo','Título del formulario','ENVÍANOS UN MENSAJE'],['etiqueta_name','Texto: nombre','Nombre'],['etiqueta_email','Texto: correo','Correo electrónico'],['etiqueta_asunto','Texto: asunto','Asunto'],['etiqueta_mensaje','Texto: mensaje','Mensaje'],['placeholder_name','Ejemplo en nombre','Tu nombre'],['placeholder_email','Ejemplo en correo','tucorreo@ejemplo.com'],['placeholder_asunto','Ejemplo en asunto','¿Sobre qué quieres escribirnos?'],['placeholder_mensaje','Ejemplo en mensaje','Escribe aquí tu mensaje']].map(([k,l,d])=>`<div class="control"><label>${esc(l)}</label><input type="text" data-kind="formulario" data-key="${k}" value="${attr(form[k]??d)}"></div>`).join('');
   h+=`<button type="button" class="action danger" id="hide-form">${state.dis.bloques?.formulario?.oculto?'Mostrar formulario':'Ocultar formulario'}</button>`;
 }else if(tab==='galeria'){
   h='<h2>Galería visual</h2><p class="note">Haz clic sobre una foto en la página para seleccionarla y ajustar su tamaño. Elige la presentación, ajusta cada foto y cambia el orden con las flechas o arrastrando las tarjetas.</p>';
   h+=`<div class="control"><label>Título de galería</label><input type="text" data-kind="gal" data-key="titulo" value="${attr(state.gal.titulo||'GALERÍA')}"></div>`;
   h+=selectHTML('modo','Presentación',state.gal.modo||'cuadricula',[['cuadricula','Cuadrícula'],['carrusel','Carrusel con flechas'],['mosaico','Mosaico']],'gal');
   h+=slider('alto','Altura general de las fotos',state.gal,120,750,10,'gal');
   h+=slider('columnas','Columnas (cuadrícula y mosaico)',state.gal,1,5,1,'gal');
   h+=slider('espacio','Separación entre fotografías',state.gal,0,55,1,'gal');
   h+='<button id="add-photo" class="big-action">＋ Añadir fotografía</button>';
   if(state.gal.fotos.length)h+=`<p class="note">Foto seleccionada: ${Math.min(selPhotoIndex+1,state.gal.fotos.length)} de ${state.gal.fotos.length}. También puedes arrastrar la esquina de la foto seleccionada en la vista previa.</p><button type="button" class="action danger" id="delete-selected-photo">✕ Eliminar foto seleccionada</button>`;
   h+=(state.gal.fotos||[]).map((f,i)=>`<div class="img-item" draggable="true" data-photo-drag="${i}"><div class="row-ordered"><strong>☰ Foto ${i+1}</strong><button type="button" data-focus-photo="${i}" title="Seleccionar foto">Editar</button><span></span><button data-photo-move="${i}" data-dir="-1" title="Anterior">↑</button><button data-photo-move="${i}" data-dir="1" title="Siguiente">↓</button></div>${f.imagen?`<img class="img-preview" src="${attr(images[f.imagen]||f.imagen)}" alt="Foto">`:''}<button type="button" class="file-btn" data-gallery-img="${i}">Cambiar fotografía</button><div class="control"><label>Descripción</label><input value="${attr(f.pie||'')}" type="text" data-gallery-caption="${i}"></div>${selectHTML('ajuste','Ajuste de esta imagen',f.ajuste||'cover',[['cover','Llenar marco (recorta)'],['contain','Mostrar completa (sin recortar)'],['fill','Estirar al marco']],'photo:'+i)}${slider('posX','Encuadre horizontal',f,0,100,1,'photo:'+i)}${slider('posY','Encuadre vertical',f,0,100,1,'photo:'+i)}${slider('alto','Altura individual',f,120,750,10,'photo:'+i)}${slider('ancho','Ancho de esta foto (%)',f,25,100,5,'photo:'+i)}${advancedImage('photo','imagen',{...f,__index:i},'Fotografía '+(i+1))}<button class="action danger" data-remove-photo="${i}">Eliminar fotografía</button></div>`).join('');
 }else if(tab==='enlaces'){
   h='<h2>Enlaces y contacto</h2><p class="note">Cambia las redes, el correo visible y el destinatario del formulario. Para activar el formulario, haz un envío de prueba y confirma el mensaje que te envíe FormSubmit al buzón elegido. Los visitantes podrán escribir nombre, asunto, correo y mensaje. El correo de destino quedará visible en el HTML como parte de la integración estática.</p>';
   
   const header=state.dis.encabezado_sociales||{};
   h+='<div class="selected-element"><strong>Redes sociales del encabezado</strong><p class="note">Se verán en la parte superior derecha de la web. Los botones utilizan los enlaces que configuras más abajo. Puedes seleccionar los íconos desde la vista previa.</p></div>';
   h+=`<label class="control-check"><input type="checkbox" data-kind="socialheader" data-key="mostrar" ${header.mostrar!==false?'checked':''}> Mostrar iconos de redes en la cabecera</label>`;
   h+=[['youtube','YouTube'],['instagram','Instagram'],['facebook','Facebook'],['spotify','Spotify']].map(([k,l])=>`<label class="control-check"><input type="checkbox" data-kind="socialheader" data-key="mostrar_${k}" ${header['mostrar_'+k]!==false?'checked':''}> Mostrar ${l} en el encabezado</label>`).join('');
   h+=colorHTML('color','Color de los iconos',{color:header.color||'#FFFFFF'},'socialheader');
   h+=slider('tamano','Tamaño de los iconos (px)',{tamano:header.tamano||22},16,38,1,'socialheader');
   h+='<h3>Direcciones de cada red</h3><p class="note">Al pulsar un icono, el visitante abrirá la red social correspondiente en otra pestaña.</p>';
h+=[['spotify','Spotify'],['youtube','YouTube'],['instagram','Instagram'],['facebook','Facebook'],['contacto','Correo público de contacto'],['correo_formulario','Correo principal que recibe los mensajes']].map(([k,l])=>`<div class="control"><label>${l}</label><input type="text" data-kind="site" data-key="${k}" value="${attr(state.site[k]||'')}" placeholder="${k==='contacto'?'correo@ejemplo.com':'https://...'}"></div>`).join('');
 h+='<p class="note">Para agregar dos o más correos en copia, utiliza la pestaña ✉ Formulario.</p>';
 }
 T.innerHTML=h;
}
function currentField(k){return fields.find(f=>f[0]===k)}
function routeEvent(e){const target=e.target;const kind=target.dataset.kind,key=target.dataset.key;
 if(!kind)return;
 if(kind==='selection'){selText=target.value;renderProps();return}
 if(kind==='selectSection'){selSection=target.value;renderProps();return}
 if(kind==='selectBlock'){selBlock=target.value;renderProps();return}
 if(kind==='block'){modify(()=>{state.dis.bloques??={};state.dis.bloques[selBlock]??={};state.dis.bloques[selBlock][key]=target.checked});renderProps();return}
 if(kind==='formulario'){modify(()=>{state.dis.formulario??={};state.dis.formulario[key]=target.value});return}
 if(kind==='text'){
  const f=currentField(key);if(!f)return;
  modify(()=>{if(f[3]==='site')state.site[key]=target.value;else state.dis.textos[key]=target.value});return
 }
 if(kind==='socialheader'){
  let val=target.type==='checkbox'?target.checked:target.type==='range'?Number(target.value):target.value;
  if(key==='color'&&target.type==='text'&&!/^#[a-fA-F0-9]{6}$/.test(val))return;
  modify(()=>{state.dis.encabezado_sociales??={};state.dis.encabezado_sociales[key]=val});
  if(target.type==='color')T.querySelectorAll('[data-kind="socialheader"][data-key="color"][type="text"]').forEach(x=>x.value=val);
  if(target.type==='range')target.closest('.control').querySelector('output').textContent=val+'px';return;
 }
 if(kind==='site'){persistControl(state.site,key,target.value);return}
 if(kind==='format'){
  let val=target.value;if(target.type==='range')val=Number(val);
  if(key==='color'&&target.type==='text'&&!/^#[0-9a-fA-F]{6}$/.test(val))return;
  modify(()=>{state.dis.formato??={};state.dis.formato[selText]??={};state.dis.formato[selText][key]=val});
  if(key==='color'&&target.type==='color')T.querySelectorAll('[data-kind="format"][data-key="color"][type="text"]').forEach(x=>x.value=val);
  if(target.type==='range')target.closest('.control').querySelector('output').textContent=val+'px';return;
 }

 if(kind.startsWith('imgprop:')){
  const [_,scope,imgkey,index]=kind.split(':');
  const obj=scope==='app'?state.app:scope==='section'?(state.dis.secciones[selSection]??={}):state.gal.fotos?.[Number(index)];
  if(!obj)return;
  const val=target.type==='range'?Number(target.value):target.value;
  persistControl(obj,key,val);
  if(target.type==='range')target.closest('.control')?.querySelector('output')&&(target.closest('.control').querySelector('output').textContent=val+(key.endsWith('_x')||key.endsWith('_y')||key.endsWith('_zoom')||key.endsWith('_opacity')||key.endsWith('_overlay')?'%':'px'));
  const frame=target.closest('.advanced-img')?.querySelector('.image-crop-frame');
  if(frame){const img=frame.querySelector('img');img.style.objectFit=obj[imgkey+'_fit']||'cover';img.style.objectPosition=`${num(obj[imgkey+'_x'],50)}% ${num(obj[imgkey+'_y'],50)}%`;img.style.transform=`scale(${num(obj[imgkey+'_zoom'],100)/100})`;img.style.opacity=num(obj[imgkey+'_opacity'],100)/100;frame.querySelector('.crop-shade').style.background=`rgba(0,0,0,${num(obj[imgkey+'_overlay'],0)/100})`}
  return;
 }
 if(kind.startsWith('photo:')){const i=Number(kind.split(':')[1]);const photo=state.gal.fotos?.[i];if(photo){persistControl(photo,key,target.type==='range'?Number(target.value):target.value);if(target.type==='range')target.closest('.control').querySelector('output').textContent=target.value+'px'}return}
 if(kind==='gal'){persistControl(state.gal,key,target.type==='range'?Number(target.value):target.value);return}
 if(kind==='app'||kind==='dis'){
  let val=target.value;if(target.type==='range')val=Number(val);
  if(target.type==='text'&&key.startsWith('color')&&!/^#[0-9a-fA-F]{6}$/.test(val))return;
  persistControl(state[kind],key,val);
  if(target.type==='color'){T.querySelectorAll(`[data-key="${key}"][type="text"]`).forEach(x=>x.value=val)}
  if(target.type==='range')target.closest('.control').querySelector('output').textContent=val+'px';return
 }
 if(kind==='section'){modify(()=>{state.dis.secciones[selSection]??={};state.dis.secciones[selSection][key]=target.checked});return}
 if(kind==='extra'){const o=state.dis.extras.find(x=>x.id===selSection);if(o)persistControl(o,key,target.value);return}
}
T.addEventListener('input',e=>{
 if(e.target.matches('[data-gallery-caption]')){const i=Number(e.target.dataset.galleryCaption);const p=state.gal.fotos?.[i];if(p)persistControl(p,'pie',e.target.value);return}
 // selects handled on change; text input on input
 if(e.target.matches('select,[type=checkbox]'))return;
 routeEvent(e);
});
T.addEventListener('change',e=>{if(e.target.matches('select,[type=checkbox]'))routeEvent(e)});
T.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.focusPhoto!==undefined){selPhotoIndex=Number(b.dataset.focusPhoto);selectTab('galeria');return}
 if(b.dataset.resetCrop){const [scope,key,index]=b.dataset.resetCrop.split(':');const obj=scope==='app'?state.app:scope==='section'?(state.dis.secciones[selSection]??={}):state.gal.fotos?.[Number(index)];if(obj){modify(()=>{Object.assign(obj,{[key+'_fit']:'contain',[key+'_zoom']:100,[key+'_x']:50,[key+'_y']:50,[key+'_opacity']:100,[key+'_overlay']:scope==='photo'?0:35})});renderProps()}return}
 if(b.dataset.format){modify(()=>{state.dis.formato??={};state.dis.formato[selText]??={};const obj=state.dis.formato[selText];obj[b.dataset.format]=!obj[b.dataset.format]});renderProps();return}
 if(b.id==='toggle-text'){modify(()=>{state.dis.ocultos_texto??={};state.dis.ocultos_texto[selText]=!state.dis.ocultos_texto[selText]});renderProps();return}
 if(b.id==='hide-album-card'){modify(()=>{state.dis.bloques??={};state.dis.bloques.disco??={};state.dis.bloques.disco.oculto=true});selBlock='disco';selectTab('bloques');return}
 if(b.id==='hide-section'){modify(()=>{state.dis.secciones[selSection]??={};state.dis.secciones[selSection].oculta=!state.dis.secciones[selSection].oculta});renderProps();return}
 if(b.id==='section-up'||b.id==='section-down'){const i=state.dis.orden.indexOf(selSection),j=i+(b.id==='section-up'?-1:1);if(j>=0&&j<state.dis.orden.length)modify(()=>{state.dis.orden.splice(j,0,state.dis.orden.splice(i,1)[0])});renderProps();return}
 if(b.id==='go-form'){selectTab('contacto');return}
 if(b.id==='toggle-block'||b.id==='hide-form'){const id=b.id==='hide-form'?'formulario':selBlock;modify(()=>{state.dis.bloques??={};state.dis.bloques[id]??={};state.dis.bloques[id].oculto=!state.dis.bloques[id].oculto});renderProps();return}
 if(b.id==='reset-format'){modify(()=>{if(state.dis.formato)delete state.dis.formato[selText]});renderProps();return}
 if(b.dataset.imgKind){imageTarget={kind:b.dataset.imgKind,key:b.dataset.imgKey,i:b.dataset.galleryImg!==undefined?Number(b.dataset.galleryImg):undefined};$('#fileinput').click();return}
 if(b.dataset.clearImg){const k=b.dataset.clearImg,kind=b.dataset.imgKind;modify(()=>{if(kind==='section'){state.dis.secciones[selSection]??={};state.dis.secciones[selSection][k]=''}else if(kind==='extra'){const x=state.dis.extras.find(x=>x.id===selSection);if(x)x[k]=''}else state.app[k]=''});renderProps();return}
 if(b.dataset.galleryImg!==undefined){imageTarget={kind:'galphoto',i:Number(b.dataset.galleryImg)};$('#fileinput').click();return}
 if(b.dataset.photoMove!==undefined){const i=Number(b.dataset.photoMove),j=i+Number(b.dataset.dir);if(j>=0&&j<state.gal.fotos.length){modify(()=>{const a=state.gal.fotos;a.splice(j,0,a.splice(i,1)[0])});renderProps()}return}
 if(b.dataset.removePhoto!==undefined){modify(()=>state.gal.fotos.splice(Number(b.dataset.removePhoto),1));renderProps();return}
 if(b.dataset.section){selSection=b.dataset.section;selectTab('secciones');return}
 if(b.dataset.move){const i=state.dis.orden.indexOf(b.dataset.move),j=i+Number(b.dataset.dir);if(j>=0&&j<state.dis.orden.length)modify(()=>{const a=state.dis.orden;a.splice(j,0,a.splice(i,1)[0])});renderProps();return}
 if(b.id==='add-section'){if(state.dis.extras.length>=20){alertMsg('Máximo 20 secciones nuevas');return}
  let id='x'+String(Date.now()).slice(-11);while(state.dis.orden.includes(id))id='x'+String(Date.now()+Math.floor(Math.random()*1000)).slice(-11);
  modify(()=>{state.dis.extras.push({id,titulo:'Nueva sección',texto:'Escribe aquí el contenido de esta sección.',boton:'',enlace:'',imagen:''});state.dis.orden.push(id)});selSection=id;renderProps();return}
 if(b.id==='delete-extra'){modify(()=>{state.dis.extras=state.dis.extras.filter(x=>x.id!==selSection);state.dis.orden=state.dis.orden.filter(x=>x!==selSection);delete state.dis.secciones[selSection]});selSection='inicio';renderProps();return}
 if(b.id==='delete-selected-photo'){if(state.gal.fotos[selPhotoIndex]&&confirm('¿Quitar esta fotografía de la galería?')){modify(()=>state.gal.fotos.splice(selPhotoIndex,1));selPhotoIndex=Math.max(0,selPhotoIndex-1);renderProps()}return}
 if(b.id==='add-photo'){imageTarget={kind:'galnew'};$('#fileinput').click();return}
});
let cropDrag=null;
T.addEventListener('pointerdown',e=>{const el=e.target.closest('.image-crop-frame');if(!el)return;const scope=el.dataset.cropKind,key=el.dataset.cropKey,i=Number(el.dataset.cropIndex);const obj=scope==='app'?state.app:scope==='section'?state.dis.secciones[selSection]:state.gal.fotos?.[i];if(!obj)return;cropDrag={el,scope,key,i,startX:e.clientX,startY:e.clientY,x:num(obj[key+'_x'],50),y:num(obj[key+'_y'],50)};el.setPointerCapture(e.pointerId);e.preventDefault()});
T.addEventListener('pointermove',e=>{if(!cropDrag)return;const c=cropDrag,dx=(e.clientX-c.startX)/Math.max(1,c.el.clientWidth)*100,dy=(e.clientY-c.startY)/Math.max(1,c.el.clientHeight)*100;const obj=c.scope==='app'?state.app:c.scope==='section'?state.dis.secciones[selSection]:state.gal.fotos?.[c.i];if(!obj)return;obj[c.key+'_x']=Math.max(0,Math.min(100,Math.round(c.x-dx)));obj[c.key+'_y']=Math.max(0,Math.min(100,Math.round(c.y-dy)));c.el.querySelector('img').style.objectPosition=`${obj[c.key+'_x']}% ${obj[c.key+'_y']}%`;});
T.addEventListener('pointerup',()=>{if(!cropDrag)return;cropDrag=null;commit();renderProps()});
let draggedPhoto=null;
T.addEventListener('dragstart',e=>{const item=e.target.closest('[data-photo-drag]');if(item){draggedPhoto=Number(item.dataset.photoDrag);e.dataTransfer.effectAllowed='move'}});
T.addEventListener('dragover',e=>{if(e.target.closest('[data-photo-drag]'))e.preventDefault()});
T.addEventListener('drop',e=>{const item=e.target.closest('[data-photo-drag]');if(!item||draggedPhoto===null)return;e.preventDefault();const dest=Number(item.dataset.photoDrag);if(dest!==draggedPhoto)modify(()=>{const a=state.gal.fotos;a.splice(dest,0,a.splice(draggedPhoto,1)[0])});draggedPhoto=null;renderProps()});
let dragId=null;
T.addEventListener('dragstart',e=>{const row=e.target.closest('[data-drag]');if(row){dragId=row.dataset.drag;e.dataTransfer.effectAllowed='move'}});
T.addEventListener('dragover',e=>{if(e.target.closest('[data-drag]'))e.preventDefault()});
T.addEventListener('drop',e=>{const row=e.target.closest('[data-drag]');if(!row||!dragId||row.dataset.drag===dragId)return;e.preventDefault();modify(()=>{const a=state.dis.orden,old=a.indexOf(dragId),idx=a.indexOf(row.dataset.drag);if(old<0||idx<0)return;a.splice(idx,0,a.splice(old,1)[0])});dragId=null;renderProps()});
$('#tabs').addEventListener('click',e=>{const b=e.target.closest('button[data-tab]');if(b)selectTab(b.dataset.tab)});
function hookPreview(){const doc=frame.contentDocument;if(!doc)return;
 let old=null;
 const style=doc.createElement('style');style.textContent='[data-editor-selected]{outline:3px solid #cfff80!important;outline-offset:3px!important} #subtitulo:hover,#album:hover,#descripcion:hover,#acerca:hover,.tagline:hover,.section-head h2:hover,.tile:hover,.contact-form-area:hover,.galeria-grid figure:hover{outline:2px dashed #cfff8099;outline-offset:3px} a,button{cursor:pointer!important} [contenteditable=true]{outline:3px solid #cfff80!important;background:#1b2716db!important;cursor:text!important}';doc.head.appendChild(style);
 const select=(node)=>{if(old)old.removeAttribute('data-editor-selected');old=node;if(node)node.setAttribute('data-editor-selected','true')};
 doc.addEventListener('dblclick',e=>{
  const el=e.target;const f=fields.find(f=>el.closest(f[2]))||(el.closest('#album-music')?fields.find(f=>f[0]==='album'):null);if(!f)return;
  e.preventDefault();e.stopPropagation();const node=el.closest(f[2])||el.closest('#album-music');if(!node)return;
  node.setAttribute('contenteditable','true');node.setAttribute('spellcheck','true');node.focus();
  const selection=doc.getSelection(),range=doc.createRange();range.selectNodeContents(node);selection.removeAllRanges();selection.addRange(range);
  const update=()=>{node.removeEventListener('blur',update);node.removeAttribute('contenteditable');const val=node.textContent;
   if(f[3]==='site')modify(()=>state.site[f[0]]=val);else modify(()=>state.dis.textos[f[0]]=val);
   selText=f[0];selectTab('textos');alertMsg('Texto guardado en el borrador');
  };node.addEventListener('blur',update,{once:true});
 },true);
 doc.addEventListener('click',e=>{
  e.preventDefault();e.stopPropagation();const el=e.target;
  const photo=el.closest('#galeria-grid figure');if(photo){const i=Array.from(photo.parentNode.children).indexOf(photo);if(i>=0){selPhotoIndex=i;select(photo);selectTab('galeria');addGrip(doc,photo,i);const card=T.querySelector(`[data-photo-drag="${i}"]`);card?.scrollIntoView({block:'nearest'})}return}
  const img=el.closest('#logo-portada-img,#logo-menu-img,#imagen-disco-img');if(img){select(img);selectTab('imagenes');return}
  const matching=fields.find(f=>el.closest(f[2]))||(el.closest('#album-music')?fields.find(f=>f[0]==='album'):null);
  if(matching){selText=matching[0];select(el.closest(matching[2])||el.closest('#album-music'));selectTab('textos');return}
  const form=el.closest('.contact-form-area');if(form){select(form);selectTab('contacto');return}
  const headerSocial=el.closest('#header-socials a,#header-socials');if(headerSocial){select(headerSocial);selectTab('enlaces');return}
 const social=el.closest('#contactLinks a,#musicLinks a');if(social){select(social);selectTab('enlaces');return}
  const block=el.closest('[data-visual-block]');if(block){selBlock=block.dataset.visualBlock;select(block);selectTab('bloques');return}
  const sect=el.closest('main section');if(sect){selSection=sect.id;select(sect);selectTab('secciones');return}
  alertMsg('Haz clic sobre una foto, texto, tarjeta o formulario');
 },true);
 // Reorganización de fotografías con el mouse sobre la vista previa.
 let from=null;
 doc.addEventListener('dragstart',e=>{const fig=e.target.closest('#galeria-grid figure');if(fig){from=Array.from(fig.parentNode.children).indexOf(fig);e.dataTransfer.effectAllowed='move'}});
 doc.addEventListener('dragover',e=>{if(e.target.closest('#galeria-grid figure'))e.preventDefault()});
 doc.addEventListener('drop',e=>{const fig=e.target.closest('#galeria-grid figure');if(!fig||from===null)return;e.preventDefault();const to=Array.from(fig.parentNode.children).indexOf(fig);if(from>=0&&to>=0&&from!==to){modify(()=>{const a=state.gal.fotos;a.splice(to,0,a.splice(from,1)[0])});selPhotoIndex=to;renderProps()}from=null});
 doc.querySelectorAll('#galeria-grid figure').forEach(el=>el.setAttribute('draggable','true'));
}
function addGrip(doc,fig,i){doc.querySelectorAll('.editor-grip').forEach(x=>x.remove());const grip=doc.createElement('div');grip.className='editor-grip';grip.textContent='↘ Tamaño';grip.title='Arrastra para cambiar el tamaño';fig.append(grip);
 let start=null;grip.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();grip.setPointerCapture(e.pointerId);start={x:e.clientX,y:e.clientY,w:fig.clientWidth,h:fig.querySelector('img')?.clientHeight||300};});
 grip.addEventListener('pointermove',e=>{if(!start)return;let h=Math.round(Math.max(120,Math.min(750,start.h+e.clientY-start.y)));const w=Math.round(Math.max(25,Math.min(100,((start.w+e.clientX-start.x)/Math.max(1,fig.parentNode.clientWidth))*100)));fig.querySelector('img').style.height=h+'px';fig.style.setProperty('--item-width',w+'%');});
 grip.addEventListener('pointerup',e=>{if(!start)return;const img=fig.querySelector('img'),h=Math.round(Math.max(120,Math.min(750,img.clientHeight))),w=Math.round(Math.max(25,Math.min(100,fig.clientWidth/Math.max(1,fig.parentNode.clientWidth)*100)));start=null;if(state.gal.fotos?.[i])modify(()=>{state.gal.fotos[i].alto=h;state.gal.fotos[i].ancho=w});renderProps()});
}
frame.addEventListener('load',()=>{loaded=true;hookPreview();setTimeout(previewNow,150);setTimeout(previewNow,900)});
$('#desktop').addEventListener('click',()=>{$('#frame-shell').classList.remove('mobile');$('#desktop').classList.add('active');$('#mobile').classList.remove('active')});
$('#mobile').addEventListener('click',()=>{$('#frame-shell').classList.add('mobile');$('#desktop').classList.remove('active');$('#mobile').classList.add('active')});
$('#undo').addEventListener('click',()=>{if(!undo.length){alertMsg('No hay cambios para deshacer');return}const previous=undo.pop();Object.keys(state).forEach(k=>state[k]=previous[k]);commit();renderProps();alertMsg('Último cambio deshecho')});
$('#backup').addEventListener('click',()=>{
 const doc={version:3,created:new Date().toISOString(),state,images};
 const blob=new Blob([JSON.stringify(doc)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='punkies-borrador-respaldo.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);alertMsg('Respaldo descargado. Guárdalo en un lugar seguro.')
});
$('#restore').addEventListener('click',()=>$('#restorefile').click());
$('#restorefile').addEventListener('change',async(e)=>{
 const f=e.target.files?.[0];e.target.value='';if(!f)return;
 if(f.size>25000000){alertMsg('Archivo de respaldo demasiado grande');return}
 try{const b=JSON.parse(await f.text());if(b.version!==3||!b.state?.site?.banda||!b.state?.dis){throw Error('No es un respaldo compatible')}
  if(!confirm('¿Reemplazar el borrador actual por el contenido de este respaldo?'))return;
  snapshot();for(const k of Object.keys(state)){if(b.state[k])state[k]=b.state[k]}
  for(const [path,data] of Object.entries(b.images||{})){if(/^\/media\/visual\/[a-zA-Z0-9_.\-]+$/.test(path)&&/^data:image\/(png|jpeg|webp);base64,/.test(data)){images[path]=data;saveAsset(path,data)}}
  state.dis.formato??={};commit();renderProps();alertMsg('Respaldo restaurado')
 }catch(err){alertMsg('No se pudo abrir ese respaldo: '+err.message)}
});
$('#clear').addEventListener('click',async()=>{if(!confirm('¿Descartar todos los cambios de este editor y volver a la versión publicada?'))return;localStorage.removeItem(projectBase);clearAssets();location.reload()});
async function fileToData(file){return new Promise((resolve,reject)=>{const fr=new FileReader();fr.onload=()=>{const im=new Image();im.onload=()=>{
 const canvas=document.createElement('canvas');const scale=Math.min(1,1800/Math.max(im.width,im.height));canvas.width=Math.round(im.width*scale);canvas.height=Math.round(im.height*scale);canvas.getContext('2d').drawImage(im,0,0,canvas.width,canvas.height);
 const usePNG=file.type==='image/png'&&file.size<1200000;const mime=usePNG?'image/png':'image/jpeg';resolve({data:canvas.toDataURL(mime,.83),ext:usePNG?'png':'jpg'})};im.onerror=()=>reject(Error('Imagen inválida'));im.src=String(fr.result)};fr.onerror=reject;fr.readAsDataURL(file)})}
$('#fileinput').addEventListener('change',async e=>{const file=e.target.files?.[0],target=imageTarget;e.target.value='';if(!file||!target)return;if(!['image/png','image/jpeg','image/webp'].includes(file.type)){alertMsg('Solo imágenes JPG, PNG o WebP');return}if(file.size>15*1024*1024){alertMsg('La imagen debe pesar menos de 15 MB');return}
 try{const {data,ext}=await fileToData(file);const path=`/media/visual/pyc-${Date.now()}-${Math.floor(Math.random()*1000)}.${ext}`;images[path]=data;saveAsset(path,data);
  modify(()=>{
   if(target.kind==='app')state.app[target.key]=path;
   if(target.kind==='section'){state.dis.secciones[selSection]??={};state.dis.secciones[selSection][target.key]=path}
   if(target.kind==='extra'){const x=state.dis.extras.find(x=>x.id===selSection);if(x)x[target.key]=path}
   if(target.kind==='galphoto'){if(state.gal.fotos[target.i])state.gal.fotos[target.i].imagen=path}
   if(target.kind==='galnew')state.gal.fotos.push({imagen:path,pie:'Foto de Punkies y Cerebro'});
  });renderProps();alertMsg('Imagen agregada. Se incluirá en el ZIP al publicar.')
 }catch(err){console.error(err);alertMsg('No se pudo procesar la imagen')}
});
// ZIP estándar sin dependencias externas. Compatible con Windows y GitHub.
const utf=s=>new TextEncoder().encode(s);
const write16=(a,p,v)=>{a[p]=v&255;a[p+1]=(v>>>8)&255};
const write32=(a,p,v)=>{write16(a,p,v);write16(a,p+2,v>>>16)};
const table=(()=>{let arr=new Uint32Array(256);for(let i=0;i<256;i++){let c=i;for(let j=0;j<8;j++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;arr[i]=c>>>0}return arr})();
function crc(b){let c=0xffffffff;for(const n of b)c=table[(c^n)&255]^(c>>>8);return(c^0xffffffff)>>>0}
function makeZIP(files){let position=0;const local=[],center=[];const now=new Date(),dosDate=((Math.max(1980,now.getFullYear())-1980)<<9)|((now.getMonth()+1)<<5)|now.getDate(),dosTime=(now.getHours()<<11)|(now.getMinutes()<<5)|(now.getSeconds()>>1);
 for(const [path,value] of files){const name=utf(path);const data=typeof value==='string'?utf(value):value;const check=crc(data);const h=new Uint8Array(30+name.length);write32(h,0,0x04034b50);write16(h,4,20);write16(h,6,0x0800);write16(h,8,0);write16(h,10,dosTime);write16(h,12,dosDate);write32(h,14,check);write32(h,18,data.length);write32(h,22,data.length);write16(h,26,name.length);h.set(name,30);local.push(h,data);
  const c=new Uint8Array(46+name.length);write32(c,0,0x02014b50);write16(c,4,20);write16(c,6,20);write16(c,8,0x0800);write16(c,10,0);write16(c,12,dosTime);write16(c,14,dosDate);write32(c,16,check);write32(c,20,data.length);write32(c,24,data.length);write16(c,28,name.length);write32(c,42,position);c.set(name,46);center.push(c);position+=h.length+data.length;
 }
 const cdlen=center.reduce((a,b)=>a+b.length,0),end=new Uint8Array(22);write32(end,0,0x06054b50);write16(end,8,center.length);write16(end,10,center.length);write32(end,12,cdlen);write32(end,16,position);return new Blob([...local,...center,end],{type:'application/zip'});
}
function fromBase64(uri){const base=uri.split(',')[1]||'',raw=atob(base),arr=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)arr[i]=raw.charCodeAt(i);return arr}
const mediaPaths=()=>{const seen=new Set();const walk=o=>{if(typeof o==='string'){if(/^\/?media\/visual\/[a-zA-Z0-9_.-]+$/.test(o))seen.add('/'+o.replace(/^\//,''));return}if(Array.isArray(o)){o.forEach(walk);return}if(o&&typeof o==='object')Object.values(o).forEach(walk)};walk(state.app);walk(state.gal);walk(state.dis);return [...seen]};
async function mediaAvailable(path){
 const uri=images[path];if(typeof uri==='string'&&/^data:image\/(png|jpeg|webp);base64,/.test(uri))return fromBase64(uri);
 try{const response=await fetch(path,{cache:'no-store'});if(response.ok&&response.headers.get('content-type')?.startsWith('image/'))return new Uint8Array(await response.arrayBuffer())}catch{}
 return null;
}
$('#export').addEventListener('click',async()=>{
 if(!Object.keys(state.site).length){alertMsg('Todavía no se cargaron los datos');return}
 const btn=$('#export');btn.disabled=true;btn.textContent='Comprobando fotografías...';
 try{
  const data=[];
  for(const [k,path] of [['site','content/site.json'],['app','content/apariencia.json'],['gal','content/galeria.json'],['dis','content/diseno.json']]){
   if(JSON.stringify(state[k])!==JSON.stringify(serverBaseline?.[k]))data.push([path,JSON.stringify(state[k],null,2)+'\n']);
  }
  const missing=[];let count=0;
  for(const path of mediaPaths()){
   const bytes=await mediaAvailable(path);
   if(!bytes){missing.push(path);continue}
   data.push([path.slice(1),bytes]);count++;
  }
  if(missing.length){alert('NO SE GENERÓ EL ZIP porque faltan '+missing.length+' fotografía(s).\n\n'+missing.join('\n')+'\n\nVuelve a subir esas imágenes en el editor y descarga de nuevo. Así evitamos publicar fotos rotas.');return}
  if(!data.length){alertMsg('No hay cambios para publicar.');return}
  data.push(['INSTRUCCIONES-PARA-SUBIR.txt',`PUNKIES Y CEREBRO — PUBLICACIÓN SIN FOTOS PERDIDAS\n\nCONTENIDO DEL ZIP: ${data.length} archivo(s) de datos o imágenes. Imágenes verificadas: ${count}.\n\n1. Descomprime este ZIP en tu computador.\n2. Abre https://github.com/punkiesycerebro/punkiesycerebro.github.io\n3. Add file → Upload files.\n4. Entra a la carpeta que acabas de descomprimir. Arrastra TODO su contenido a la raíz de GitHub, incluyendo las carpetas CONTENT y MEDIA. No subas el ZIP ni solo archivos sueltos.\n5. ANTES de hacer Commit changes, verifica que GitHub muestre las rutas media/visual/pyc-... y content/galeria.json. Si NO aparecen las fotos, cancela la operación.\n6. Confirma Commit changes, espera la publicación y actualiza la web con Ctrl+F5.\n\nLas fotos antiguas que ya estaban publicadas se incluyen para que el ZIP sea una entrega completa.\nSi editaste Pages CMS después de abrir este editor, primero respalda tu borrador y vuelve a cargar la versión publicada para no sobrescribir datos ajenos.\n`]);
  const zip=makeZIP(data),a=document.createElement('a'),url=URL.createObjectURL(zip);a.href=url;a.download='punkies-V6-publicar-con-fotos.zip';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),45000);
  alertMsg(`ZIP listo: ${count} imágenes comprobadas y archivos de configuración. Sube las carpetas content y media.`);
 }catch(e){console.error(e);alert('No se pudo preparar el ZIP. No se perdió el borrador. '+e.message)}finally{btn.disabled=false;btn.textContent='⬇ Comprobar fotos y descargar ZIP'}
});
async function start(){setStatus('Leyendo tu web...');assetsDb=await openDB();await restoreImages();
 const [site,app,gal,dis]=await Promise.all([
 fetchJson('content/site.json',null),fetchJson('content/apariencia.json',fallbackAppearance),fetchJson('content/galeria.json',{titulo:'GALERÍA',fotos:[]}),fetchJson('content/diseno.json',initial.dis)]);
 if(!site||typeof site!=='object'||!site.banda){T.innerHTML='<h2>No se encontraron los datos</h2><p class="note">Falta <code>content/site.json</code> en el repositorio. No edites hasta subir ese archivo.</p>';setStatus('Falta site.json');return}
 Object.assign(state,{site,app:{...fallbackAppearance,...(app||{})},gal:gal||{titulo:'GALERÍA',fotos:[]},dis:dis||clone(initial.dis)});
 state.dis.textos??={};state.dis.secciones??={};state.dis.extras??=[];state.dis.formato??={};state.dis.orden??=sections.slice();state.gal.fotos??=[];state.gal.modo??="cuadricula";state.gal.alto??=300;state.gal.columnas??=3;state.gal.espacio??=16;for(const foto of state.gal.fotos){foto.posX??=50;foto.posY??=50;foto.alto??=300;}serverBaseline=clone(state);
 const past=localStorage.getItem(projectBase);if(past){try{const remembered=JSON.parse(past);if(remembered?.state?.site?.banda){Object.assign(state,remembered.state);pending=true;setStatus('● Borrador local recuperado');alertMsg('Se recuperaron los cambios que dejaste en este navegador')}}catch{}}
 if(!pending)setStatus('✓ Lista para editar · sin publicar');renderProps();previewNow();
}
start().catch(e=>{console.error(e);T.textContent='No fue posible iniciar el editor. Actualiza la página.'});
})();

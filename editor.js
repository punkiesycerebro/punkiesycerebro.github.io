/* Editor visual de Punkies y Cerebro — sin tokens ni credenciales.
   Edición en vivo, borradores locales y exportación ZIP para GitHub Pages. */
(()=>{'use strict';
const $=s=>document.querySelector(s), T=$('#properties'), frame=$('#preview');
const sections=['inicio','musica','conciertos','historia','tienda','galeria','contacto'];
const names={inicio:'Portada',musica:'Música',conciertos:'Conciertos',historia:'Historia',tienda:'Tienda',galeria:'Galería',contacto:'Contacto'};
const fields=[
 ['banda','Nombre de la banda','#nombre-menu','site'],['subtitulo','Subtítulo de portada','#subtitulo','site'],
 ['album','Nombre del nuevo álbum','#album','site'],['descripcion','Descripción de portada','#descripcion','site'],
 ['acerca','Historia completa','#acerca','site'],['lema','Lema de la portada','.tagline','dis'],
 ['titular_musica','Título: Música','#musica>.section-head h2','dis'],['presentacion_musica','Texto: Música','#musica>.section-head+p','dis'],
 ['titular_streaming','Título: Plataformas musicales','.info-tile h3','dis'],
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
const state={site:{},app:{},dis:{},gal:{}};let tab='textos',selText='subtitulo',selSection='inicio',imageTarget=null,images={},pending=false,undo=[],toastTimeout=null,loaded=false;
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
 try{w.__visualImages=images;w.renderCMSContent?.(state.site);w.aplicarApariencia?.(state.app);w.actualizarGaleria?.(state.gal);w.aplicarDiseno?.(state.dis)}catch(e){console.error('vista previa',e);alertMsg('Espera un momento: la vista está actualizando')}
}
function fieldValue(f){return f[3]==='site'?state.site[f[0]]:state.dis.textos?.[f[0]]}
function selectTab(t){tab=t;$('#tabs').querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.tab===t));renderProps()}
function textBlock(f){const key=f[0],value=fieldValue(f)||'',multi=['acerca','descripcion','presentacion_musica','presentacion_conciertos','presentacion_tienda','presentacion_contacto'].includes(key);
 return `<div class="control"><label for="txt-${key}">${esc(f[1])}</label>${multi?`<textarea id="txt-${key}" rows="${key==='acerca'?9:3}" data-kind="text" data-key="${key}">${esc(value)}</textarea>`:`<input id="txt-${key}" type="text" data-kind="text" data-key="${key}" value="${attr(value)}">`}</div>`}
const selectHTML=(key,label,value,options,kind='app')=>`<div class="control"><label>${esc(label)}</label><select data-kind="${kind}" data-key="${key}">${options.map(([v,t])=>`<option value="${attr(v)}" ${value===v?'selected':''}>${esc(t)}</option>`).join('')}</select></div>`;
const colorHTML=(key,label,obj,kind='app')=>{const val=/^#[a-fA-F0-9]{6}$/.test(obj[key])?obj[key]:'#ffffff';return `<div class="control"><label>${esc(label)}</label><div class="color-row"><input aria-label="Elegir color" type="color" value="${val}" data-kind="${kind}" data-key="${key}"><input aria-label="Código hexadecimal" type="text" maxlength="7" value="${val}" data-kind="${kind}" data-key="${key}"></div></div>`};
const slider=(key,label,obj,min,max,step=1,kind='app')=>{const val=Number(obj[key])||min;return `<div class="control"><div class="slider-head"><label>${esc(label)}</label><output>${val}px</output></div><input type="range" min="${min}" max="${max}" step="${step}" value="${val}" data-kind="${kind}" data-key="${key}"></div>`};
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
   h=`<h2>Editar textos</h2><p class="note">Haz clic sobre un texto de la vista previa o selecciónalo aquí.</p>${selectHTML('field','Texto que quieres editar',selText,fields.map(x=>[x[0],x[1]]),'selection')}${textBlock(f)}${formatControls(selText)}<h3>Otros contenidos</h3><p class="note">Los conciertos, discos y productos continúan en Pages CMS; así conservamos las fichas y enlaces de la banda.</p><a class="action" style="text-decoration:none;display:inline-block" target="_blank" rel="noopener" href="https://app.pagescms.org/">Abrir Pages CMS ↗</a>`;
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
   h+=imageFields.map(([k,l])=>imgHTML(k,l,state.app)).join('');
 }else if(tab==='secciones'){
   const all=[...sections,...(state.dis.extras||[]).map(x=>x.id)];
   if(!all.includes(selSection))selSection='inicio';const sect=state.dis.secciones?.[selSection]||{},extra=(state.dis.extras||[]).find(x=>x.id===selSection);
   h='<h2>Secciones y distribución</h2><p class="note">Arrastra las filas o utiliza las flechas para cambiar el orden. Las secciones ocultas desaparecen de la web.</p>';
   h+=`<div class="ordered">${(state.dis.orden||all).filter(k=>all.includes(k)).map(id=>`<div class="row-ordered" draggable="true" data-drag="${id}"><span>${esc(names[id]||((state.dis.extras||[]).find(x=>x.id===id)?.titulo||'Sección nueva'))}</span><button title="Subir" data-move="${id}" data-dir="-1">↑</button><button title="Bajar" data-move="${id}" data-dir="1">↓</button><button title="Editar" data-section="${id}">✎</button></div>`).join('')}</div>`;
   h+=`<button class="big-action" id="add-section">＋ Añadir nueva sección</button><h3>Editar sección seleccionada</h3>${selectHTML('sec','Sección',selSection,all.map(id=>[id,names[id]||(state.dis.extras||[]).find(x=>x.id===id)?.titulo||id]),'selectSection')}`;
   h+=`<label class="control-check"><input type="checkbox" data-kind="section" data-key="oculta" ${sect.oculta===true?'checked':''}> Ocultar esta sección</label>`;
   if(selSection!=='inicio')h+=colorHTML('color','Color de fondo',sect,'section')+imgHTML('imagen','Imagen de fondo de sección',sect,'section');
   if(extra){h+=`<h3>Contenido del bloque añadido</h3>${['titulo','texto','boton','enlace'].map((k)=>`<div class="control"><label>${{titulo:'Título',texto:'Párrafo',boton:'Texto del botón',enlace:'Enlace HTTPS del botón'}[k]}</label>${k==='texto'?`<textarea data-kind="extra" data-key="${k}" rows="5">${esc(extra[k]||'')}</textarea>`:`<input type="text" value="${attr(extra[k]||'')}" data-kind="extra" data-key="${k}">`}</div>`).join('')}${imgHTML('imagen','Imagen del bloque',extra,'extra')}<button class="action danger" id="delete-extra">Eliminar sección nueva</button>`}
 }else if(tab==='galeria'){
   h='<h2>Galería fotográfica</h2><p class="note">Agrega fotos reales de la banda. Se verán en la galería después de publicar.</p>';
   h+=`<div class="control"><label>Título de la galería</label><input type="text" data-kind="gal" data-key="titulo" value="${attr(state.gal.titulo||'GALERÍA')}"></div><button id="add-photo" class="big-action">＋ Añadir fotografía</button>`;
   h+=(state.gal.fotos||[]).map((f,i)=>`<div class="img-item"><strong>Fotografía ${i+1}</strong>${f.imagen?`<img class="img-preview" src="${attr(images[f.imagen]||f.imagen)}" alt="Foto">`:''}<button type="button" class="file-btn" data-gallery-img="${i}">Cambiar fotografía</button><div class="control" style="margin-top:10px"><label>Descripción</label><input value="${attr(f.pie||'')}" type="text" data-gallery-caption="${i}"></div><button class="action danger" data-remove-photo="${i}">Eliminar</button></div>`).join('');
 }else if(tab==='enlaces'){
   h='<h2>Enlaces y contacto</h2><p class="note">Actualiza redes y correo. Se reflejarán en las secciones de música y contacto.</p>';
   h+=[['spotify','Spotify'],['youtube','YouTube'],['instagram','Instagram'],['facebook','Facebook'],['contacto','Correo de contacto']].map(([k,l])=>`<div class="control"><label>${l}</label><input type="text" data-kind="site" data-key="${k}" value="${attr(state.site[k]||'')}" placeholder="${k==='contacto'?'correo@ejemplo.com':'https://...'}"></div>`).join('');
 }
 T.innerHTML=h;
}
function currentField(k){return fields.find(f=>f[0]===k)}
function routeEvent(e){const target=e.target;const kind=target.dataset.kind,key=target.dataset.key;
 if(!kind)return;
 if(kind==='selection'){selText=target.value;renderProps();return}
 if(kind==='selectSection'){selSection=target.value;renderProps();return}
 if(kind==='text'){
  const f=currentField(key);if(!f)return;
  modify(()=>{if(f[3]==='site')state.site[key]=target.value;else state.dis.textos[key]=target.value});return
 }
 if(kind==='site'){persistControl(state.site,key,target.value);return}
 if(kind==='format'){
  let val=target.value;if(target.type==='range')val=Number(val);
  if(key==='color'&&target.type==='text'&&!/^#[0-9a-fA-F]{6}$/.test(val))return;
  modify(()=>{state.dis.formato??={};state.dis.formato[selText]??={};state.dis.formato[selText][key]=val});
  if(key==='color'&&target.type==='color')T.querySelectorAll('[data-kind="format"][data-key="color"][type="text"]').forEach(x=>x.value=val);
  if(target.type==='range')target.closest('.control').querySelector('output').textContent=val+'px';return;
 }

 if(kind==='gal'){persistControl(state.gal,key,target.value);return}
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
 if(b.dataset.format){modify(()=>{state.dis.formato??={};state.dis.formato[selText]??={};const obj=state.dis.formato[selText];obj[b.dataset.format]=!obj[b.dataset.format]});renderProps();return}
 if(b.id==='reset-format'){modify(()=>{if(state.dis.formato)delete state.dis.formato[selText]});renderProps();return}
 if(b.dataset.imgKind){imageTarget={kind:b.dataset.imgKind,key:b.dataset.imgKey};$('#fileinput').click();return}
 if(b.dataset.clearImg){const k=b.dataset.clearImg,kind=b.dataset.imgKind;modify(()=>{if(kind==='section'){state.dis.secciones[selSection]??={};state.dis.secciones[selSection][k]=''}else if(kind==='extra'){const x=state.dis.extras.find(x=>x.id===selSection);if(x)x[k]=''}else state.app[k]=''});renderProps();return}
 if(b.dataset.galleryImg!==undefined){imageTarget={kind:'galphoto',i:Number(b.dataset.galleryImg)};$('#fileinput').click();return}
 if(b.dataset.removePhoto!==undefined){modify(()=>state.gal.fotos.splice(Number(b.dataset.removePhoto),1));renderProps();return}
 if(b.dataset.section){selSection=b.dataset.section;renderProps();return}
 if(b.dataset.move){const i=state.dis.orden.indexOf(b.dataset.move),j=i+Number(b.dataset.dir);if(j>=0&&j<state.dis.orden.length)modify(()=>{const a=state.dis.orden;a.splice(j,0,a.splice(i,1)[0])});renderProps();return}
 if(b.id==='add-section'){if(state.dis.extras.length>=20){alertMsg('Máximo 20 secciones nuevas');return}
  let id='x'+String(Date.now()).slice(-11);while(state.dis.orden.includes(id))id='x'+String(Date.now()+Math.floor(Math.random()*1000)).slice(-11);
  modify(()=>{state.dis.extras.push({id,titulo:'Nueva sección',texto:'Escribe aquí el contenido de esta sección.',boton:'',enlace:'',imagen:''});state.dis.orden.push(id)});selSection=id;renderProps();return}
 if(b.id==='delete-extra'){modify(()=>{state.dis.extras=state.dis.extras.filter(x=>x.id!==selSection);state.dis.orden=state.dis.orden.filter(x=>x!==selSection);delete state.dis.secciones[selSection]});selSection='inicio';renderProps();return}
 if(b.id==='add-photo'){imageTarget={kind:'galnew'};$('#fileinput').click();return}
});
let dragId=null;
T.addEventListener('dragstart',e=>{const row=e.target.closest('[data-drag]');if(row){dragId=row.dataset.drag;e.dataTransfer.effectAllowed='move'}});
T.addEventListener('dragover',e=>{if(e.target.closest('[data-drag]'))e.preventDefault()});
T.addEventListener('drop',e=>{const row=e.target.closest('[data-drag]');if(!row||!dragId||row.dataset.drag===dragId)return;e.preventDefault();modify(()=>{const a=state.dis.orden,old=a.indexOf(dragId),idx=a.indexOf(row.dataset.drag);if(old<0||idx<0)return;a.splice(idx,0,a.splice(old,1)[0])});dragId=null;renderProps()});
$('#tabs').addEventListener('click',e=>{const b=e.target.closest('button[data-tab]');if(b)selectTab(b.dataset.tab)});
function hookPreview(){const doc=frame.contentDocument;if(!doc)return;
 let old=null;
 const style=doc.createElement('style');style.textContent='[data-editor-selected]{outline:3px solid #cfff80!important;outline-offset:3px!important} #subtitulo:hover,#album:hover,#descripcion:hover,#acerca:hover,.tagline:hover,.section-head h2:hover{outline:2px dashed #cfff8099;outline-offset:4px} a,button,[data-extra]{cursor:pointer!important} [contenteditable=true]{outline:3px solid #cfff80!important;background:#1b2716db!important;cursor:text!important}';doc.head.appendChild(style);
 doc.addEventListener('dblclick',e=>{
  const el=e.target;const f=fields.find(f=>el.closest(f[2]));if(!f)return;
  e.preventDefault();e.stopPropagation();const node=el.closest(f[2]);if(!node)return;
  node.setAttribute('contenteditable','true');node.setAttribute('spellcheck','true');node.focus();
  const selection=doc.getSelection(),range=doc.createRange();range.selectNodeContents(node);selection.removeAllRanges();selection.addRange(range);
  const update=()=>{node.removeEventListener('blur',update);node.removeAttribute('contenteditable');
   const val=node.textContent;if(f[3]==='site')modify(()=>state.site[f[0]]=val);else modify(()=>state.dis.textos[f[0]]=val);
   selText=f[0];selectTab('textos');alertMsg('Texto actualizado en el borrador');
  };node.addEventListener('blur',update,{once:true});
 },true);
 doc.addEventListener('click',e=>{
  e.preventDefault();e.stopPropagation();const el=e.target;
  const matching=fields.find(f=>el.closest(f[2]));
  if(old)old.removeAttribute('data-editor-selected');
  if(matching){selText=matching[0];selectTab('textos');old=el.closest(matching[2]);old?.setAttribute('data-editor-selected','true');alertMsg('Seleccionado: '+matching[1]);return}
  const image=el.closest('#logo-portada-img,#logo-menu-img,#imagen-disco-img');if(image){selectTab('imagenes');old=image;old.setAttribute('data-editor-selected','true');return}
  const sect=el.closest('main section');if(sect){selSection=sect.id;selectTab('secciones');old=sect;old.setAttribute('data-editor-selected','true');return}
  alertMsg('Selecciona un título, un texto o una sección');
 },true);
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
$('#export').addEventListener('click',()=>{if(!Object.keys(state.site).length){alertMsg('Todavía no se cargaron los datos');return}
 const data=[];
 for(const [k,p] of [['site','content/site.json'],['app','content/apariencia.json'],['gal','content/galeria.json'],['dis','content/diseno.json']]){
  if(JSON.stringify(state[k])!==JSON.stringify(serverBaseline?.[k]))data.push([p,JSON.stringify(state[k],null,2)+'\n']);
 }
 if(!data.length){alertMsg('No hay cambios para publicar. Modifica algo primero.');return}

 let count=0;for(const [path,uri] of Object.entries(images)){if(!path.startsWith('/media/visual/')||!uri.startsWith('data:image/'))continue;data.push([path.slice(1),fromBase64(uri)]);count++}
 data.push(['LEEME-PARA-PUBLICAR.txt',`PUNKIES Y CEREBRO — CÓMO PUBLICAR LOS CAMBIOS\n\n1. Descomprime este ZIP en tu computador.\n2. Abre https://github.com/punkiesycerebro/punkiesycerebro.github.io\n3. Add file > Upload files.\n4. ARRASTRA LAS CARPETAS content y media (si existe), NO la carpeta exterior.\n5. Verifica rutas content/site.json, content/apariencia.json, content/diseno.json, content/galeria.json.\n6. Pulsa Commit changes y espera unos minutos.\n7. Actualiza https://punkiesycerebro.github.io con Ctrl+F5.\n\nAVISO: Esta exportación conserva los datos leídos al abrir el editor. Si cambiaste algo en Pages CMS después, recarga el editor primero para no sobrescribir esos cambios.\nNo subas este archivo de instrucciones si no quieres; es solo una guía.\n\nImágenes nuevas: ${count}.\n`]);
 const zip=makeZIP(data),a=document.createElement('a'),url=URL.createObjectURL(zip);a.href=url;a.download='punkies-cambios-visuales.zip';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),45000);alertMsg('ZIP descargado. Descomprímelo y súbelo a GitHub para publicar.');
});
async function start(){setStatus('Leyendo tu web...');assetsDb=await openDB();await restoreImages();
 const [site,app,gal,dis]=await Promise.all([
 fetchJson('content/site.json',null),fetchJson('content/apariencia.json',fallbackAppearance),fetchJson('content/galeria.json',{titulo:'GALERÍA',fotos:[]}),fetchJson('content/diseno.json',initial.dis)]);
 if(!site||typeof site!=='object'||!site.banda){T.innerHTML='<h2>No se encontraron los datos</h2><p class="note">Falta <code>content/site.json</code> en el repositorio. No edites hasta subir ese archivo.</p>';setStatus('Falta site.json');return}
 Object.assign(state,{site,app:{...fallbackAppearance,...(app||{})},gal:gal||{titulo:'GALERÍA',fotos:[]},dis:dis||clone(initial.dis)});
 state.dis.textos??={};state.dis.secciones??={};state.dis.extras??=[];state.dis.formato??={};state.dis.orden??=sections.slice();state.gal.fotos??=[];serverBaseline=clone(state);
 const past=localStorage.getItem(projectBase);if(past){try{const remembered=JSON.parse(past);if(remembered?.state?.site?.banda){Object.assign(state,remembered.state);pending=true;setStatus('● Borrador local recuperado');alertMsg('Se recuperaron los cambios que dejaste en este navegador')}}catch{}}
 if(!pending)setStatus('✓ Lista para editar · sin publicar');renderProps();previewNow();
}
start().catch(e=>{console.error(e);T.textContent='No fue posible iniciar el editor. Actualiza la página.'});
})();

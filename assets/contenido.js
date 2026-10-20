/* Contenido oficial desde content/site.json y formulario AJAX existente. */
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const set=(id,v)=>{const e=document.getElementById(id);if(e&&v!=null)e.textContent=v};
const socialPaths={
 Instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".7" fill="currentColor" stroke="none"/>',
 YouTube:'<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z"/>',
 Facebook:'<path d="M15 21v-8h3l.5-4H15V7c0-1 .5-1.5 2-1.5h2V2.2A20 20 0 0 0 16 2c-3 0-5 2-5 5v2H8v4h3v8z"/>',
 Spotify:'<circle cx="12" cy="12" r="10"/><path d="M5 9c5-2 10-1.7 14 1M6 12c4-1.5 8.6-1 12 1M7 15c3-1 6-.8 9 .6"/>'
};
const iconFor=(label)=>socialPaths[label]?`<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" style="vertical-align:middle;margin-right:7px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round">${socialPaths[label]}</svg>`:'';
const button=(url,label)=>{try{const u=new URL(url);return ['https:','mailto:'].includes(u.protocol)?`<a class="btn secondary" href="${safe(u.href)}" target="_blank" rel="noopener noreferrer">${iconFor(label)}${safe(label)} ↗</a>`:''}catch{return ''}};

/* V6.1 — íconos sociales en el encabezado usando los enlaces existentes del CMS. */
const socialHeaderOptions=[['spotify','Spotify'],['youtube','YouTube'],['instagram','Instagram'],['facebook','Facebook']];
let lastSocialData={};
const secureSocialUrl=v=>{try{const u=new URL(String(v||''));return u.protocol==='https:'?u.href:null}catch{return null}};
window.renderHeaderSocials=function(d){
  lastSocialData=d||{};
  const host=document.getElementById('header-socials');if(!host)return;
  const cfg=window.__pycHeaderSocialConfig||{};
  host.replaceChildren();
  if(cfg.mostrar===false)return;
  const color=/^#[0-9a-fA-F]{6}$/.test(cfg.color||'')?cfg.color:'#FFFFFF';
  const size=Math.max(16,Math.min(38,Number(cfg.tamano)||22));
  host.style.setProperty('--social-color',color);host.style.setProperty('--social-size',size+'px');
  for(const [field,label] of socialHeaderOptions){
    if(cfg['mostrar_'+field]===false)continue;
    const url=secureSocialUrl(lastSocialData[field]);if(!url)continue;
    const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';
    a.setAttribute('aria-label','Abrir '+label+' de Punkies y Cerebro');a.title=label;
    a.innerHTML=iconFor(label);const caption=document.createElement('span');caption.textContent=label;a.append(caption);host.append(a);
  }
};
window.configurarHeaderSocials=function(cfg){window.__pycHeaderSocialConfig=cfg||{};window.renderHeaderSocials(lastSocialData)};

window.renderCMSContent=function(d){
 set('nombre-menu',d.banda);set('subtitulo',d.subtitulo);set('album',d.album);set('album-music',d.album);set('descripcion',d.descripcion);set('acerca',d.acerca);
 window.renderHeaderSocials(d);
 document.getElementById('musicLinks').innerHTML=button(d.spotify,'Spotify')+button(d.youtube,'YouTube');
 document.getElementById('contactLinks').innerHTML=button(d.instagram,'Instagram')+button(d.facebook,'Facebook')+(d.contacto?button('mailto:'+d.contacto,'Escríbenos'):'');
 const form=document.getElementById('formulario-contacto'),status=document.getElementById('form-alert');
 const destino=String(d.correo_formulario||d.contacto||'').trim();
 const validEmail=e=>/^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(e);
 const copias=[...new Set(String(d.copias_formulario||'').split(/[\s,;]+/).map(e=>e.trim()).filter(e=>validEmail(e)&&e.toLowerCase()!==destino.toLowerCase()))].slice(0,20);
 if(form && status){
  const submit=form.querySelector('button[type="submit"]');
  if(validEmail(destino)){
   form.action='https://formsubmit.co/'+encodeURIComponent(destino);
   form.dataset.destino=destino;
   const cc=form.querySelector('[name="_cc"]');if(cc)cc.value=copias.join(',');
   const next=document.getElementById('form-next-url');if(next)next.value=new URL('gracias.html',window.location.href).href;
   // No anunciar éxito antes de que FormSubmit acepte la petición.
   if(status.dataset.state!=='success'&&status.dataset.state!=='error'){
     status.dataset.state='hint';status.textContent='Tus datos se utilizarán para responder a tu mensaje.';
   }
   submit.disabled=false;
  }else{
   form.removeAttribute('action');delete form.dataset.destino;
   status.dataset.state='error';status.textContent='Formulario pendiente de configurar: el administrador debe definir un correo principal válido.';
   submit.disabled=true;
  }
 }
 const gigs=(d.conciertos||[]).map(c=>`<div class="item"><strong>${safe(c.fecha)} · ${safe(c.ciudad)}</strong><span>${safe(c.lugar)}</span>${button(c.entradas,'Entradas')}</div>`).join('');
 document.getElementById('conciertos-lista').innerHTML=gigs||'<div class="empty">Próximas fechas por anunciar.</div>';
 document.getElementById('discos').innerHTML=(d.discos||[]).map(c=>`<div class="item"><strong>${safe(c.titulo)}</strong><span>${safe(c.anio)}</span></div>`).join('');
 const merch=(d.tienda||[]).map(c=>`<div class="item"><strong>${safe(c.producto)}</strong><span>${safe(c.precio)}</span>${button(c.enlace,'Ver producto')}</div>`).join('');
 document.getElementById('tienda-lista').innerHTML=merch||'<div class="empty">Estamos preparando el lanzamiento de nuestros productos.</div>';
};
fetch('content/site.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('No se encontró content/site.json');return r.json()}).then(window.renderCMSContent).catch(err=>console.error('Error cargando contenido:',err));

/* Envío AJAX: mantiene a la persona en nuestra página (sin redirección). */
let enviandoContacto=false;
let ultimoEnvio=0;
const contactStatus=(msg,type)=>{const el=document.getElementById('form-alert');if(el){el.textContent=msg;el.dataset.state=type;el.setAttribute('role',type==='error'?'alert':'status')}};
document.getElementById('formulario-contacto')?.addEventListener('submit',async event=>{
 event.preventDefault();
 const form=event.currentTarget;
 const button=form.querySelector('button[type="submit"]');
 const destino=form.dataset.destino;
 if(location.search.includes('editor=1')){
  contactStatus('Esta es la vista previa. Para probar el envío real, abre la página pública.','hint');return;
 }
 if(!destino){contactStatus('El formulario todavía no tiene configurado un correo receptor.','error');return}
 if(!form.reportValidity())return;
 if(enviandoContacto)return;
 if(Date.now()-ultimoEnvio<10000){contactStatus('Espera unos segundos antes de enviar otro mensaje.','error');return}
 const honey=form.elements.namedItem('_honey');
 if(honey?.value){contactStatus('No pudimos verificar tu envío. Actualiza la página e inténtalo nuevamente.','error');return}
 enviandoContacto=true;button.disabled=true;
 const btnText=button.textContent;
 button.textContent='ENVIANDO MENSAJE…';contactStatus('Enviando tu mensaje, espera un momento…','loading');
 const payload={
  name:String(form.elements.namedItem('name').value||'').trim(),
  email:String(form.elements.namedItem('email').value||'').trim(),
  asunto:String(form.elements.namedItem('asunto').value||'').trim(),
  mensaje:String(form.elements.namedItem('mensaje').value||'').trim(),
  _subject:'Nuevo mensaje a Punkies y Cerebro: '+String(form.elements.namedItem('asunto').value||'Contacto').trim().slice(0,100),
  _cc:String(form.elements.namedItem('_cc')?.value||''),
  _captcha:'false',
  _honey:'',
  _template:'table',
  _url:window.location.href
 };
 try{
  const response=await fetch('https://formsubmit.co/ajax/'+encodeURIComponent(destino),{
   method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},
   body:JSON.stringify(payload),mode:'cors'
  });
  let result={};try{result=await response.json()}catch{}
  const ok=response.ok && (result.success===true||result.success==='true');
  if(!ok)throw new Error(String(result.message||'El servicio no confirmó el envío.'));
  ultimoEnvio=Date.now();
  for(const field of ['name','email','asunto','mensaje'])form.elements.namedItem(field).value='';
  contactStatus('✓ ¡Mensaje enviado correctamente! Gracias por escribirnos. Pronto nos pondremos en contacto contigo.','success');
 }catch(error){
  console.error('No fue posible enviar el mensaje',error);
  contactStatus('No se pudo enviar el mensaje en este momento. Revisa tu conexión e inténtalo de nuevo; tus datos siguen aquí.','error');
 }finally{enviandoContacto=false;button.disabled=false;button.textContent=btnText}
});

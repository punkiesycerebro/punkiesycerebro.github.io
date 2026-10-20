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

/* Envío AJAX sin navegación. Un error conserva todos los campos. */
let enviandoContacto = false;
let ultimoEnvio = 0;

function contactStatus(message, type) {
  const status = document.getElementById('form-alert');
  if (!status) return;
  status.textContent = message;
  status.dataset.state = type;
  status.setAttribute('role', type === 'error' ? 'alert' : 'status');
  const recipient = document.getElementById('formulario-contacto')?.dataset.destino;
  if (type === 'error' && recipient) {
    const alternative = document.createElement('a');
    alternative.href = 'mailto:' + recipient;
    alternative.textContent = 'También puedes escribirnos a ' + recipient + '.';
    alternative.style.display = 'block';
    alternative.style.textDecoration = 'underline';
    status.append(document.createTextNode(' '), alternative);
  }
}

function contactFailure(response, result) {
  const detail = typeof result?.message === 'string' ? result.message.trim().slice(0, 350) : '';
  // Activation responses must never be announced as delivery, even with success:true.
  if (/(?:activat|confirm (?:your |the )?email|check (?:your )?(?:email|inbox))/i.test(detail)) {
    return 'El servicio indica que falta activar el formulario. La banda debe confirmar el correo de FormSubmit en su buzón. Tus datos siguen aquí.';
  }
  if (response.status === 429) return 'El servicio ha limitado temporalmente los envíos. Espera unos minutos antes de volver a intentarlo; tus datos siguen aquí.';
  if (response.status >= 500) return 'El servicio de correo no está disponible temporalmente. No hemos recibido confirmación del envío; tus datos siguen aquí.';
  if (!response.ok || !(result?.success === true || result?.success === 'true')) {
    return detail
      ? 'El servicio no confirmó el envío. Respuesta: ' + detail + ' Tus datos siguen aquí.'
      : 'El servicio devolvió una respuesta que no confirma el envío. Tus datos siguen aquí.';
  }
  return null;
}

document.getElementById('formulario-contacto')?.addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const submit = form.querySelector('button[type="submit"]');
  const recipient = form.dataset.destino;
  if (new URLSearchParams(location.search).get('editor') === '1') {
    contactStatus('Esta es una vista previa. El envío está desactivado.', 'hint');
    return;
  }
  if (!recipient) {
    contactStatus('El formulario todavía no tiene configurado un correo receptor.', 'error');
    return;
  }
  if (!form.reportValidity() || enviandoContacto) return;
  if (Date.now() - ultimoEnvio < 10000) {
    contactStatus('Espera unos segundos antes de enviar otro mensaje.', 'error');
    return;
  }
  if (form.elements.namedItem('_honey')?.value) {
    contactStatus('No pudimos verificar tu envío. Actualiza la página e inténtalo nuevamente.', 'error');
    return;
  }
  const field = name => String(form.elements.namedItem(name)?.value || '').trim();
  const payload = new URLSearchParams({
    name: field('name'),
    email: field('email'),
    asunto: field('asunto'),
    mensaje: field('mensaje'),
    _subject: 'Nuevo mensaje a Punkies y Cerebro: ' + field('asunto').slice(0, 100),
    _captcha: 'false',
    _template: 'table',
    _url: location.origin + location.pathname
  });
  // Only send optional recipients when configured, never an empty email address.
  const copies = field('_cc');
  if (copies) payload.set('_cc', copies);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  const originalLabel = submit.textContent;
  enviandoContacto = true;
  submit.disabled = true;
  form.setAttribute('aria-busy', 'true');
  submit.textContent = 'ENVIANDO MENSAJE…';
  contactStatus('Enviando tu mensaje…', 'loading');
  try {
    // Standard form encoding avoids the JSON request's extra CORS preflight.
    const response = await fetch('https://formsubmit.co/ajax/' + encodeURIComponent(recipient), {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: payload,
      mode: 'cors',
      signal: controller.signal
    });
    let result = null;
    try { result = await response.json(); } catch (error) {
      if (error.name === 'AbortError') throw error;
    }
    const failure = contactFailure(response, result);
    if (failure) {
      contactStatus(failure, 'error');
      return;
    }
    ultimoEnvio = Date.now();
    for (const name of ['name', 'email', 'asunto', 'mensaje']) form.elements.namedItem(name).value = '';
    contactStatus('El servicio aceptó tu mensaje. Gracias por escribirnos.', 'success');
  } catch (error) {
    const message = error.name === 'AbortError'
      ? 'No recibimos confirmación a tiempo. El envío podría haberse procesado; revisa antes de repetirlo. Tus datos siguen aquí.'
      : 'No pudimos confirmar el envío con el servicio de correo. Puede ser un problema de conexión o un bloqueo del servicio. Tus datos siguen aquí.';
    contactStatus(message, 'error');
  } finally {
    clearTimeout(timeout);
    enviandoContacto = false;
    submit.disabled = false;
    submit.textContent = originalLabel;
    form.removeAttribute('aria-busy');
  }
});

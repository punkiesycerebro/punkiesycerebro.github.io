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
  const web3=d.servicio_formulario==='web3forms';
  const accessKey=String(d.web3forms_access_key||'').trim();
  const validKey=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(accessKey);
  if(validEmail(destino)&&(!web3||validKey)){
   form.action=web3?'https://api.web3forms.com/submit':'https://formsubmit.co/'+encodeURIComponent(destino);
   form.dataset.destino=destino;
   form.dataset.servicio=web3?'web3forms':'formsubmit';
   form.dataset.accessKey=web3?accessKey:'';
   const cc=form.querySelector('[name="_cc"]');if(cc)cc.value=copias.join(',');
   const next=document.getElementById('form-next-url');if(next)next.value=new URL('gracias.html',window.location.href).href;
   // No anunciar éxito antes de que el servicio acepte la petición.
   if(status.dataset.state!=='success'&&status.dataset.state!=='error'){
     status.dataset.state='hint';status.textContent='Tus datos se utilizarán para responder a tu mensaje.';
   }
   submit.disabled=false;
  }else{
   form.removeAttribute('action');delete form.dataset.destino;
   status.dataset.state='error';status.textContent='Formulario pendiente de configurar: el administrador debe revisar el destinatario y la conexión con el servicio de correo.';
   submit.disabled=true;
  }
 }
 const dateKey=c=>/^\d{4}-\d{2}-\d{2}$/.test(c.fecha_iso||'')?c.fecha_iso:'9999-99-99';
 const ticketPrice=value=>Number.isSafeInteger(value)&&value>0?'$'+new Intl.NumberFormat('es-CO').format(value):'';
 const gigs=(Array.isArray(d.conciertos)?d.conciertos:[]).filter(c=>c&&typeof c==='object').slice().sort((a,b)=>dateKey(a).localeCompare(dateKey(b))).map(c=>{
  const date=dateKey(c),months=['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
  const month=months[Number(date.slice(5,7))-1];
  const badge=month?`<time class="show-date" datetime="${safe(date)}"><span>${month}</span><strong>${safe(date.slice(8))}</strong><span>${safe(date.slice(0,4))}</span></time>`:'';
  const prices=[ticketPrice(c.preventa)?`<span>Preventa: <strong>${ticketPrice(c.preventa)}</strong></span>`:'',ticketPrice(c.precio_dia)?`<span>Día del evento: <strong>${ticketPrice(c.precio_dia)}</strong></span>`:''].join('');
  return `<article class="show-card">${badge}<div class="show-info">${c.titulo?`<p class="show-eyebrow">Una noche de punk rock en ${safe(c.ciudad)}</p><h3>${safe(c.titulo)}</h3>`:''}${c.detalle?`<p class="show-detail">${safe(c.detalle)}</p>`:''}<p class="show-venue"><strong>${safe(c.lugar)}</strong>${c.direccion?`<br>${safe(c.direccion)}`:''}${c.ciudad?` · ${safe(c.ciudad)}`:''}</p><p>${safe(c.fecha)}${c.puertas?`<br>Apertura de puertas: <strong>${safe(c.puertas)}</strong>`:''}</p>${prices?`<div class="show-prices">${prices}</div>`:''}${c.descripcion?`<p>${safe(c.descripcion)}</p>`:''}<div class="buttons">${button(c.ubicacion,'Ver ubicación')}${button(c.entradas,'Entradas')}</div></div></article>`;
 }).join('');
 document.getElementById('conciertos-lista').innerHTML=gigs+'<p class="empty">Próximas fechas por anunciar.</p>';
 document.getElementById('discos').innerHTML=(Array.isArray(d.discos)?d.discos:[]).map(c=>{
  let image='';
  try { if(c.imagen){const url=new URL(c.imagen,location.href);if(url.origin===location.origin||url.protocol==='https:')image=`<img src="${safe(url.href)}" alt="Carátula de ${safe(c.titulo)}" loading="lazy">`;} } catch {}
  const cover=image||'<div class="discography-placeholder"><strong>DEMO</strong><span>Carátula pendiente</span></div>';
  const action=c.tipo==='proximamente'?'<p class="discography-soon">PRÓXIMAMENTE</p>':button(c.enlace,c.tipo==='spotify'?'Escuchar en Spotify':'Descargar');
  return `<article class="discography-card">${cover}<div class="discography-info"><p class="discography-year">${safe(c.anio)}</p><h4>${safe(c.titulo)}</h4>${action}</div></article>`;
 }).join('');
 window.renderShop?.(d.tienda||[],d.tienda_jimmy||[]);
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
    const form = document.getElementById('formulario-contacto');
    const field = name => String(form.elements.namedItem(name)?.value || '').trim();
    const subject = field('asunto') || 'Contacto con Punkies y Cerebro';
    const body = 'Nombre: ' + field('name') + '\nCorreo: ' + field('email') + '\nAsunto: ' + subject + '\n\n' + field('mensaje');
    const note = document.createElement('p');
    note.textContent = 'Puedes abrir tu mensaje completo en WhatsApp o en tu aplicación de correo y enviarlo desde allí. Si ya llegó el primer envío, no lo repitas.';
    status.append(note);
    const whatsapp = document.createElement('a');
    whatsapp.href = 'https://wa.me/573045377640?text=' + encodeURIComponent(body);
    whatsapp.target = '_blank';
    whatsapp.rel = 'noopener noreferrer';
    whatsapp.textContent = 'Abrir mensaje en WhatsApp ↗';
    whatsapp.style.display = 'block';
    whatsapp.style.textDecoration = 'underline';
    const alternative = document.createElement('a');
    alternative.href = 'mailto:' + recipient + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    alternative.textContent = 'Abrir mensaje en el correo para ' + recipient + ' ↗';
    alternative.style.display = 'block';
    alternative.style.textDecoration = 'underline';
    status.append(whatsapp, alternative);
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
  const web3 = form.dataset.servicio === 'web3forms';
  const endpoint = web3 ? 'https://api.web3forms.com/submit' : 'https://formsubmit.co/ajax/' + encodeURIComponent(recipient);
  const body = web3 ? JSON.stringify({
    access_key: form.dataset.accessKey,
    name: field('name'),
    email: field('email'),
    subject: 'Nuevo mensaje a Punkies y Cerebro: ' + field('asunto').slice(0, 100),
    asunto: field('asunto'),
    message: field('mensaje'),
    from_name: 'Punkies y Cerebro',
    botcheck: false
  }) : payload;
  const controller = new AbortController();
  // Delivery can precede the provider's acknowledgement. Do not treat a slow
  // acknowledgement as a failed delivery or invite an immediate second send.
  const slowNotice = setTimeout(() => {
    contactStatus('El servicio está tardando en confirmar. El mensaje podría haber llegado; espera sin volver a enviarlo.', 'loading');
  }, 20000);
  const timeout = setTimeout(() => controller.abort(), 60000);
  const originalLabel = submit.textContent;
  enviandoContacto = true;
  submit.disabled = true;
  form.setAttribute('aria-busy', 'true');
  submit.textContent = 'ENVIANDO MENSAJE…';
  contactStatus('Enviando tu mensaje…', 'loading');
  try {
    // Each provider uses its documented encoding; neither navigates away.
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: web3 ? { Accept: 'application/json', 'Content-Type': 'application/json' } : { Accept: 'application/json' },
      body,
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
    clearTimeout(slowNotice);
    clearTimeout(timeout);
    enviandoContacto = false;
    submit.disabled = false;
    submit.textContent = originalLabel;
    form.removeAttribute('aria-busy');
  }
});

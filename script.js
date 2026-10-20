/* Datos de la banda editables desde Pages CMS y desde el editor visual */
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const set=(id,v)=>{const e=document.getElementById(id);if(e&&v!=null)e.textContent=v};
const button=(url,label)=>{try{const u=new URL(url);return ['https:','mailto:'].includes(u.protocol)?`<a class="btn secondary" href="${safe(u.href)}" target="_blank" rel="noopener noreferrer">${safe(label)} ↗</a>`:''}catch{return ''}};
window.renderCMSContent=function(d){
 set('nombre-menu',d.banda);set('subtitulo',d.subtitulo);set('album',d.album);set('album-music',d.album);set('descripcion',d.descripcion);set('acerca',d.acerca);
 document.getElementById('musicLinks').innerHTML=button(d.spotify,'Spotify')+button(d.youtube,'YouTube');
 document.getElementById('contactLinks').innerHTML=button(d.instagram,'Instagram')+button(d.facebook,'Facebook')+(d.contacto?button('mailto:'+d.contacto,'Escríbenos'):'');
 const form=document.getElementById('formulario-contacto'),status=document.getElementById('form-alert');
 const destino=String(d.correo_formulario||d.contacto||'').trim();
 if(form && status){
  if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(destino)){form.action='https://formsubmit.co/'+encodeURIComponent(destino);status.textContent='Tus datos se utilizarán para responder a tu mensaje.';form.querySelector('button[type="submit"]').disabled=false;}
  else{form.removeAttribute('action');status.textContent='Formulario pendiente de configurar: define el correo de destino desde el editor visual.';form.querySelector('button[type="submit"]').disabled=true;}
 }
 const gigs=(d.conciertos||[]).map(c=>`<div class="item"><strong>${safe(c.fecha)} · ${safe(c.ciudad)}</strong><span>${safe(c.lugar)}</span>${button(c.entradas,'Entradas')}</div>`).join('');
 document.getElementById('conciertos-lista').innerHTML=gigs||'<div class="empty">Próximas fechas por anunciar.</div>';
 document.getElementById('discos').innerHTML=(d.discos||[]).map(c=>`<div class="item"><strong>${safe(c.titulo)}</strong><span>${safe(c.anio)}</span></div>`).join('');
 const merch=(d.tienda||[]).map(c=>`<div class="item"><strong>${safe(c.producto)}</strong><span>${safe(c.precio)}</span>${button(c.enlace,'Ver producto')}</div>`).join('');
 document.getElementById('tienda-lista').innerHTML=merch||'<div class="empty">Estamos preparando el lanzamiento de nuestros productos.</div>';
};
fetch('content/site.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('No se encontró content/site.json');return r.json()}).then(window.renderCMSContent).catch(err=>console.error('Error cargando contenido:',err));

// Evita enviar mensajes si no se ha definido un correo de destino.
document.getElementById('formulario-contacto')?.addEventListener('submit',ev=>{if(!ev.currentTarget.action||!ev.currentTarget.action.startsWith('https://formsubmit.co/')){ev.preventDefault();alert('Configura primero el correo receptor desde el editor visual.');}});

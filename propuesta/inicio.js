'use strict';
// Enlaces oficiales de content/site.json. Sin dependencia del editor visual.
const channels = [
  {name:'Spotify', url:'https://open.spotify.com/intl-es/artist/6Nq4YQd4JdWvtY3HrgvYK7?si=0Z-3gbdGTiKYVMgGFDeRvQ', path:'M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm5.5 17.3a.8.8 0 0 1-1.1.3c-3-1.8-6.7-2.2-11.1-1.2a.8.8 0 0 1-.4-1.5c4.8-1.1 8.9-.6 12.3 1.4.4.2.5.7.3 1zm1.5-3.2a1 1 0 0 1-1.4.3c-3.4-2.1-8.5-2.7-12.4-1.5a1 1 0 1 1-.6-1.8c4.5-1.4 10.1-.7 14 1.7.5.3.7.9.4 1.3zm.1-3.4C15.1 8.3 8.5 8 4.7 9.2a1.2 1.2 0 1 1-.7-2.3c4.4-1.3 11.6-1.1 16.3 1.7a1.2 1.2 0 0 1-1.2 2.1z'},
  {name:'YouTube',url:'https://www.youtube.com/@punkiesycerebro',path:'M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 32 32 0 0 0 0 12a32 32 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A32 32 0 0 0 24 12a32 32 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6z'},
  {name:'Instagram',url:'https://www.instagram.com/punkiesycerebro',path:'M7 0h10a7 7 0 0 1 7 7v10a7 7 0 0 1-7 7H7a7 7 0 0 1-7-7V7a7 7 0 0 1 7-7zm0 2a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5zm5 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm0 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm6.5-4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z'},
  {name:'Facebook',url:'https://www.facebook.com/punkiesycerebro',path:'M24 12a12 12 0 1 0-13.9 11.9v-8.4h-3V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-1.9.9-1.9 1.9V12h3.3l-.5 3.5h-2.8v8.4A12 12 0 0 0 24 12z'}
];
for (const host of document.querySelectorAll('[data-socials]')) {
  for (const channel of host.dataset.socials === 'music' ? channels.slice(0,2) : channels) {
    const link=document.createElement('a'); link.className='social-link';link.href=channel.url;link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label',`${channel.name} de Punkies y Cerebro (abre otra pestaña)`);
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');
    const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',channel.path);svg.append(path);link.append(svg,document.createTextNode(channel.name));host.append(link);
  }
}
const toggle=document.querySelector('.menu-toggle');
const menu=document.getElementById('menu');
function closeMenu(){menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));menu.classList.toggle('open',open);});
menu.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.classList.contains('open')){closeMenu();toggle.focus();}});
matchMedia('(min-width: 761px)').addEventListener('change',closeMenu);

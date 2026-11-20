'use strict';

// GA4 de la banda. El contador público sigue funcionando por separado.
(() => {
  const measurementId = 'G-X3D4L0VJWZ';
  if (!['punkiesycerebro.com', 'www.punkiesycerebro.com'].includes(location.hostname)) return;
  if (new URLSearchParams(location.search).get('editor') === '1') return;
  if (navigator.globalPrivacyControl === true || navigator.doNotTrack === '1') return;
  if (window.__pycAnalyticsStarted) return;
  window.__pycAnalyticsStarted = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  const pageLocation = location.origin + location.pathname;
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    page_location: pageLocation,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });

  const tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
  document.head.append(tag);

  const placement = link => {
    if (link.closest('.header-actions')) return 'encabezado';
    if (link.closest('#cart-dialog')) return 'carrito';
    if (link.closest('#epk')) return 'epk';
    if (link.closest('#contacto')) return 'contacto';
    if (link.closest('#conciertos')) return 'conciertos';
    if (link.closest('#musica')) return 'musica';
    return 'otro';
  };

  // Solo nombres y categorías fijas: no se leen formularios, mensajes ni carritos.
  document.addEventListener('click', event => {
    const link = event.target?.closest?.('a[href]');
    if (!link) return;
    try {
      const url = new URL(link.href, location.href);
      if (url.protocol !== 'https:') return;
      let eventName;
      const params = { link_location: placement(link), page_location: pageLocation };
      if (url.hostname === 'open.spotify.com') {
        eventName = 'spotify_click';
      } else if (url.origin === location.origin && url.pathname === '/media/prensa/punkies-y-cerebro-epk.pdf') {
        eventName = 'epk_download_click';
      } else if (url.hostname === 'wa.me' || url.hostname === 'api.whatsapp.com' || url.hostname === 'web.whatsapp.com') {
        eventName = 'whatsapp_click';
        params.contact_type = link.id === 'cart-checkout' ? 'pedido_punkies'
          : link.id === 'cart-checkout-jimmy' ? 'pedido_jimmy'
          : link.closest('#conciertos') ? 'reserva' : 'contratacion';
      } else if (url.hostname === 'checkout.wompi.co' && link.classList.contains('support-button')) {
        eventName = 'support_click';
      }
      if (eventName) window.gtag('event', eventName, params);
    } catch {
      // Un fallo de medición nunca impide abrir el enlace.
    }
  });
})();

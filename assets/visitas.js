'use strict';

// A shared, public page-load counter. Never use a local number as a global total.
(async () => {
  const count = document.getElementById('visit-count');
  const note = document.getElementById('visit-count-note');
  if (!count || !note || count.dataset.requested) return;
  const production = ['punkiesycerebro.com', 'www.punkiesycerebro.com'].includes(location.hostname);
  if (!production || new URLSearchParams(location.search).get('editor') === '1') {
    count.setAttribute('aria-label', 'Contador desactivado en vista previa');
    return;
  }
  count.dataset.requested = 'true';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    const response = await fetch('https://countapi.mileshilliard.com/api/v1/hit/punkiesycerebro-com-visitas-20261021-b8f37a', {
      cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer', signal: controller.signal
    });
    if (!response.ok) throw new Error('Counter unavailable');
    const data = await response.json();
    if (!/^[0-9]+$/.test(String(data.value))) throw new Error('Invalid count');
    const total = Number(data.value);
    if (!Number.isSafeInteger(total) || total < 0) throw new Error('Invalid count');
    const digits = String(total).padStart(6, '0');
    count.replaceChildren(...[...digits].map(digit => {
      const cell = document.createElement('span');
      cell.textContent = digit;
      cell.setAttribute('aria-hidden', 'true');
      return cell;
    }));
    count.setAttribute('aria-label', new Intl.NumberFormat('es-CO').format(total) + ' visitas al sitio');
  } catch {
    count.textContent = '—';
    count.setAttribute('aria-label', 'Contador temporalmente no disponible');
    note.textContent = 'Temporalmente no disponible';
    note.hidden = false;
  } finally {
    clearTimeout(timeout);
  }
})();

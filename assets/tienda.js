/* Carrito local. Los precios y nombres siempre proceden del catálogo actual. */
(() => {
  'use strict';
  const storageKey = 'pyc-cart-v1';
  const maxQuantity = 99;
  const money = value => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const host = document.getElementById('tienda-lista');
  const dialog = document.getElementById('cart-dialog');
  if (!host || !dialog) return;
  let catalog = [];
  let cart = [];
  let opener;
  let loaded = false;
  let storageAvailable = true;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(saved)) cart = saved;
  } catch { storageAvailable = false; }
  const status = (text, inCart = false) => {
    document.getElementById(inCart ? 'cart-status' : 'shop-status').textContent = text;
  };
  const findProduct = id => catalog.find(product => product.id === id);
  function normalizeCart(rows) {
    const valid = [];
    for (const row of rows) {
      if (!row || typeof row !== 'object') continue;
      const product = findProduct(row.id);
      if (!product || !Number.isInteger(row.quantity) || row.quantity < 1) continue;
      const size = String(row.size || '');
      if (product.tallas.length ? !product.tallas.includes(size) : size !== '') continue;
      const existing = valid.find(item => item.id === row.id && item.size === size);
      if (existing) existing.quantity = Math.min(maxQuantity, existing.quantity + row.quantity);
      else valid.push({ id: row.id, size, quantity: Math.min(maxQuantity, row.quantity) });
    }
    return valid;
  }
  function persist() {
    try { localStorage.setItem(storageKey, JSON.stringify(cart)); }
    catch { storageAvailable = false; }
  }
  function photo(product) {
    // Only local image paths or HTTPS sources supplied by the site owner.
    const path = product.imagen;
    if (typeof path === 'string' && path && !path.startsWith('//') && (/^https:\/\//.test(path) || !/^[a-z]+:/i.test(path))) {
      return `<img src="${escape(path)}" alt="${escape(product.producto)}" loading="lazy">`;
    }
    return `<div class="product-placeholder"><span>${escape(product.categoria || 'Material oficial')}</span><small>Imagen pendiente</small></div>`;
  }
  function orderMessage() {
    const lines = ['Hola, Punkies y Cerebro. Quiero comprar:', ''];
    for (const item of cart) {
      const product = findProduct(item.id);
      lines.push(`• ${product.producto}${item.size ? ' — Talla ' + item.size : ''}`, `Cantidad: ${item.quantity} | Unidad: ${money(product.precio)} | Subtotal: ${money(product.precio * item.quantity)}`, '');
    }
    const total = cart.reduce((sum, item) => sum + findProduct(item.id).precio * item.quantity, 0);
    lines.push(`Total de productos: ${money(total)} COP`, 'Envío por acordar. ¿Me confirman disponibilidad, pago y entrega?');
    return lines.join('\n');
  }
  function renderCart() {
    const previousFocus = document.activeElement;
    const focusedId = dialog.contains(previousFocus) ? previousFocus.id : '';
    document.querySelectorAll('[data-cart-count]').forEach(el => { el.textContent = cart.reduce((sum, row) => sum + row.quantity, 0); });
    document.getElementById('cart-items').innerHTML = cart.length ? cart.map((item, index) => {
      const product = findProduct(item.id);
      return `<article class="cart-item"><div><h3>${escape(product.producto)}</h3>${item.size ? `<p>Talla: <strong>${escape(item.size)}</strong></p>` : ''}<p>${money(product.precio)} / unidad</p></div><div class="cart-item-controls"><label for="cart-quantity-${index}">Cantidad<input id="cart-quantity-${index}" data-cart-quantity="${index}" type="number" min="1" max="${maxQuantity}" step="1" value="${item.quantity}" required aria-label="Cantidad de ${escape(product.producto)}${item.size ? ', talla ' + escape(item.size) : ''}"></label><strong>${money(product.precio * item.quantity)}</strong><button id="cart-remove-${index}" class="cart-remove" type="button" data-remove="${index}" aria-label="Quitar ${escape(product.producto)}${item.size ? ', talla ' + escape(item.size) : ''}">Quitar ×</button></div></article>`;
    }).join('') : '<p class="empty">Tu carrito está vacío. Vuelve a la tienda y elige tu primer producto.</p>';
    document.getElementById('cart-total').textContent = money(cart.reduce((sum, item) => sum + findProduct(item.id).precio * item.quantity, 0));
    const checkout = document.getElementById('cart-checkout');
    checkout.hidden = !cart.length;
    document.getElementById('checkout-note').hidden = !cart.length;
    if (cart.length) checkout.href = 'https://wa.me/573045377640?text=' + encodeURIComponent(orderMessage());
    else checkout.removeAttribute('href');
    if (focusedId) document.getElementById(focusedId)?.focus();
  }
  window.renderShop = products => {
    catalog = (Array.isArray(products) ? products : []).filter(product => product && typeof product.id === 'string' && typeof product.producto === 'string' && Number.isSafeInteger(product.precio) && product.precio > 0).map(product => ({ ...product, tallas: Array.isArray(product.tallas) ? product.tallas.filter(size => typeof size === 'string' && size) : [] }));
    const previous = JSON.stringify(cart);
    cart = normalizeCart(cart);
    persist();
    loaded = true;
    host.innerHTML = catalog.map((product, index) => `<article class="product-card">${photo(product)}<div class="product-info"><p class="product-category">${escape(product.categoria)}</p><h3>${escape(product.producto)}</h3>${product.descripcion ? `<p class="product-description">${escape(product.descripcion)}</p>` : ''}<p class="product-price">${money(product.precio)} <small>COP</small></p><form data-product="${escape(product.id)}"><div class="product-options">${product.tallas.length ? `<label for="size-${index}">Talla<select id="size-${index}" name="size" required><option value="">Elige tu talla</option>${product.tallas.map(size => `<option value="${escape(size)}">${escape(size)}</option>`).join('')}</select></label>` : ''}<label for="quantity-${index}">Cantidad<input id="quantity-${index}" name="quantity" type="number" min="1" max="${maxQuantity}" step="1" value="1" required></label></div><button class="btn primary" type="submit">AÑADIR AL CARRITO +</button></form></div></article>`).join('') || '<p class="empty">Pronto tendremos más productos.</p>';
    host.querySelectorAll('img').forEach(img => img.addEventListener('error', () => {
      const placeholder = document.createElement('div');
      placeholder.className = 'product-placeholder';
      placeholder.textContent = 'Imagen no disponible';
      img.replaceWith(placeholder);
    }));
    if (previous !== JSON.stringify(cart)) status('Actualizamos tu carrito según el catálogo disponible.', true);
    if (!storageAvailable) status('Puedes comprar en esta visita, pero este navegador no permite guardar el carrito al cerrar la página.');
    renderCart();
  };
  host.addEventListener('submit', event => {
    const form = event.target.closest('[data-product]');
    if (!form) return;
    event.preventDefault();
    if (!form.reportValidity()) return;
    const product = findProduct(form.dataset.product);
    if (!product) return;
    const size = form.elements.namedItem('size')?.value || '';
    const quantity = Number(form.elements.namedItem('quantity').value);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > maxQuantity || (product.tallas.length && !product.tallas.includes(size))) return;
    const row = cart.find(item => item.id === product.id && item.size === size);
    if (row && row.quantity + quantity > maxQuantity) {
      status(`Puedes añadir hasta ${maxQuantity} unidades por producto y talla. Revisa la cantidad en el carrito.`);
      return;
    }
    if (row) row.quantity += quantity;
    else cart.push({ id: product.id, size, quantity });
    persist();
    renderCart();
    status(`${quantity} × ${product.producto}${size ? ', talla ' + size : ''} añadido al carrito.${storageAvailable ? '' : ' El carrito se conserva solo durante esta visita.'}`);
  });
  document.querySelectorAll('[data-open-cart]').forEach(button => button.addEventListener('click', () => {
    if (!loaded) { status('Espera a que se carguen los productos. Si no aparecen, recarga la página.'); return; }
    opener = button;
    renderCart();
    dialog.showModal();
  }));
  dialog.querySelectorAll('[data-close-cart]').forEach(button => button.addEventListener('click', () => {
    dialog.close();
    document.getElementById('tienda').scrollIntoView({ block: 'start' });
  }));
  dialog.addEventListener('close', () => opener?.focus({ preventScroll: true }));
  dialog.addEventListener('change', event => {
    const input = event.target.closest('[data-cart-quantity]');
    if (!input) return;
    const index = Number(input.dataset.cartQuantity);
    const row = cart[index];
    if (!row) return;
    const quantity = Number(input.value);
    if (!input.checkValidity() || !Number.isInteger(quantity) || quantity < 1 || quantity > maxQuantity) {
      input.reportValidity();
      input.value = row.quantity;
      status(`Escribe una cantidad entera entre 1 y ${maxQuantity}.`, true);
      return;
    }
    row.quantity = quantity;
    persist();
    renderCart();
    status('Cantidad y total actualizados.', true);
  });
  dialog.addEventListener('click', event => {
    const button = event.target.closest('[data-remove]');
    if (!button) return;
    const index = Number(button.dataset.remove);
    const row = cart[index];
    if (!row) return;
    const name = findProduct(row.id).producto;
    cart.splice(index, 1);
    persist();
    renderCart();
    (document.getElementById('cart-remove-' + Math.min(index, cart.length - 1)) || dialog.querySelector('[data-close-cart]')).focus();
    status(name + ' eliminado del carrito.', true);
  });
  window.addEventListener('storage', event => {
    if (!loaded || (event.key !== storageKey && event.key !== null)) return;
    try {
      const saved = JSON.parse(event.newValue || '[]');
      cart = normalizeCart(Array.isArray(saved) ? saved : []);
      renderCart();
      status('Carrito actualizado desde otra pestaña.', true);
    } catch { /* Ignore malformed external storage without losing this selection. */ }
  });
})();

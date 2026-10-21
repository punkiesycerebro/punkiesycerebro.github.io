/* Carrito local. Los precios y nombres siempre proceden del catálogo actual. */
(() => {
  'use strict';
  const storageKey = 'pyc-cart-v1';
  const maxQuantity = 99;
  const money = value => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const host = document.getElementById('tienda-lista');
  const jimmyHost = document.getElementById('jimmy-tienda-lista');
  const sellers = {
    punkies: { name: 'Punkies y Cerebro', phone: '573045377640', checkout: 'cart-checkout' },
    jimmy: { name: 'Jimmy Jazz G.P.', phone: '573052318020', checkout: 'cart-checkout-jimmy' }
  };
  const dialog = document.getElementById('cart-dialog');
  if (!host || !dialog) return;
  let catalog = [];
  let cart = [];
  let opener;
  let activeShop = 'tienda';
  let loaded = false;
  let storageAvailable = true;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(saved)) cart = saved;
  } catch { storageAvailable = false; }
  const status = (text, inCart = false, seller = 'punkies') => {
    const target = inCart ? 'cart-status' : seller === 'jimmy' ? 'jimmy-shop-status' : 'shop-status';
    document.getElementById(target).textContent = text;
  };
  const findProduct = id => catalog.find(product => product.id === id);
  function normalizeCart(rows) {
    const valid = [];
    for (const row of rows) {
      if (!row || typeof row !== 'object') continue;
      const product = findProduct(row.id);
      if (!product || product.proximamente === true || !Number.isInteger(row.quantity) || row.quantity < 1) continue;
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
  const sellerRows = seller => cart.filter(item => findProduct(item.id).seller === seller);
  const subtotal = rows => rows.reduce((sum, item) => sum + findProduct(item.id).precio * item.quantity, 0);
  function orderMessage(seller) {
    const rows = sellerRows(seller);
    const lines = [`Hola, ${sellers[seller].name}. Quiero comprar:`, ''];
    for (const item of rows) {
      const product = findProduct(item.id);
      lines.push(`• ${product.producto}${item.size ? ' — Talla ' + item.size : ''}`, `Cantidad: ${item.quantity} | Unidad: ${money(product.precio)} | Subtotal: ${money(product.precio * item.quantity)}`, '');
    }
    const total = subtotal(rows);
    lines.push(`Total de productos: ${money(total)} COP`, 'Envío por acordar. ¿Me confirman disponibilidad, pago y entrega?');
    return lines.join('\n');
  }
  function renderCart() {
    const previousFocus = document.activeElement;
    const focusedId = dialog.contains(previousFocus) ? previousFocus.id : '';
    document.querySelectorAll('[data-cart-count]').forEach(el => { el.textContent = cart.reduce((sum, row) => sum + row.quantity, 0); });
    document.getElementById('cart-items').innerHTML = cart.length ? cart.map((item, index) => {
      const product = findProduct(item.id);
      return `<article class="cart-item"><div><p class="cart-seller">${escape(sellers[product.seller].name)}</p><h3>${escape(product.producto)}</h3>${item.size ? `<p>Talla: <strong>${escape(item.size)}</strong></p>` : ''}<p>${money(product.precio)} / unidad</p></div><div class="cart-item-controls"><label for="cart-quantity-${index}">Cantidad<input id="cart-quantity-${index}" data-cart-quantity="${index}" type="number" min="1" max="${maxQuantity}" step="1" value="${item.quantity}" required aria-label="Cantidad de ${escape(product.producto)}${item.size ? ', talla ' + escape(item.size) : ''}"></label><strong>${money(product.precio * item.quantity)}</strong><button id="cart-remove-${index}" class="cart-remove" type="button" data-remove="${index}" aria-label="Quitar ${escape(product.producto)}${item.size ? ', talla ' + escape(item.size) : ''}">Quitar ×</button></div></article>`;
    }).join('') : '<p class="empty">Tu carrito está vacío. Vuelve a la tienda y elige tu primer producto.</p>';
    document.getElementById('cart-total').textContent = money(cart.reduce((sum, item) => sum + findProduct(item.id).precio * item.quantity, 0));
    const activeSellers = Object.keys(sellers).filter(seller => sellerRows(seller).length);
    document.getElementById('cart-seller-totals').innerHTML = activeSellers.map(seller => `<p class="cart-seller-total"><span>${escape(sellers[seller].name)}</span><strong>${money(subtotal(sellerRows(seller)))}</strong></p>`).join('');
    for (const [seller, config] of Object.entries(sellers)) {
      const checkout = document.getElementById(config.checkout);
      const hasItems = activeSellers.includes(seller);
      checkout.hidden = !hasItems;
      if (hasItems) checkout.href = 'https://wa.me/' + config.phone + '?text=' + encodeURIComponent(orderMessage(seller));
      else checkout.removeAttribute('href');
    }
    const note = document.getElementById('checkout-note');
    note.hidden = !cart.length;
    note.textContent = activeSellers.length > 1
      ? 'Tu carrito incluye productos de Punkies y Cerebro y Jimmy Jazz. Abre los dos botones y pulsa Enviar en cada WhatsApp. Cada uno recibirá solo sus productos; disponibilidad, pago y envío se acuerdan por separado.'
      : 'Se abrirá WhatsApp con el pedido del vendedor indicado. Pulsa Enviar en WhatsApp para hacérselo llegar. Allí se confirman disponibilidad, pago y envío.';
    if (focusedId) document.getElementById(focusedId)?.focus();
  }
  window.renderShop = (products, jimmyProducts = []) => {
    const seen = new Set();
    const normalizeProducts = (products, seller) => (Array.isArray(products) ? products : [])
      .filter(product => product && typeof product.id === 'string' && product.id && !product.id.startsWith('jimmy:') && typeof product.producto === 'string' && (product.proximamente === true || (Number.isSafeInteger(product.precio) && product.precio > 0)))
      .map(product => ({ ...product, id: seller === 'jimmy' ? 'jimmy:' + product.id : product.id, seller, proximamente: product.proximamente === true, tallas: Array.isArray(product.tallas) ? product.tallas.filter(size => typeof size === 'string' && size) : [] }))
      .filter(product => { if (seen.has(product.id)) return false; seen.add(product.id); return true; });
    catalog = [...normalizeProducts(products, 'punkies'), ...normalizeProducts(jimmyProducts, 'jimmy')];
    const previous = JSON.stringify(cart);
    cart = normalizeCart(cart);
    persist();
    loaded = true;
    const groupOf = product => {
      const category = String(product.categoria || '').trim().toLocaleLowerCase('es');
      if (/^libros?$/.test(category)) return 'libros';
      if (/^(discos?|cd|vinilos?)(?:\s|$)/.test(category)) return 'discos';
      if (product.seller === 'jimmy' && /^memorias? usb$/.test(category)) return 'usb';
      return 'otros';
    };
    const cards = (seller, group = null) => catalog
      .filter(product => product.seller === seller && (!group || groupOf(product) === group))
      .map(product => {
        const index = catalog.indexOf(product);
        const purchase = product.proximamente
          ? '<p class="product-coming-soon">PRÓXIMAMENTE</p>'
          : `<p class="product-price">${money(product.precio)} <small>COP</small></p><form data-product="${escape(product.id)}"><div class="product-options">${product.tallas.length ? `<label for="size-${seller}-${index}">Talla<select id="size-${seller}-${index}" name="size" required><option value="">Elige tu talla</option>${product.tallas.map(size => `<option value="${escape(size)}">${escape(size)}</option>`).join('')}</select></label>` : ''}<label for="quantity-${seller}-${index}">Cantidad<input id="quantity-${seller}-${index}" name="quantity" type="number" min="1" max="${maxQuantity}" step="1" value="1" required></label></div><button class="btn primary" type="submit">AÑADIR AL CARRITO +</button></form>`;
        return `<article class="product-card" data-product-card="${escape(product.id)}">${photo(product)}<div class="product-info"><p class="product-category">${escape(product.categoria)}</p><h4>${escape(product.producto)}</h4>${product.descripcion ? `<p class="product-description">${escape(product.descripcion)}</p>` : ''}${purchase}</div></article>`;
      }).join('');
    host.innerHTML = [['discos', 'DISCOS'], ['otros', 'DEMÁS ARTÍCULOS'], ['libros', 'LIBROS']].map(([group, title]) => {
      const content = cards('punkies', group);
      return content ? `<section class="catalog-category" data-punkies-category="${group}" aria-labelledby="punkies-${group}-title"><h3 id="punkies-${group}-title">${title}</h3><div class="product-grid">${content}</div></section>` : '';
    }).join('') || '<p class="empty">Pronto tendremos más productos.</p>';
    if (jimmyHost) jimmyHost.innerHTML = [['libros', 'LIBROS'], ['discos', 'DISCOS'], ['usb', 'MEMORIAS USB'], ['otros', 'OTROS PRODUCTOS']].map(([group, title]) => {
      const content = cards('jimmy', group);
      return content ? `<section class="jimmy-category catalog-category" data-jimmy-category="${group}" aria-labelledby="jimmy-${group}-title"><h3 id="jimmy-${group}-title">${title}</h3><div class="product-grid">${content}</div></section>` : '';
    }).join('') || '<p class="empty">Pronto encontrarás aquí los productos de Jimmy Jazz G.P.</p>';
    [host, jimmyHost].filter(Boolean).flatMap(element => [...element.querySelectorAll('img')]).forEach(img => img.addEventListener('error', () => {
      const placeholder = document.createElement('div');
      placeholder.className = 'product-placeholder';
      placeholder.textContent = 'Imagen no disponible';
      img.replaceWith(placeholder);
    }));
    if (previous !== JSON.stringify(cart)) status('Actualizamos tu carrito según el catálogo disponible.', true);
    if (!storageAvailable) status('Puedes comprar en esta visita, pero este navegador no permite guardar el carrito al cerrar la página.');
    renderCart();
  };
  const addProduct = event => {
    const form = event.target.closest('[data-product]');
    if (!form) return;
    event.preventDefault();
    if (!form.reportValidity()) return;
    const product = findProduct(form.dataset.product);
    if (!product || product.proximamente) return;
    activeShop = product.seller === 'jimmy' ? 'jimmy-jazz' : 'tienda';
    const size = form.elements.namedItem('size')?.value || '';
    const quantity = Number(form.elements.namedItem('quantity').value);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > maxQuantity || (product.tallas.length && !product.tallas.includes(size))) return;
    const row = cart.find(item => item.id === product.id && item.size === size);
    if (row && row.quantity + quantity > maxQuantity) {
      status(`Puedes añadir hasta ${maxQuantity} unidades por producto y talla. Revisa la cantidad en el carrito.`, false, product.seller);
      return;
    }
    if (row) row.quantity += quantity;
    else cart.push({ id: product.id, size, quantity });
    persist();
    renderCart();
    status(`${quantity} × ${product.producto}${size ? ', talla ' + size : ''} añadido al carrito.${storageAvailable ? '' : ' El carrito se conserva solo durante esta visita.'}`, false, product.seller);
  };
  host.addEventListener('submit', addProduct);
  jimmyHost?.addEventListener('submit', addProduct);
  document.querySelectorAll('[data-open-cart]').forEach(button => button.addEventListener('click', () => {
    if (!loaded) { status('Espera a que se carguen los productos. Si no aparecen, recarga la página.'); return; }
    opener = button;
    activeShop = button.closest('.shop')?.id || activeShop;
    renderCart();
    dialog.showModal();
  }));
  dialog.querySelectorAll('[data-close-cart]').forEach(button => button.addEventListener('click', () => {
    dialog.close();
    document.getElementById(activeShop).scrollIntoView({ block: 'start' });
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

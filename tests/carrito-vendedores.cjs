const {JSDOM}=require('jsdom');
const fs=require('fs');
const assert=require('node:assert/strict');
const root=require('node:path').resolve(__dirname,'..')+require('node:path').sep;
const data=JSON.parse(fs.readFileSync(root+'content/site.json'));
// Synthetic products stay in this test; none is added to the published catalogue.
const jimmy=[{id:'gorra-punkies',producto:'Disco de prueba de Jimmy',precio:30000,categoria:'Disco',tallas:[]},{id:'camisa-jimmy',producto:'Camisa de prueba de Jimmy',precio:40000,categoria:'Libro',tallas:['M','L']}];
function load(saved,blocked=false,jimmyCatalog=jimmy){
 const dom=new JSDOM(fs.readFileSync(root+'index.html','utf8'),{url:process.env.PYC_TEST_ORIGIN||'https://punkiesycerebro.github.io',runScripts:'outside-only'});
 const w=dom.window;
 w.HTMLElement.prototype.scrollIntoView=function(){w.scrolled=this.id};
 w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')};
 w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new w.Event('close'))};
 if(saved)w.localStorage.setItem('pyc-cart-v1',saved);
 if(blocked)Object.defineProperty(w,'localStorage',{get(){throw Error('blocked')}});
 w.eval(fs.readFileSync(root+'assets/tienda.js','utf8'));
 w.renderShop(data.tienda,jimmyCatalog);
 return w;
}
function add(w,id,quantity,size){
 const f=w.document.querySelector(`form[data-product="${id}"]`);assert.ok(f,id);
 f.elements.quantity.value=quantity;
 if(size!==undefined)f.elements.size.value=size;
 f.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
}
function checkout(w,seller){const el=w.document.querySelector(seller==='jimmy'?'#cart-checkout-jimmy':'#cart-checkout');return {el,url:el.hasAttribute('href')?new URL(el.href):null}}
function msg(w,seller){return checkout(w,seller).url?.searchParams.get('text')}
const w=load();const d=w.document;
assert.equal(d.querySelectorAll('#tienda-lista .product-card').length,4);
assert.equal(d.querySelectorAll('#jimmy-tienda-lista .product-card').length,2);
assert.equal(new Set([...d.querySelectorAll('[id]')].map(x=>x.id)).size,d.querySelectorAll('[id]').length,'IDs remain unique across catalogues');
add(w,'gorra-punkies',1);
assert.equal(checkout(w,'jimmy').el.hidden,true);
assert.equal(checkout(w,'punkies').url.pathname,'/573045377640');
add(w,'jimmy:gorra-punkies',2);
add(w,'jimmy:camisa-jimmy',1,'');
assert.equal(d.querySelectorAll('.cart-item').length,2,'size is required');
add(w,'jimmy:camisa-jimmy',1,'M');add(w,'jimmy:camisa-jimmy',2,'L');
assert.equal(checkout(w,'jimmy').url.pathname,'/573052318020');
assert.match(msg(w,'punkies'),/45[.]000/);
assert.match(msg(w,'punkies'),/Gorra Punkies y Cerebro/);
assert.doesNotMatch(msg(w,'punkies'),/prueba|Talla|180[.]000|225[.]000/);
assert.match(msg(w,'jimmy'),/180[.]000/);
assert.match(msg(w,'jimmy'),/Talla M/);assert.match(msg(w,'jimmy'),/Talla L/);
assert.doesNotMatch(msg(w,'jimmy'),/Gorra Punkies y Cerebro|225[.]000/);
assert.match(d.querySelector('#cart-total').textContent,/225[.]000/);
assert.equal(d.querySelectorAll('.cart-seller-total').length,2);
assert.match(d.querySelector('#checkout-note').textContent,/dos botones/);
assert.equal(d.querySelector('[data-cart-count]').textContent,'6');
const quantity=d.querySelector('[data-cart-quantity="1"]');quantity.value=3;quantity.dispatchEvent(new w.Event('change',{bubbles:true}));
assert.match(msg(w,'jimmy'),/210[.]000/);assert.match(msg(w,'punkies'),/45[.]000/);
const restored=load(w.localStorage.getItem('pyc-cart-v1'));assert.equal(msg(restored,'jimmy'),msg(w,'jimmy'));
d.querySelector('[data-remove="0"]').click();
assert.equal(checkout(w,'punkies').el.hidden,true);assert.equal(checkout(w,'punkies').url,null);assert.equal(checkout(w,'jimmy').el.hidden,false);
assert.match(msg(w,'jimmy'),/210[.]000/);assert.doesNotMatch(d.querySelector('#checkout-note').textContent,/dos botones/);
d.querySelector('#jimmy-jazz [data-open-cart]').click();d.querySelector('[data-close-cart]').click();assert.equal(w.scrolled,'jimmy-jazz');
while(d.querySelector('[data-remove]'))d.querySelector('[data-remove]').click();
assert.equal(checkout(w,'jimmy').el.hidden,true);assert.equal(checkout(w,'jimmy').url,null);assert.equal(d.querySelector('#checkout-note').hidden,true);
const legacy=load(JSON.stringify([{id:'gorra-punkies',size:'',quantity:2,seller:'jimmy',precio:1}]));
assert.match(msg(legacy,'punkies'),/90[.]000/);assert.equal(checkout(legacy,'jimmy').el.hidden,true,'saved seller cannot change routing');
const tab=load();tab.dispatchEvent(new tab.StorageEvent('storage',{key:'pyc-cart-v1',newValue:restored.localStorage.getItem('pyc-cart-v1')}));assert.equal(msg(tab,'jimmy'),msg(restored,'jimmy'));
const blocked=load(undefined,true);add(blocked,'jimmy:gorra-punkies',1);assert.match(msg(blocked,'jimmy'),/30[.]000/);
assert.match(blocked.document.querySelector('#jimmy-shop-status').textContent,/solo durante esta visita/);
const removed=load(restored.localStorage.getItem('pyc-cart-v1'));removed.renderShop(data.tienda,[]);
assert.equal(removed.document.querySelectorAll('#jimmy-tienda-lista .product-card').length,0);assert.equal(checkout(removed,'jimmy').url,null);
assert.ok(data.tienda_jimmy.every(product=>!product.producto.includes('prueba')),'no invented Jimmy products in production');
const cms=load();cms.fetch=async()=>({ok:true,json:async()=>({...data,tienda_jimmy:jimmy})});cms.eval(fs.readFileSync(root+'assets/contenido.js','utf8'));
setTimeout(()=>{assert.equal(cms.document.querySelectorAll('#jimmy-tienda-lista .product-card').length,2);assert.equal(cms.document.querySelector('#form-next-url').value,new URL('/gracias.html',cms.location.origin).href);console.log('PASS: mixed orders isolated by seller, correct phone numbers and subtotals, colliding IDs, sizes, edits, removals, empty carts, legacy data, reload, tabs, blocked storage, return to Jimmy section, CMS and no fabricated products.');},0);

// Exercise the actual published catalogue as well as the isolation fixtures.
const actual=load();actual.renderShop(data.tienda,data.tienda_jimmy);
assert.equal(actual.document.querySelectorAll('#jimmy-tienda-lista .product-card').length,29);
assert.deepEqual([...actual.document.querySelectorAll('[data-jimmy-category]')].map(el=>el.dataset.jimmyCategory),['libros','discos']);
assert.equal(actual.document.querySelectorAll('[data-jimmy-category="libros"] .product-card').length,27);
assert.equal(actual.document.querySelectorAll('[data-jimmy-category="discos"] .product-card').length,2);
assert.equal(actual.document.querySelectorAll('[data-jimmy-category="libros"] h4').length,27);
const inputs=[...actual.document.querySelectorAll('#jimmy-tienda-lista input')];
assert.equal(new Set(inputs.map(el=>el.id)).size,inputs.length,'quantity IDs are unique across groups');
assert.equal(data.tienda_jimmy.filter(p=>p.categoria==='Libro').reduce((total,p)=>total+p.precio,0),1295000);
assert.equal(data.tienda_jimmy.find(p=>p.id==='libro-pildoras-de-la-ira').precio,30000);
for(const product of data.tienda_jimmy){if(product.imagen)assert.ok(fs.statSync(root+product.imagen).isFile());add(actual,'jimmy:'+product.id,1);}
assert.equal(actual.document.querySelectorAll('#jimmy-tienda-lista .product-placeholder').length,0);
assert.match(msg(actual,'jimmy'),/1[.]335[.]000/);
assert.equal(checkout(actual,'jimmy').url.pathname,'/573052318020');
assert.equal(checkout(actual,'punkies').url,null);
assert.match(msg(actual,'jimmy'),/Las píldoras de la ira/);
assert.match(msg(actual,'jimmy'),/Manual práctico del suicida/);
assert.match(msg(actual,'jimmy'),/En la sima/);
assert.match(msg(actual,'jimmy'),/Humores/);

// Stored carts must use current prices and full updated titles.
const repriced=load(JSON.stringify([{id:'jimmy:libro-los-pecados-capitales',size:'',quantity:2,precio:50000},{id:'jimmy:libro-vademecum-argolico-ii',size:'',quantity:1}]),false,data.tienda_jimmy);
assert.match(msg(repriced,'jimmy'),/80[.]000/);
assert.match(msg(repriced,'jimmy'),/15[.]000/);
assert.match(msg(repriced,'jimmy'),/Vademécum argólico, volumen II/);

// Upcoming Punkies album is displayed first but cannot enter a purchase.
assert.deepEqual([...actual.document.querySelectorAll('[data-punkies-category]')].map(el=>el.dataset.punkiesCategory),['discos','otros']);
const discCards=[...actual.document.querySelectorAll('[data-punkies-category="discos"] .product-card')];
assert.equal(discCards.length,2);
assert.equal(discCards[0].dataset.productCard,'este-lado-hacia-el-enemigo-2026');
assert.match(discCards[0].textContent,/PRÓXIMAMENTE/);
assert.equal(discCards[0].querySelector('.product-price'),null);
assert.equal(discCards[0].querySelector('form,button,input'),null);
assert.equal(actual.document.querySelectorAll('[data-punkies-category="otros"] .product-card').length,2);
const nonPurchasable=load(JSON.stringify([{id:'este-lado-hacia-el-enemigo-2026',size:'',quantity:1},{id:'gorra-punkies',size:'',quantity:1}]));
assert.match(msg(nonPurchasable,'punkies'),/45[.]000/);
assert.doesNotMatch(msg(nonPurchasable,'punkies'),/Este lado hacia el enemigo/);
const forged=nonPurchasable.document.createElement('form');
forged.dataset.product='este-lado-hacia-el-enemigo-2026';
nonPurchasable.document.querySelector('#tienda-lista').append(forged);
forged.dispatchEvent(new nonPurchasable.Event('submit',{bubbles:true,cancelable:true}));
assert.doesNotMatch(msg(nonPurchasable,'punkies'),/Este lado hacia el enemigo/);
const upcomingOnly=load(JSON.stringify([{id:'este-lado-hacia-el-enemigo-2026',quantity:1}]));
assert.equal(checkout(upcomingOnly,'punkies').url,null);

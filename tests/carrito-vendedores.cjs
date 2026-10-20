const {JSDOM}=require('jsdom');
const fs=require('fs');
const assert=require('node:assert/strict');
const root=require('node:path').resolve(__dirname,'..')+require('node:path').sep;
const data=JSON.parse(fs.readFileSync(root+'content/site.json'));
// Synthetic products stay in this test; none is added to the published catalogue.
const jimmy=[{id:'gorra-punkies',producto:'Disco de prueba de Jimmy',precio:30000,tallas:[]},{id:'camisa-jimmy',producto:'Camisa de prueba de Jimmy',precio:40000,tallas:['M','L']}];
function load(saved,blocked=false){
 const dom=new JSDOM(fs.readFileSync(root+'index.html','utf8'),{url:'https://punkiesycerebro.github.io',runScripts:'outside-only'});
 const w=dom.window;
 w.HTMLElement.prototype.scrollIntoView=function(){w.scrolled=this.id};
 w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')};
 w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new w.Event('close'))};
 if(saved)w.localStorage.setItem('pyc-cart-v1',saved);
 if(blocked)Object.defineProperty(w,'localStorage',{get(){throw Error('blocked')}});
 w.eval(fs.readFileSync(root+'assets/tienda.js','utf8'));
 w.renderShop(data.tienda,jimmy);
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
assert.equal(d.querySelectorAll('#tienda-lista .product-card').length,3);
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
setTimeout(()=>{assert.equal(cms.document.querySelectorAll('#jimmy-tienda-lista .product-card').length,2);console.log('PASS: mixed orders isolated by seller, correct phone numbers and subtotals, colliding IDs, sizes, edits, removals, empty carts, legacy data, reload, tabs, blocked storage, return to Jimmy section, CMS and no fabricated products.');},0);

// Exercise the actual published catalogue as well as the isolation fixtures.
const actual=load();actual.renderShop(data.tienda,data.tienda_jimmy);
assert.equal(actual.document.querySelectorAll('#jimmy-tienda-lista .product-card').length,4);
for(const product of data.tienda_jimmy){assert.ok(fs.existsSync(root+product.imagen));add(actual,'jimmy:'+product.id,1);}
assert.match(msg(actual,'jimmy'),/120[.]000/);
assert.equal(checkout(actual,'jimmy').url.pathname,'/573052318020');
assert.equal(checkout(actual,'punkies').url,null);
assert.match(msg(actual,'jimmy'),/Las píldoras de la ira/);
assert.match(msg(actual,'jimmy'),/Manual práctico del suicida/);
assert.match(msg(actual,'jimmy'),/En la sima/);
assert.match(msg(actual,'jimmy'),/Humores/);

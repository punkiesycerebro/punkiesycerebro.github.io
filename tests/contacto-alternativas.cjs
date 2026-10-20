const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

// No real requests or messages: exercise the rendered form's timeout path.
const dom = new JSDOM(fs.readFileSync('index.html', 'utf8'), {
  url: 'https://punkiesycerebro.com/', runScripts: 'outside-only'
});
const { window } = dom;
const config = JSON.parse(fs.readFileSync('content/site.json', 'utf8'));
let requests = 0;
window.fetch = async (url, options) => {
  if (url === 'content/site.json') return { ok: true, json: async () => config };
  requests++;
  assert.equal(options.method, 'POST');
  throw new window.DOMException('Timed out', 'AbortError');
};
window.eval(fs.readFileSync('assets/contenido.js', 'utf8'));

(async () => {
  await new Promise(resolve => setImmediate(resolve));
  const form = window.document.getElementById('formulario-contacto');
  const values = { name: 'Ana & José', email: 'ana@example.com', asunto: 'Contratación & prensa', mensaje: 'Hola\n¿Podemos hablar? <img src=x onerror=alert(1)>' };
  for (const [name, value] of Object.entries(values)) form.elements.namedItem(name).value = value;
  form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  await new Promise(resolve => setImmediate(resolve));
  const status = window.document.getElementById('form-alert');
  assert.equal(status.dataset.state, 'error');
  assert.equal(requests, 1, 'never retry a possibly processed message automatically');
  assert.equal(form.querySelector('button[type=submit]').disabled, false);
  for (const [name, value] of Object.entries(values)) assert.equal(form.elements.namedItem(name).value, value);
  const [whatsapp, email] = status.querySelectorAll('a');
  const wa = new URL(whatsapp.href);
  assert.equal(wa.hostname, 'wa.me');
  assert.equal(wa.pathname, '/573045377640');
  for (const value of Object.values(values)) assert.ok(wa.searchParams.get('text').includes(value));
  const mail = new URL(email.href);
  assert.equal(mail.pathname, 'juancamilo1504@gmail.com');
  assert.equal(mail.searchParams.get('subject'), values.asunto);
  assert.ok(mail.searchParams.get('body').includes(values.mensaje));
  assert.equal(status.querySelector('img'), null, 'message content must remain plain text');
  window.contactStatus('Aceptado', 'success');
  assert.equal(status.querySelectorAll('a').length, 0, 'clear stale alternatives on state change');
  dom.window.close();
  console.log('Contacto: timeout, conservación de datos, alternativas completas y ausencia de reintentos: OK');
})().catch(error => { dom.window.close(); console.error(error); process.exitCode = 1; });

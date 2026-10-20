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
  assert.equal(mail.pathname, config.correo_formulario || config.contacto);
  assert.equal(mail.searchParams.get('subject'), values.asunto);
  assert.ok(mail.searchParams.get('body').includes(values.mensaje));
  assert.equal(status.querySelector('img'), null, 'message content must remain plain text');
  window.contactStatus('Aceptado', 'success');
  assert.equal(status.querySelectorAll('a').length, 0, 'clear stale alternatives on state change');

  // A provider that accepts after 20 seconds must still be able to confirm.
  const timers = new Map();
  window.setTimeout = (fn, delay) => { timers.set(delay, fn); return delay; };
  window.clearTimeout = id => timers.delete(id);
  let accept;
  window.fetch = () => new Promise(resolve => { accept = resolve; });
  form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  assert.ok(timers.has(60000), 'allow 60 seconds for acknowledgement');
  timers.get(20000)();
  assert.equal(status.dataset.state, 'loading', 'slow response is not a delivery failure');
  assert.equal(form.querySelector('button[type=submit]').disabled, true, 'prevent duplicate sends while waiting');
  for (const [name, value] of Object.entries(values)) assert.equal(form.elements.namedItem(name).value, value);
  accept({ ok: true, status: 200, json: async () => ({ success: 'true' }) });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(status.dataset.state, 'success', 'accept a delayed acknowledgement');
  assert.equal(form.elements.namedItem('mensaje').value, '');
  assert.equal(timers.size, 0, 'clear both timers after acceptance');

  // Alternate provider stays inside the page. No real messages are sent.
  const alternate = { ...config };
  assert.equal(alternate.servicio_formulario, 'web3forms');
  assert.equal(alternate.correo_formulario, 'punkiesycerebro@gmail.com');
  window.renderCMSContent(alternate);
  for (const [name, value] of Object.entries(values)) form.elements.namedItem(name).value = value;
  window.Date.now = () => Date.now() + 20000;
  let alternateRequests = 0;
  window.fetch = async (url, options) => {
    alternateRequests++;
    assert.equal(url, 'https://api.web3forms.com/submit');
    assert.equal(options.headers['Content-Type'], 'application/json');
    const sent = JSON.parse(options.body);
    assert.equal(sent.access_key, alternate.web3forms_access_key);
    assert.equal(sent.name, values.name);
    assert.equal(sent.email, values.email);
    assert.equal(sent.message, values.mensaje);
    assert.equal(sent.asunto, values.asunto);
    assert.equal(sent.botcheck, false);
    return { ok: true, status: 200, json: async () => ({ success: true }) };
  };
  form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(alternateRequests, 1);
  assert.equal(status.dataset.state, 'success');
  assert.equal(window.location.href, 'https://punkiesycerebro.com/', 'keep user on the same page');
  for (const [name, value] of Object.entries(values)) form.elements.namedItem(name).value = value;
  window.Date.now = () => Date.now() + 40000;
  window.fetch = async () => ({ ok: false, status: 400, json: async () => ({ success: false, message: 'Invalid access key' }) });
  form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(status.dataset.state, 'error', 'provider rejection is never announced as success');
  for (const [name, value] of Object.entries(values)) assert.equal(form.elements.namedItem(name).value, value);
  assert.equal(form.querySelector('button[type=submit]').disabled, false);
  window.renderCMSContent({ ...alternate, web3forms_access_key: '' });
  assert.equal(form.querySelector('button[type=submit]').disabled, true, 'never silently send to another provider when its key is missing');
  assert.equal(form.dataset.destino, undefined);
  dom.window.close();
  console.log('Contacto: timeout, alternativas, conservación de datos y aceptación después del aviso de demora: OK');
})().catch(error => { dom.window.close(); console.error(error); process.exitCode = 1; });

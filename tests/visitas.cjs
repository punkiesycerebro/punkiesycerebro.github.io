const fs = require('node:fs');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync('index.html', 'utf8');
const script = fs.readFileSync('assets/visitas.js', 'utf8');
async function load(url, fetcher) {
  const dom = new JSDOM(html, { url, runScripts: 'outside-only' });
  let calls = 0;
  dom.window.fetch = async (...args) => { calls++; return fetcher(...args); };
  dom.window.eval(script);
  await new Promise(resolve => setImmediate(resolve));
  return { dom, get calls() { return calls; }, output: dom.window.document.getElementById('visit-count') };
}
(async () => {
  const a = await load('https://punkiesycerebro.com/', async (url, options) => {
    assert.ok(url.includes('/api/v1/hit/punkiesycerebro-com-visitas-'));
    assert.equal(options.credentials, 'omit');
    assert.equal(options.referrerPolicy, 'no-referrer');
    return { ok: true, json: async () => ({ value: '123' }) };
  });
  assert.equal(a.output.textContent, '000123');
  assert.equal(a.output.getAttribute('aria-label'), '123 visitas al sitio');
  assert.equal(a.dom.window.document.querySelector('footer img').getAttribute('src'), 'assets/logo-letras.png');
  a.dom.window.eval(script);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(a.calls, 1, 'do not count twice if script executes twice');
  a.dom.window.close();
  for (const response of [
    async () => { throw Error('Network failure'); },
    async () => ({ ok: false }),
    async () => ({ ok: true, json: async () => ({ value: '<img src=x>' }) }),
    async () => ({ ok: true, json: async () => ({ value: '-1' }) })
  ]) {
    const b = await load('https://www.punkiesycerebro.com/', response);
    assert.equal(b.output.textContent, '—', 'never invent a count on failure');
    assert.equal(b.calls, 1, 'no automatic retry of a possibly counted visit');
    assert.equal(b.dom.window.document.getElementById('visit-count-note').hidden, false);
    b.dom.window.close();
  }
  for (const url of ['http://localhost:4173/', 'https://punkiesycerebro.com/?editor=1']) {
    const c = await load(url, () => { throw Error('Unexpected request'); });
    assert.equal(c.calls, 0, 'local previews do not inflate live count');
    c.dom.window.close();
  }
  console.log('Visitas: total remoto, dígitos, logo original, errores, privacidad y ausencia de duplicados: OK');
})().catch(error => { console.error(error); process.exitCode = 1; });

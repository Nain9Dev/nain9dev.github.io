import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

// Ecosystem bar contract. See specs/038-ecosystem-suite-bar and specs/041-ecosystem-bar-split.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const JS_DIR = path.join(__dirname, '..', 'public', 'assets', 'js');
const SCRIPT_PATH = path.join(JS_DIR, 'ecosystem-bar.js');
const PANEL_PATH = path.join(JS_DIR, 'ecosystem-bar-panel.js');
const DATA_PATH = path.join(__dirname, '..', 'public', 'assets', 'data', 'ecosystem.v1.json');

const entry = () => fs.readFileSync(SCRIPT_PATH, 'utf-8');
const data = () => JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
const gzipSize = (file) => zlib.gzipSync(fs.readFileSync(file), { level: 9 }).length;
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

const CANONICAL_DATA_URL = 'https://www.naindev.com/assets/data/ecosystem.v1.json';

// Runs the entry script in a minimal browser stand-in and returns a mounted bar.
function mountBar({ fetchImpl, currentScriptSrc = null }) {
  const registry = new Map();
  const dispatched = [];
  class FakeHTMLElement {
    constructor() { this.attrs = new Map(); }
    attachShadow() {
      this.shadowRoot = { innerHTML: '', addEventListener() {} };
      return this.shadowRoot;
    }
    getAttribute(name) { return this.attrs.has(name) ? this.attrs.get(name) : null; }
    setAttribute(name, value) {
      const old = this.getAttribute(name);
      this.attrs.set(name, String(value));
      if (this.constructor.observedAttributes?.includes(name)) this.attributeChangedCallback(name, old, String(value));
    }
  }
  const sandbox = {
    HTMLElement: FakeHTMLElement,
    customElements: { get: (name) => registry.get(name), define: (name, ctor) => registry.set(name, ctor) },
    document: { currentScript: currentScriptSrc ? { src: currentScriptSrc } : null },
    CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init?.detail; } },
    performance: { now: () => 0 },
    URL,
    console
  };
  sandbox.window = sandbox;
  sandbox.fetch = fetchImpl;
  sandbox.location = { hostname: 'demo.naindev.com', origin: 'https://demo.naindev.com' };
  sandbox.addEventListener = () => {};
  sandbox.dispatchEvent = (event) => { dispatched.push(event); return true; };
  vm.createContext(sandbox);
  vm.runInContext(entry(), sandbox, { filename: 'ecosystem-bar.js' });
  const Bar = registry.get('nain-ecosystem-bar');
  assert.ok(Bar, 'the custom element must be defined');
  const bar = new Bar();
  bar.connectedCallback();
  return { bar, dispatched };
}

const okResponse = (body) => ({ ok: true, status: 200, json: async () => body });

test('ECO-003: the distribution stays within its transfer budget and the entry has no static imports', () => {
  assert.ok(fs.existsSync(SCRIPT_PATH), 'public/assets/js/ecosystem-bar.js must exist');
  const stat = fs.statSync(SCRIPT_PATH);
  assert.ok(stat.size > 500, 'script must contain implementation');
  assert.ok(stat.size < 20000, `entry script (${stat.size} bytes) must be under 20,000 bytes raw`);
  assert.ok(gzipSize(SCRIPT_PATH) <= 5 * 1024, `entry script gzip size (${gzipSize(SCRIPT_PATH)} bytes) must be at most 5 KB`);

  const parts = fs.readdirSync(JS_DIR).filter((f) => /^ecosystem-bar.*\.js$/.test(f)).map((f) => path.join(JS_DIR, f));
  parts.push(DATA_PATH);
  const total = parts.reduce((sum, file) => sum + gzipSize(file), 0);
  assert.ok(total <= 15 * 1024, `distribution gzip size (${total} bytes) must be at most 15 KB`);

  const content = entry();
  assert.match(content, /customElements\.define\(['"]nain-ecosystem-bar['"]/, 'must define custom element nain-ecosystem-bar');
  assert.doesNotMatch(content, /^\s*import\s+.+from/m, 'must have zero static imports');
  assert.doesNotMatch(content, /require\s*\(/, 'must have zero external require calls');
});

test('ECO-001: component encapsulates styles within Shadow DOM', () => {
  const content = entry();
  assert.match(content, /attachShadow\s*\(\s*\{\s*mode:\s*['"]open['"]\s*\}\s*\)/, 'must attach shadow DOM for strict CSS encapsulation');
  assert.match(content, /<style>/, 'must declare encapsulated shadow DOM styles');
  assert.match(content, /:host/, 'must target :host for container rules');
});

test('ECO-002: component includes brand link, status link, and public project catalog', () => {
  const content = entry();
  assert.match(content, /https:\/\/www\.naindev\.com\//, 'must link to main portfolio');
  assert.match(content, /https:\/\/status\.naindev\.com\//, 'must link to status page');

  const urls = data().catalog.flatMap((category) => category.items.map((item) => item.url));
  const expectedProjects = [
    'https://policy.naindev.com/',
    'https://drive.naindev.com/',
    'https://notify.naindev.com/',
    'https://3d.naindev.com/',
    'https://prospect.naindev.com/',
    'https://write.naindev.com/',
    'https://order.naindev.com/',
    'https://parametricad.naindev.com/',
    'https://orbe.naindev.com/',
    'https://pong.naindev.com/',
    'https://tai.naindev.com/',
    'https://tickets.naindev.com/',
    'https://gamehaven.naindev.com/',
    'https://configurator.naindev.com/',
    // ECO-024 (specs/next-portfolio-coverage): the modernizer demo is reachable from the bar.
    'https://modernizer.naindev.com/',
    'https://brand.naindev.com/',
    'https://github.com/Nain9Dev/engineering-handbook'
  ];
  for (const url of expectedProjects) assert.ok(urls.includes(url), `catalog must include demo URL: ${url}`);
});

test('ECO-004: component supports minimize/collapse toggle for full-screen viewports', () => {
  const content = entry();
  assert.match(content, /collapsed/i, 'must manage collapsed state');
  assert.match(content, /toggle|collapse/i, 'must contain collapse toggle handling');
});

test('ECO-005: component enforces accessibility attributes (WCAG 2.2 AA)', () => {
  const content = entry();
  assert.match(content, /aria-expanded/, 'dropdown toggle must declare aria-expanded');
  assert.match(content, /aria-label/, 'interactive buttons must declare descriptive aria-label');
  assert.match(content, /Escape/i, 'must handle Escape key to dismiss menus');
  const panel = fs.readFileSync(PANEL_PATH, 'utf-8');
  assert.match(panel, /role="dialog"/, 'the panel must be a dialog');
  assert.match(panel, /aria-modal="true"/, 'the panel must be modal');
  assert.match(panel, /aria-label/, 'the panel controls must declare descriptive aria-label');
});

test('ECO-006: the panel module is requested only when the panel opens', async () => {
  const content = entry();
  assert.doesNotMatch(content, /sampleEvents|invariant-card|drawer-tab/, 'the entry must not carry panel markup or profile data');
  assert.equal(content.match(/\bimport\s*\(/g)?.length, 1, 'the panel must be loaded through one dynamic import()');
  const panel = fs.readFileSync(PANEL_PATH, 'utf-8');
  assert.match(panel, /export\s+(const|function)\s+styles|export\s*\{[^}]*styles/, 'the panel must export its styles');
  assert.match(panel, /export\s+function\s+renderDrawer/, 'the panel must export renderDrawer');

  const requested = [];
  const fetchImpl = async (url) => { requested.push(String(url)); return okResponse(data()); };
  mountBar({ fetchImpl });
  await tick();
  assert.deepEqual(requested, [CANONICAL_DATA_URL], 'a plain page load requests only the data file');
});

test('ECO-007: catalog and profiles live in a versioned data file that drives the menu', async () => {
  const doc = data();
  assert.equal(doc.schemaVersion, 1);
  assert.ok(Array.isArray(doc.catalog) && doc.catalog.length > 0);
  assert.ok(doc.profiles && Object.keys(doc.profiles).length > 0);

  const { bar } = mountBar({ fetchImpl: async () => okResponse(doc) });
  await tick();
  const total = doc.catalog.reduce((sum, category) => sum + category.items.length, 0);
  assert.match(bar.shadowRoot.innerHTML, new RegExp(`Proyectos \\(${total}\\)`));
  assert.match(bar.shadowRoot.innerHTML, /NainPolicy/);
});

test('ECO-008: the bar degrades to brand and status links when the data is unavailable', async () => {
  const failures = [
    async () => { throw new Error('network down'); },
    async () => ({ ok: false, status: 404, json: async () => ({}) }),
    async () => okResponse({ schemaVersion: 2, catalog: [], profiles: {} }),
    async () => okResponse('not an object')
  ];
  for (const fetchImpl of failures) {
    const { bar } = mountBar({ fetchImpl });
    await tick();
    const html = bar.shadowRoot.innerHTML;
    assert.match(html, /href="https:\/\/www\.naindev\.com\/"/);
    assert.match(html, /href="https:\/\/status\.naindev\.com\/"/);
    assert.doesNotMatch(html, /Proyectos/);
  }
});

test('ECO-009: sibling files resolve from the script URL with a canonical fallback', async () => {
  const requested = [];
  const fetchImpl = async (url) => { requested.push(String(url)); return okResponse(data()); };
  mountBar({ fetchImpl, currentScriptSrc: 'https://cdn.example/lib/assets/js/ecosystem-bar.js' });
  mountBar({ fetchImpl, currentScriptSrc: null });
  await tick();
  assert.deepEqual(requested, ['https://cdn.example/lib/assets/data/ecosystem.v1.json', CANONICAL_DATA_URL]);
});

test('ECO-009: loading the data is not reported as host traffic', async () => {
  const { dispatched } = mountBar({ fetchImpl: async () => okResponse(data()) });
  await tick();
  assert.equal(dispatched.filter((event) => event.type === 'nain:telemetry').length, 0);
});

test('ECO-010: every catalog item and profile has the fields the bar renders', () => {
  const doc = data();
  const names = new Set();
  for (const category of doc.catalog) {
    assert.ok(category.category && Array.isArray(category.items), 'category needs a title and items');
    for (const item of category.items) {
      for (const field of ['name', 'desc', 'url', 'tag']) assert.ok(item[field], `${item.name}: missing ${field}`);
      assert.match(item.url, /^https:\/\//, `${item.name}: url must be HTTPS`);
      assert.ok(!names.has(item.name), `${item.name}: duplicated name`);
      names.add(item.name);
    }
  }
  for (const [key, profile] of Object.entries(doc.profiles)) {
    assert.match(key, /^[a-z0-9]+$/, `${key}: profile keys are lowercase alphanumerics`);
    for (const field of ['name', 'title', 'stack', 'pattern', 'sla', 'repo', 'docs']) assert.ok(profile[field], `${key}: missing ${field}`);
    assert.match(profile.repo, /^https:\/\//);
    assert.match(profile.docs, /^https:\/\//);
    assert.ok(profile.invariants.length > 0 && profile.invariants.every((inv) => inv.label && inv.rule), `${key}: invariants`);
    assert.ok(profile.sampleEvents.length > 0 && profile.sampleEvents.every((evt) => evt.type && evt.name && Number.isFinite(evt.latencyMs) && evt.status && evt.payload), `${key}: sampleEvents`);
  }
});

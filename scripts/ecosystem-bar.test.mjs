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
function mountBar({ fetchImpl, currentScriptSrc = null, storage = null, attrs = {} }) {
  const registry = new Map();
  const dispatched = [];
  const listeners = {};
  const shadowHandlers = {};
  class FakeHTMLElement {
    constructor() { this.attrs = new Map(); }
    attachShadow() {
      this.shadowRoot = { innerHTML: '', addEventListener: (type, fn) => { (shadowHandlers[type] ||= []).push(fn); } };
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
  sandbox.addEventListener = (type, listener) => { (listeners[type] ||= []).push(listener); };
  sandbox.dispatchEvent = (event) => { dispatched.push(event); return true; };
  if (storage) sandbox.localStorage = storage;
  vm.createContext(sandbox);
  vm.runInContext(entry(), sandbox, { filename: 'ecosystem-bar.js' });
  const Bar = registry.get('nain-ecosystem-bar');
  assert.ok(Bar, 'the custom element must be defined');
  const bar = new Bar();
  for (const [name, value] of Object.entries(attrs)) bar.attrs.set(name, value);
  bar.connectedCallback();
  return { bar, dispatched, listeners, shadowHandlers };
}

// A click target that answers closest() like a DOM element with these classes.
const fakeTarget = (classes) => ({ closest: (selector) => (selector.split(',').some((s) => classes.includes(s.trim().replace(/^\./, ''))) ? {} : null) });

// In-memory stand-in for localStorage.
const memoryStorage = (initial = {}) => {
  const map = new Map(Object.entries(initial));
  return { getItem: (k) => (map.has(k) ? map.get(k) : null), setItem: (k, v) => map.set(k, String(v)), map };
};

// Which of the three states the rendered markup shows.
const stateOf = (bar) => {
  const html = bar.shadowRoot.innerHTML;
  if (/class="bar"/.test(html)) return 'open';
  if (/class="dot"/.test(html)) return 'min';
  if (/class="tab"/.test(html)) return 'off';
  return 'unknown';
};

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

test('ECO-004: the bar has an open, a minimized and a hidden state with buttons to move between them', async () => {
  const { bar } = mountBar({ fetchImpl: async () => okResponse(data()), attrs: { collapsed: 'false' } });
  await tick();
  assert.equal(stateOf(bar), 'open');
  const html = bar.shadowRoot.innerHTML;
  assert.match(html, /class="btn btn-toggle"[^>]*aria-label="[^"]*Minimizar/, 'the open bar must offer a minimize button');
  assert.match(html, /class="btn btn-toggle btn-hide"[^>]*aria-label="[^"]*Ocultar/, 'the open bar must offer a hide button');
  bar.minimize();
  assert.equal(stateOf(bar), 'min');
  bar.hide();
  assert.equal(stateOf(bar), 'off');
  bar.minimize();
  assert.equal(stateOf(bar), 'min');
  bar.open();
  assert.equal(stateOf(bar), 'open');
});

test('ECO-026: by default only a small, faint handle renders, never a full-width bar', async () => {
  for (const attrs of [{}, { collapsed: 'true' }, { collapsed: '' }]) {
    const { bar } = mountBar({ fetchImpl: async () => okResponse(data()), attrs });
    await tick();
    assert.equal(stateOf(bar), 'min', `attrs ${JSON.stringify(attrs)} must start as the handle`);
    assert.doesNotMatch(bar.shadowRoot.innerHTML, /class="bar"/);
  }
  const css = entry();
  const handle = css.match(/\.dot\s*\{[^}]*\}/)?.[0] ?? '';
  const size = Number(handle.match(/width:\s*(\d+)px/)?.[1]);
  assert.ok(size > 0 && size <= 28, `the handle must be at most 28 px (found ${size})`);
  assert.equal(Number(handle.match(/height:\s*(\d+)px/)?.[1]), size, 'the handle is square');
  const shared = css.match(/\.dot,\s*\.tab\s*\{[^}]*\}/)?.[0] ?? '';
  assert.match(shared, /position:\s*fixed/);
  assert.match(shared, /left:[^;]*env\(safe-area-inset-left/, 'the handle sits on the left edge and keeps clear of the left safe area');
  assert.match(shared, /top:\s*\d+%/, 'the handle sits at mid height on the edge');
  assert.doesNotMatch(shared, /(?:^|[\s{;])(?:bottom|right):/, 'the handle is anchored to no corner, where page controls usually live');
  assert.ok(Number(shared.match(/opacity:\s*([\d.]+)/)?.[1]) <= 0.6, 'the handle must be faint until hovered');
  const peek = Number(handle.match(/translateX\(-(\d+)%\)/)?.[1]);
  assert.ok(peek >= 50, `the handle must peek out of the edge, with at least half of it out of view (found ${peek}%)`);
  assert.match(css, /\.dot:hover[^{]*\{[^}]*opacity:\s*1/, 'the handle must become opaque on hover and focus');
  assert.match(css, /\.dot:hover[^{]*\{[^}]*transform:\s*none/, 'the handle must slide fully into view on hover and focus');
  assert.match(css, /\.dot::after\s*\{[^}]*content/, 'the handle keeps a hit area larger than the part that peeks out');
  assert.match(css, /prefers-reduced-motion/, 'the handle must respect reduced motion');
});

test('ECO-027: the handle opens the bar, hide leaves an edge tab, the tab brings the handle back', async () => {
  const { bar } = mountBar({ fetchImpl: async () => okResponse(data()) });
  await tick();
  assert.equal(stateOf(bar), 'min');
  assert.match(bar.shadowRoot.innerHTML, /class="dot"[^>]*aria-label="[^"]+"/, 'the handle needs an accessible name');
  bar.open();
  assert.equal(stateOf(bar), 'open');
  bar.hide();
  assert.equal(stateOf(bar), 'off');
  assert.match(bar.shadowRoot.innerHTML, /class="tab"[^>]*aria-label="[^"]*Mostrar/, 'the tab needs an accessible name');
  const tab = entry().match(/\n\s*\.tab\s*\{[^}]*\}/)?.[0] ?? '';
  assert.ok(Number(tab.match(/width:\s*(\d+)px/)?.[1]) <= 8, 'the edge tab must be at most 8 px wide');
  bar.minimize();
  assert.equal(stateOf(bar), 'min');

  const forced = mountBar({ fetchImpl: async () => okResponse(data()), attrs: { collapsed: 'false' } });
  await tick();
  assert.equal(stateOf(forced.bar), 'open', 'collapsed="false" opens the bar');
});

test('ECO-027: each button routes to its own action, although the hide button shares the toggle style', async () => {
  const { bar, shadowHandlers } = mountBar({ fetchImpl: async () => okResponse(data()), attrs: { collapsed: 'false' } });
  await tick();
  const click = (...classes) => shadowHandlers.click.forEach((fn) => fn({ target: fakeTarget(classes) }));

  click('btn', 'btn-toggle', 'btn-hide');
  assert.equal(stateOf(bar), 'off', 'the hide button hides the bar');
  click('tab');
  assert.equal(stateOf(bar), 'min', 'the edge tab brings the handle back');
  click('dot');
  assert.equal(stateOf(bar), 'open', 'the handle opens the bar');
  click('btn', 'btn-toggle');
  assert.equal(stateOf(bar), 'min', 'the minimize button returns to the handle');
});

test('ECO-028: hiding the bar is remembered, and a broken or missing storage never throws', async () => {
  const storage = memoryStorage();
  const first = mountBar({ fetchImpl: async () => okResponse(data()), storage });
  await tick();
  first.bar.hide();
  assert.equal(storage.map.get('nain_bar'), 'off');
  const second = mountBar({ fetchImpl: async () => okResponse(data()), storage });
  await tick();
  assert.equal(stateOf(second.bar), 'off', 'the hidden state is restored');
  second.bar.minimize();
  const third = mountBar({ fetchImpl: async () => okResponse(data()), storage });
  await tick();
  assert.equal(stateOf(third.bar), 'min', 'showing the handle again forgets the hidden choice');

  const broken = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  const blocked = mountBar({ fetchImpl: async () => okResponse(data()), storage: broken });
  await tick();
  assert.doesNotThrow(() => { blocked.bar.hide(); blocked.bar.minimize(); blocked.bar.open(); });
  const missing = mountBar({ fetchImpl: async () => okResponse(data()) });
  await tick();
  assert.doesNotThrow(() => { missing.bar.hide(); });
});

test('ECO-029: Escape and a press outside return the open bar to the handle', async () => {
  const { bar, listeners } = mountBar({ fetchImpl: async () => okResponse(data()), attrs: { collapsed: 'false' } });
  await tick();
  assert.equal(stateOf(bar), 'open');

  const press = (type, event) => (listeners[type] || []).forEach((fn) => fn(event));
  press('click', { composedPath: () => [bar] });
  assert.equal(stateOf(bar), 'open', 'a press inside the bar keeps it open');
  press('click', { composedPath: () => [{}] });
  assert.equal(stateOf(bar), 'min', 'a press outside returns it to the handle');

  bar.open();
  press('keydown', { key: 'Escape' });
  assert.equal(stateOf(bar), 'min', 'Escape returns it to the handle');

  bar.open();
  bar._menuOpen = true;
  press('keydown', { key: 'Escape' });
  assert.equal(stateOf(bar), 'open', 'Escape first closes the open menu and leaves the bar open');
  press('keydown', { key: 'Escape' });
  assert.equal(stateOf(bar), 'min');
});

test('ECO-031: on phones the open bar fits the viewport and the menu stays on screen', () => {
  const css = entry();
  const phone = css.match(/@media\s*\(max-width:\s*(\d+)px\)\s*\{[^@]*?\}\s*\}/)?.[0] ?? '';
  assert.ok(phone, 'the bar must have a phone media query');
  assert.ok(Number(phone.match(/max-width:\s*(\d+)px/)?.[1]) >= 600, 'the phone rules must apply from 600 px down');
  for (const hidden of ['.project-pill', '.bar-status', '.btn-telemetry span']) {
    assert.ok(phone.includes(hidden), `${hidden} must be hidden on phones`);
  }
  assert.match(phone, /display:\s*none/);
  const menu = phone.match(/\.menu\s*\{[^}]*\}/)?.[0] ?? '';
  assert.match(menu, /position:\s*fixed/, 'the menu is pinned to the viewport on phones');
  assert.match(menu, /left:\s*\d+px/);
  assert.match(menu, /right:\s*\d+px/);
  assert.match(menu, /width:\s*auto/);
});

test('ECO-030: the catalog lists the Playables site', () => {
  const items = data().catalog.flatMap((category) => category.items);
  const playables = items.find((item) => item.url === 'https://playables.naindev.com/');
  assert.ok(playables, 'the catalog must list https://playables.naindev.com/');
  assert.equal(playables.name, 'Playables');
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

  const { bar } = mountBar({ fetchImpl: async () => okResponse(doc), attrs: { collapsed: 'false' } });
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
    const { bar } = mountBar({ fetchImpl, attrs: { collapsed: 'false' } });
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

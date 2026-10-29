// Guards for specs/021-post-paint-main-thread.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(path, 'utf8');

class FakeClassList {
  constructor(...names) { this.names = new Set(names); }
  add(name) { this.names.add(name); }
  remove(name) { this.names.delete(name); }
  contains(name) { return this.names.has(name); }
  toggle(name, force) { if (force ?? !this.names.has(name)) this.names.add(name); else this.names.delete(name); }
}

function layoutTrap(label) {
  const trap = {};
  for (const property of ['offsetLeft', 'offsetWidth', 'offsetHeight', 'offsetTop']) {
    Object.defineProperty(trap, property, { get() { throw new Error(`${label} read ${property}`); } });
  }
  trap.getBoundingClientRect = () => { throw new Error(`${label} called getBoundingClientRect`); };
  return trap;
}

function withGlobals(globals, fn) {
  const saved = {};
  for (const [key, value] of Object.entries(globals)) {
    saved[key] = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
  }
  try {
    return fn();
  } finally {
    for (const [key, descriptor] of Object.entries(saved)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  }
}

test('PERF-011: the decorative terminal prompt is excluded from Cloudflare email obfuscation', async () => {
  const terminal = await read('src/components/home/Terminal.astro');
  assert.match(terminal, /<!--email_off-->\[aitor@naindev\.com ~\]\$<!--\/email_off-->/);
});

test('PERF-012: home-only modules are loaded on demand, not from the entry bundle', async () => {
  const app = await read('src/scripts/app.js');
  for (const module of ['project-catalog', 'project-view', 'project-filters', 'impact-metrics', 'hero-field']) {
    assert.doesNotMatch(app, new RegExp(`^import[^;]*["']\\./${module}\\.js["']`, 'm'), `${module} is statically imported`);
  }
  assert.match(app, /import\(["']\.\/home-catalog\.js["']\)/);
  assert.match(app, /import\(["']\.\/impact-metrics\.js["']\)/);
  assert.match(app, /import\(["']\.\/hero-field\.js["']\)/);
});

test('PERF-013: project filters initialise without reading layout', async () => {
  const { initializeProjectFilters } = await import('../src/scripts/project-filters.js');
  const runtime = { textContent: JSON.stringify({ projectSingular: '{count} project', projectPlural: '{count} projects' }) };
  const timers = [];
  const makeButton = (category) => Object.assign(layoutTrap(`button ${category}`), {
    dataset: { projectFilter: category },
    classList: new FakeClassList(category === 'all' ? '' : ''),
    attributes: {},
    setAttribute(name, value) { this.attributes[name] = value; },
    addEventListener() {},
    querySelector: () => ({ textContent: '' }),
    closest: () => null
  });
  const buttons = ['all', 'dotnet'].map(makeButton);
  const cards = [{ dataset: { categories: 'dotnet backend' } }, { dataset: { categories: 'python' } }];
  const container = Object.assign(layoutTrap('container'), {
    classList: new FakeClassList(),
    querySelectorAll: () => cards
  });
  const toolbar = Object.assign(layoutTrap('toolbar'), {
    hidden: true,
    querySelectorAll: () => buttons,
    querySelector: () => buttons[0]
  });
  const count = { textContent: '' };

  withGlobals({
    document: { getElementById: (id) => (id === 'localized-ui' ? runtime : null) },
    window: { addEventListener() {}, removeEventListener() {} },
    setTimeout: (fn) => { timers.push(fn); return timers.length; }
  }, () => {
    initializeProjectFilters({ container, count, toolbar });
  });

  assert.equal(timers.length, 0, 'initialisation must not schedule deferred layout work');
  assert.equal(toolbar.hidden, false);
  assert.equal(count.textContent, '2 projects');
  assert.equal(buttons[0].attributes['aria-pressed'], 'true');
  assert.equal(buttons[1].attributes['aria-pressed'], 'false');
});

test('PERF-014: reveal motion in low-performance mode needs no observer or timer', async () => {
  const { initializeRevealMotion } = await import('../src/scripts/site-interactions.js');
  const elements = [0, 1, 2].map(() => Object.assign(layoutTrap('reveal'), { classList: new FakeClassList() }));
  let observers = 0;
  let timers = 0;
  withGlobals({
    document: { documentElement: { classList: new FakeClassList('low-performance') } },
    window: { matchMedia: () => ({ matches: false }), IntersectionObserver: class { constructor() { observers++; } observe() {} } },
    IntersectionObserver: class { constructor() { observers++; } observe() {} },
    setTimeout: () => { timers++; return 0; }
  }, () => initializeRevealMotion(elements));
  assert.equal(observers, 0);
  assert.equal(timers, 0);
  assert.ok(elements.every((element) => element.classList.contains('is-visible')));
});

test('PERF-014: reveal motion never schedules a layout-reading fallback timer', async () => {
  const { initializeRevealMotion } = await import('../src/scripts/site-interactions.js');
  const elements = [Object.assign(layoutTrap('reveal'), { classList: new FakeClassList() })];
  let timers = 0;
  class FakeObserver { observe() {} unobserve() {} disconnect() {} }
  withGlobals({
    document: { documentElement: { classList: new FakeClassList() } },
    window: { matchMedia: () => ({ matches: false }), IntersectionObserver: FakeObserver },
    IntersectionObserver: FakeObserver,
    setTimeout: () => { timers++; return 0; }
  }, () => initializeRevealMotion(elements));
  assert.equal(timers, 0);
});

test('PERF-015: decorative effects and the WebGL probe start when the browser is idle', async () => {
  const app = await read('src/scripts/app.js');
  const idle = app.match(/runQueueWhenIdle\(\[([\s\S]*?)\n  \]\);/);
  assert.ok(idle, 'missing runQueueWhenIdle block');
  // Particles and the card tilt were retired in spec 045 (ADR-0012): the pointer-lit grid and the CSS card lift replace them.
  const effects = ['initializeAmbientGlow', 'initializeScrollStorytelling'];
  for (const effect of effects) {
    assert.match(idle[1], new RegExp(effect), `${effect} must start when idle`);
  }
  assert.doesNotMatch(app, /particles\.js|initializeParticles|card-tilt\.js|initializeCardTilt/);
  const outside = app.replace(idle[0], '');
  for (const effect of effects) {
    assert.doesNotMatch(outside.replace(/^import.*$/gm, ''), new RegExp(`${effect}\\b`), `${effect} also runs eagerly`);
  }
});

test('PERF-017: deferred work runs one task per idle slot, never as one long task', async () => {
  const { runQueueWhenIdle } = await import('../src/scripts/idle.js');
  const callbacks = [];
  const order = [];
  withGlobals({
    window: { requestIdleCallback: (fn) => { callbacks.push(fn); return callbacks.length; }, cancelIdleCallback: () => {} }
  }, () => {
    runQueueWhenIdle([() => order.push('a'), () => order.push('b'), () => order.push('c')]);
    assert.equal(callbacks.length, 1, 'only the first task is scheduled up front');
    callbacks.shift()({ timeRemaining: () => 0, didTimeout: true });
    assert.deepEqual(order, ['a'], 'a forced (timed-out) slot runs a single task');
    callbacks.shift()({ timeRemaining: () => 0, didTimeout: true });
    callbacks.shift()({ timeRemaining: () => 0, didTimeout: true });
  });
  assert.deepEqual(order, ['a', 'b', 'c']);
  assert.equal(callbacks.length, 0);
});

test('PERF-015: runWhenIdle falls back to a timer without requestIdleCallback', async () => {
  const { runWhenIdle } = await import('../src/scripts/idle.js');
  let scheduled = null;
  withGlobals({
    window: {},
    setTimeout: (fn, delay) => { scheduled = { fn, delay }; return 1; },
    clearTimeout: () => {}
  }, () => runWhenIdle(() => {}));
  assert.ok(scheduled, 'expected a timer fallback');
  assert.ok(scheduled.delay > 0 && scheduled.delay <= 2000);
});

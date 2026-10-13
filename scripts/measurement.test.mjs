// Guards for specs/032-field-and-ci-performance.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(path, 'utf8');

test('RUM-001 and RUM-003: sampling decides whether the reporter is loaded, lazily', async () => {
  const { SAMPLE_RATE, isSampled } = await import('../src/scripts/vitals-sampling.js');
  assert.equal(SAMPLE_RATE, 0.25);
  assert.equal(isSampled(() => 0.1), true);
  assert.equal(isSampled(() => 0.25), false);
  assert.equal(isSampled(() => 0.9), false);
  const app = await read('src/scripts/app.js');
  assert.doesNotMatch(app, /^import[^;]*web-vitals/m, 'web-vitals must not be in the entry bundle');
  assert.match(app, /isSampled\(\)[\s\S]{0,120}import\(["']\.\/web-vitals-report\.js["']\)/);
  const pkg = JSON.parse(await read('package.json'));
  assert.equal(pkg.dependencies['web-vitals'], '6.2.2', 'web-vitals must be pinned exactly');
});

test('RUM-002: one Web Vitals event with ratings, buckets and device, sent once when hidden', async () => {
  const { buildVitalsProps, createReporter } = await import('../src/scripts/web-vitals-report.js');
  const props = buildVitalsProps({
    LCP: { value: 1834, rating: 'good' },
    INP: { value: 236, rating: 'needs-improvement' },
    CLS: { value: 0.031, rating: 'good' }
  }, 1440);
  assert.deepEqual(props, {
    lcp: 'good', inp: 'needs-improvement', cls: 'good',
    lcp_ms: '1750-2000', inp_ms: '200-250', cls_value: '0.00-0.05', device: 'desktop'
  });
  assert.deepEqual(buildVitalsProps({}, 375), {
    lcp: 'none', inp: 'none', cls: 'none', lcp_ms: 'none', inp_ms: 'none', cls_value: 'none', device: 'mobile'
  });

  const sent = [];
  const reporter = createReporter({ send: (name, options) => sent.push([name, options]), width: () => 1440 });
  reporter.record({ name: 'LCP', value: 900, rating: 'good' });
  reporter.flush();
  reporter.flush();
  assert.equal(sent.length, 1);
  assert.equal(sent[0][0], 'Web Vitals');
  assert.equal(sent[0][1].interactive, false);
  assert.equal(sent[0][1].props.lcp_ms, '750-1000');
});

test('LHCI-001: strict budget evaluated on medians, pinned Lighthouse and CI wiring', async () => {
  const { BUDGET, PAGES, RUNS, evaluate, median } = await import('./lib/performance-budget.mjs');
  assert.equal(RUNS, 3);
  assert.deepEqual(PAGES, ['/', '/en/', '/servicios/']);
  assert.deepEqual(Object.fromEntries(Object.entries(BUDGET).map(([k, r]) => [k, r.min ?? r.max])),
    { performance: 0.95, lcp: 2500, tbt: 200, cls: 0.1, bytes: 256000 });
  assert.equal(median([3, 1, 2]), 2);
  const lhr = (score, lcp) => ({ categories: { performance: { score } }, audits: {
    'largest-contentful-paint': { numericValue: lcp }, 'total-blocking-time': { numericValue: 0 },
    'cumulative-layout-shift': { numericValue: 0 }, 'total-byte-weight': { numericValue: 100000 } } });
  const rows = evaluate({ '/': [lhr(1, 1800), lhr(0.9, 3000), lhr(0.99, 1900)] });
  assert.equal(rows.find((r) => r.metric === 'performance').failed, false, 'median score 0.99 passes');
  assert.equal(rows.find((r) => r.metric === 'lcp').failed, false, 'median LCP 1900 passes despite one slow run');
  assert.equal(evaluate({ '/': [lhr(0.9, 2600), lhr(0.9, 2600), lhr(1, 1000)] }).filter((r) => r.failed).length, 2);

  const pkg = JSON.parse(await read('package.json'));
  assert.equal(pkg.devDependencies.lighthouse, '13.5.0');
  assert.equal(pkg.devDependencies['chrome-launcher'], '1.2.2');
  assert.equal(pkg.scripts['check:budget'], 'node scripts/check-budget.mjs');
  for (const workflow of ['.github/workflows/deploy.yml', '.github/workflows/static-site-check.yml']) {
    const text = await read(workflow);
    const check = text.indexOf('run: npm run check\n');
    const budget = text.indexOf('run: npm run check:budget');
    assert.ok(check !== -1 && budget > check, `${workflow} must run the budget after npm run check`);
  }
  const deploy = await read('.github/workflows/deploy.yml');
  assert.ok(deploy.indexOf('npm run check:budget') < deploy.indexOf('upload-pages-artifact'), 'budget must run before the upload');
});

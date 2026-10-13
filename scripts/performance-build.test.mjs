// Build-output guards for specs/020-low-end-device-performance. Run after `npm run build`.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const read = (path) => readFile(path, 'utf8');
const pages = ['dist/index.html', 'dist/en/index.html', 'dist/servicios/index.html'];
const attributes = (tag) => Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'g'))].map((m) => attributes(m[0]));

test('PERF-002: every preloaded font is referenced by a bundled stylesheet', async () => {
  const css = (await Promise.all((await readdir('dist/_astro')).filter((f) => f.endsWith('.css'))
    .map((f) => read(join('dist/_astro', f))))).join('\n');
  for (const page of pages) {
    const html = await read(page);
    const fonts = tags(html, 'link').filter((link) => link.rel === 'preload' && link.as === 'font');
    assert.ok(fonts.length >= 1, `${page} preloads no font`);
    for (const font of fonts) {
      assert.match(font.href, /^\/_astro\/.+\.woff2$/);
      assert.ok(css.includes(font.href) || html.includes(`url(${font.href})`), `${font.href} is preloaded but unused`);
    }
  }
});

test('PERF-003: pages load first-party scripts only as hashed bundles', async () => {
  for (const page of pages) {
    const html = await read(page);
    for (const script of tags(html, 'script').filter((s) => s.src)) {
      if (/^https?:/.test(script.src) || script.src.startsWith('/cdn-cgi/')) continue;
      assert.match(script.src, /^\/_astro\/[\w.-]+\.js$/, `${page} loads ${script.src}`);
    }
  }
});

test('HERO-004: the hero scene is a lazy chunk, never loaded by a page script tag', async () => {
  for (const page of pages) {
    assert.doesNotMatch(await read(page), /hero-scene\.[\w-]+\.js"/, `${page} loads the hero scene eagerly`);
  }
});

test('PERF-004: pages link one bundled stylesheet at most', async () => {
  for (const page of pages) {
    const html = await read(page);
    const styles = tags(html, 'link').filter((l) => l.rel === 'stylesheet');
    assert.ok(styles.length <= 1, `${page} links ${styles.length} stylesheets`);
    for (const link of styles) assert.match(link.href, /^\/_astro\/[\w.-]+\.css$/, `${page} links ${link.href}`);
  }
});

test('PERF-011: built home pages keep the email_off markers around the terminal prompt', async () => {
  for (const page of ['dist/index.html', 'dist/en/index.html']) {
    assert.match(await read(page), /<!--email_off-->\[aitor@naindev\.com ~\]\$<!--\/email_off-->/, page);
  }
});

test('LEAD-003: built checklist pages keep the email_off markers around the mailto link', async () => {
  for (const page of ['dist/recursos/checklist-ia/index.html', 'dist/en/resources/checklist-ia/index.html']) {
    assert.match(await read(page), /<!--email_off-->\s*<p[^>]*><a[^>]+href="mailto:contact@naindev\.com\?subject=[^"]+"[^>]*>[^<]+<\/a><\/p>\s*<!--\/email_off-->/, page);
  }
});

test('NAV-001 and NAV-003: built pages carry valid speculation rules and no router script', async () => {
  for (const page of pages) {
    const html = await read(page);
    assert.doesNotMatch(html, /ClientRouter|astro-view-transitions/, `${page} still ships the client router`);
    const rules = html.match(/<script type="speculationrules">([\s\S]*?)<\/script>/);
    assert.ok(rules, `${page} has no speculation rules`);
    assert.equal(JSON.parse(rules[1]).prerender[0].eagerness, 'moderate');
  }
});

test('PERF-012: entry scripts carry no home-only module code', async () => {
  for (const page of pages) {
    const html = await read(page);
    for (const script of tags(html, 'script').filter((s) => s.src?.startsWith('/_astro/'))) {
      const code = await read(join('dist', script.src));
      for (const marker of ['[ImpactMetricsManager]', '[HeroScene]', 'Unable to render the project catalog.']) {
        assert.ok(!code.includes(marker), `${page}: ${script.src} contains ${marker}`);
      }
    }
  }
});

test('PERF-009: the header logo is never served wider than twice its rendered width', async () => {
  // .brand-logo renders at most 4.2rem tall with a 4:1 aspect ratio: 4.2 * 16 * 4 = 268.8 px.
  const limit = Math.ceil(268.8 * 2);
  const html = await read('dist/index.html');
  const logo = tags(html, 'img').find((img) => (img.class ?? '').includes('brand-logo'));
  assert.ok(logo, 'logo not found');
  const candidates = [logo.src, ...(logo.srcset ?? '').split(',').map((c) => c.trim().split(' ')[0])].filter(Boolean);
  for (const candidate of new Set(candidates)) {
    const { width } = await sharp(join('dist', decodeURI(candidate))).metadata();
    assert.ok(width <= limit, `${candidate} is ${width}px wide (limit ${limit})`);
  }
});

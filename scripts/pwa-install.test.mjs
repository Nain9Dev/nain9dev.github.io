// Install contract of the site (specs/next-pwa-install, INS-001 to INS-007): manifest, icons and head tags.
// Runs after the build: it reads the source manifest and every HTML page of dist/.
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';
import { parse } from 'parse5';
import sharp from 'sharp';
import { defaultSEO } from '../src/utils/seo.ts';

const manifest = JSON.parse(await readFile('public/manifest.webmanifest', 'utf8'));

const htmlPages = async (directory) => {
  const pages = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) pages.push(...await htmlPages(path));
    else if (entry.name.endsWith('.html')) pages.push(path);
  }
  return pages;
};

const headTags = (html) => {
  const tags = [];
  const visit = (node) => {
    if (node.tagName === 'link' || node.tagName === 'meta') {
      tags.push({ tag: node.tagName, ...Object.fromEntries(node.attrs.map(({ name, value }) => [name, value])) });
    }
    for (const child of node.childNodes ?? []) visit(child);
  };
  visit(parse(html));
  return tags;
};

test('INS-002: the manifest names the app and opens it standalone from the root', () => {
  assert.equal(manifest.name, 'NainDev · Arquitectura de software');
  assert.equal(manifest.short_name, 'NainDev');
  assert(manifest.short_name.length <= 12, 'a longer label is truncated under the icon');
  assert.equal(manifest.description, defaultSEO.description);
  assert.equal(manifest.lang, 'es');
  assert.equal(manifest.id, '/');
  assert.equal(manifest.start_url, '/');
  assert.equal(manifest.scope, '/');
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.theme_color, '#070b16');
  assert.equal(manifest.background_color, '#070b16');
  assert(!('prefer_related_applications' in manifest), 'a related native app would cancel the browser install');
});

test('INS-003: the manifest declares 192 and 512 px icons and a maskable one, each at its real size', async () => {
  assert.deepEqual(
    manifest.icons.map(({ src, sizes, type, purpose }) => ({ src, sizes, type, purpose })),
    [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  );
  for (const icon of manifest.icons) {
    const { width, height, format } = await sharp(join('public', icon.src)).metadata();
    assert.equal(format, 'png', `${icon.src} must be a PNG file`);
    assert.equal(`${width}x${height}`, icon.sizes, `${icon.src} must measure what the manifest declares`);
  }
});

test('INS-004: the maskable icon is opaque and keeps the mark inside the safe zone', async () => {
  const { data, info } = await sharp('public/icons/icon-maskable-512.png').ensureAlpha().raw()
    .toBuffer({ resolveWithObject: true });
  const size = info.width;
  const safeRadius = size * 0.4;
  let markPixels = 0;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const at = (y * size + x) * 4;
      assert.equal(data[at + 3], 255, `transparent pixel at (${x}, ${y}): a launcher would fill it with its own colour`);
      // Same rule as check-brand-icons.mjs: the mark is the green strokes, the blue tile is the background.
      if (data[at + 1] < 149) continue;
      markPixels += 1;
      assert(Math.hypot(x + 0.5 - size / 2, y + 0.5 - size / 2) <= safeRadius,
        `the mark leaves the safe zone at (${x}, ${y}) and a circular launcher mask would cut it`);
    }
  }
  assert(markPixels > size * size * 0.05, 'the maskable icon must carry the mark');
});

test('INS-001 and INS-006: every built page links the manifest and carries the iOS tags', async () => {
  const pages = await htmlPages('dist');
  assert(pages.some((page) => page === join('dist', 'index.html')), 'the Spanish home must be built');
  assert(pages.some((page) => page === join('dist', 'en', 'index.html')), 'the English home must be built');
  let rendered = 0;
  for (const page of pages) {
    const tags = headTags(await readFile(page, 'utf8'));
    // A redirect stub is not a page a visitor stays on: Astro writes it without the layout.
    if (tags.some((tag) => tag.tag === 'meta' && tag['http-equiv'] === 'refresh')) continue;
    rendered += 1;
    const meta = (name) => tags.filter((tag) => tag.tag === 'meta' && tag.name === name).map((tag) => tag.content);
    const links = (rel) => tags.filter((tag) => tag.tag === 'link' && tag.rel === rel);
    assert.deepEqual(links('manifest').map((tag) => tag.href), ['/manifest.webmanifest'], `${page}: manifest link`);
    assert.deepEqual(links('apple-touch-icon').map((tag) => `${tag.sizes} ${tag.href}`), ['180x180 /apple-touch-icon.png'],
      `${page}: apple-touch-icon`);
    assert.deepEqual(meta('apple-mobile-web-app-title'), [manifest.short_name], `${page}: iOS label`);
    assert.deepEqual(meta('mobile-web-app-capable'), ['yes'], `${page}: mobile-web-app-capable`);
    assert.deepEqual(meta('apple-mobile-web-app-capable'), ['yes'], `${page}: apple-mobile-web-app-capable`);
    assert.deepEqual(meta('apple-mobile-web-app-status-bar-style'), ['black'], `${page}: iOS status bar`);
  }
  assert(rendered >= 100, `only ${rendered} rendered pages were checked: the redirect filter is hiding real pages`);
});

test('INS-001: the build publishes the manifest and its icons at the root', async () => {
  const built = JSON.parse(await readFile('dist/manifest.webmanifest', 'utf8'));
  assert.deepEqual(built, manifest);
  for (const icon of built.icons) {
    const source = await readFile(join('public', icon.src));
    assert((await readFile(join('dist', icon.src))).equals(source), `${icon.src} must be published unchanged`);
  }
});

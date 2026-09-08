import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { relative } from 'node:path';
import { parse } from 'parse5';
import { walk } from './sync-translations.mjs';
import { attr, descendants, origin } from './lib/localization.mjs';

// Compare the published static artifact with the local release build using GET only.
const hash = value => createHash('sha256').update(value).digest('hex');
function content(node) {
  const protectedEmail = attr(node, 'data-cfemail');
  if (protectedEmail) {
    assert.match(protectedEmail, /^(?:[0-9a-f]{2})+$/i, 'Invalid Cloudflare email encoding');
    const bytes = Buffer.from(protectedEmail, 'hex');
    return Buffer.from(bytes.subarray(1).map(value => value ^ bytes[0])).toString('utf8');
  }
  return ['script', 'style'].includes(node.tagName) ? ''
    : node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(content).join('');
}
function fingerprint(html) {
  const nodes = descendants(parse(html));
  const selected = nodes.filter(node => ['title', 'h1'].includes(node.tagName)
    || (node.tagName === 'meta' && ['description', 'robots'].includes(attr(node, 'name')))
    || (node.tagName === 'link' && ['canonical', 'alternate'].includes(attr(node, 'rel')))
    || (node.tagName === 'script' && ['application/ld+json', 'application/json'].includes(attr(node, 'type'))));
  return {
    lang: attr(nodes.find(node => node.tagName === 'html'), 'lang'),
    selected: selected.map(node => ({ tag: node.tagName, attrs: node.attrs, text: (node.childNodes ?? []).map(child => child.value ?? '').join('') })),
    main: content(nodes.find(node => node.tagName === 'main') ?? {}).replace(/\s+/g, ' ').trim(),
    refresh: attr(nodes.find(node => attr(node, 'http-equiv')?.toLowerCase() === 'refresh') ?? {}, 'content'),
  };
}

const targets = [];
for (const file of await walk('dist')) {
  const path = relative('dist', file).replaceAll('\\', '/');
  if (path.startsWith('_server/') || path.startsWith('.')) continue;
  if (!/\.(?:html|js|css|json|xml|txt|ico|png|svg|webp|woff2)$/.test(path)) continue;
  targets.push({ file, path: '/' + path.replace(/index\.html$/, ''), html: path.endsWith('.html') });
}
const results = [];
let index = 0;
async function worker() {
  while (index < targets.length) {
    const target = targets[index++];
    const url = new URL(target.path, origin).href;
    try {
      const expected = await readFile(target.file);
      const response = await fetch(url, { signal: AbortSignal.timeout(30000), redirect: 'follow' });
      assert.equal(response.status, 200, `${url}: HTTP ${response.status}`);
      assert.equal(new URL(response.url).origin, origin, 'Unexpected cross-origin redirect');
      const actual = Buffer.from(await response.arrayBuffer());
      if (target.html) assert.deepEqual(fingerprint(actual.toString()), fingerprint(expected.toString()), 'Published page differs from build');
      else {
        const comparable = bytes => /\.(?:js|css|json|xml|txt|svg)$/.test(target.path)
          ? bytes.toString('utf8').replaceAll('\r\n', '\n') : bytes;
        assert.equal(hash(comparable(actual)), hash(comparable(expected)), 'Published asset differs from build');
      }
      results.push({ url, status: response.status, kind: target.html ? 'page' : 'asset', match: true });
    } catch (error) {
      results.push({ url, match: false, error: error.message.split('\n')[0] });
    }
  }
}
await Promise.all(Array.from({ length: 4 }, worker));
const failures = results.filter(item => !item.match);
await mkdir('.astro', { recursive: true });
await writeFile('.astro/production-verification.json', JSON.stringify({ checkedAt: new Date().toISOString(), origin, results }, null, 2) + '\n');
console.log(JSON.stringify({ checked: results.length, pages: results.filter(item => item.kind === 'page').length, assets: results.filter(item => item.kind === 'asset').length, failed: failures.length, examples: failures.slice(0, 5) }, null, 2));
if (failures.length) process.exitCode = 1;

// Guards for specs/028-font-subsetting. FONT-002 needs a fresh `npm run build` (dist/).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const KB = 1024;

function ranges(css) {
  const declared = [...css.matchAll(/unicode-range:\s*([^;]+);/g)].map((m) => m[1]);
  assert.ok(declared.length >= 2, 'expected a unicode-range per font');
  assert.equal(new Set(declared).size, 1, 'both fonts must declare the same unicode-range');
  return declared[0].split(',').map((part) => {
    const [start, end = start] = part.trim().replace(/^U\+/i, '').split('-');
    return [parseInt(start, 16), parseInt(end, 16)];
  });
}

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith('.html') ? [path] : [];
  }));
  return nested.flat();
}

const decode = (text) => text
  .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
  .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');

test('FONT-001: subset fonts stay within their budgets', async () => {
  assert.ok((await stat('src/assets/fonts/inter-var.woff2')).size <= 34 * KB, 'Inter over 34 KB');
  assert.ok((await stat('src/assets/fonts/outfit-var.woff2')).size <= 30 * KB, 'Outfit over 30 KB');
});

test('FONT-002: visible text is covered by the declared unicode-range', { skip: !existsSync('dist/index.html') && 'run npm run build first' }, async () => {
  const covered = ranges(await readFile('src/styles/main.css', 'utf8'));
  const inRange = (code) => covered.some(([start, end]) => code >= start && code <= end);
  const missing = new Map();
  for (const file of await htmlFiles('dist')) {
    const html = await readFile(file, 'utf8');
    const text = decode(html
      .replace(/<(script|style|pre|code|kbd|samp)\b[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^>]+>/g, ' '));
    for (const char of text) {
      const code = char.codePointAt(0);
      if (code < 0x20 || inRange(code) || /[\p{Extended_Pictographic}\p{So}\u{FE0F}]/u.test(char)) continue;
      if (!missing.has(char)) missing.set(char, file);
    }
  }
  assert.deepEqual([...missing].map(([char, file]) => `U+${char.codePointAt(0).toString(16).toUpperCase()} in ${file}`), []);
});

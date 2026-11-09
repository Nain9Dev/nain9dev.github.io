import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLlmsTxt } from '../src/utils/llms.ts';
import { buildSitemap } from './lib/sitemap.mjs';

const input = {
  siteName: 'NainDev',
  summary: 'Personal site of Aitor Nain Mendoza Vallejo, full stack software architect.',
  languageNote: 'Spanish is the source language; every page has an English version under /en/.',
  sections: [
    { title: 'Main pages', links: [{ title: 'Home', url: 'https://www.naindev.com/', description: 'Profile and selected work' }] },
    { title: 'Services', links: [{ title: '3D validation', url: 'https://www.naindev.com/servicios/validacion-3d/' }] },
    { title: 'Empty section', links: [] },
  ],
};

test('llms.txt leads with the site name, a blockquote summary and linked sections (DISC-001)', () => {
  const text = buildLlmsTxt(input);
  const lines = text.split('\n');
  assert.equal(lines[0], '# NainDev');
  assert.equal(lines[2], `> ${input.summary}`);
  assert(text.includes('## Main pages\n\n- [Home](https://www.naindev.com/): Profile and selected work'));
  assert(text.includes('- [3D validation](https://www.naindev.com/servicios/validacion-3d/)\n'));
  assert(text.includes(input.languageNote));
  assert(text.endsWith('\n') && !text.endsWith('\n\n'));
});

test('llms.txt skips sections without links', () => {
  assert(!buildLlmsTxt(input).includes('Empty section'));
});

test('llms.txt keeps link text safe inside Markdown brackets', () => {
  const text = buildLlmsTxt({ ...input, sections: [{ title: 'S', links: [{ title: 'A [b] c', url: 'https://www.naindev.com/x/' }] }] });
  assert(text.includes('- [A \\[b\\] c](https://www.naindev.com/x/)'));
});

test('sitemap entries carry es, en and x-default alternates (DISC-003)', () => {
  const xml = buildSitemap([{ es: 'https://www.naindev.com/servicios/', en: 'https://www.naindev.com/en/services/' }]);
  assert(xml.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"'));
  const entries = xml.match(/<url>.*?<\/url>/g);
  assert.equal(entries.length, 2);
  for (const entry of entries) {
    assert(entry.includes('<xhtml:link rel="alternate" hreflang="es" href="https://www.naindev.com/servicios/"/>'));
    assert(entry.includes('<xhtml:link rel="alternate" hreflang="en" href="https://www.naindev.com/en/services/"/>'));
    assert(entry.includes('<xhtml:link rel="alternate" hreflang="x-default" href="https://www.naindev.com/servicios/"/>'));
  }
});

test('sitemap emits lastmod only when the date is known (DISC-004)', () => {
  const xml = buildSitemap([
    { es: 'https://www.naindev.com/blog/a/', en: 'https://www.naindev.com/en/blog/a/', lastmod: '2026-08-23' },
    { es: 'https://www.naindev.com/', en: 'https://www.naindev.com/en/' },
  ]);
  const entries = xml.match(/<url>.*?<\/url>/g);
  assert.equal(entries.filter(entry => entry.includes('<lastmod>2026-08-23</lastmod>')).length, 2);
  assert.equal(entries.filter(entry => entry.includes('<lastmod>')).length, 2);
});

test('sitemap rejects a malformed lastmod and escapes URLs', () => {
  assert.throws(() => buildSitemap([{ es: 'https://www.naindev.com/', en: 'https://www.naindev.com/en/', lastmod: '23/08/2026' }]), /lastmod/);
  assert(buildSitemap([{ es: 'https://www.naindev.com/?a=1&b=2', en: 'https://www.naindev.com/en/?a=1&b=2' }]).includes('?a=1&amp;b=2'));
});

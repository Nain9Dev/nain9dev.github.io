// Guards for the footer in four short columns (owner decision of 2026-10-29, specs/next-design-fusion DF-021): the
// brand on top, Servicios / Contenido / Tecnología / Contacto, one short legal line, no emoji and no credit (the
// credit to the designer lives in the collaboration section, DF-011 j). Runs after the build.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');
const footerOf = (html) => html.match(/<footer[\s\S]*?<\/footer>/)?.[0] ?? '';
const columnsOf = (footer) => [...footer.matchAll(/<div class="footer-column">\s*<h2 class="footer-title">([^<]+)<\/h2>([\s\S]*?)<\/div>/g)]
  .map((match) => ({ title: match[1], hrefs: [...match[2].matchAll(/href="([^"]+)"/g)].map((link) => link[1]) }));

test('DF-021: the footer has the brand and four short columns with the expected links', async () => {
  const footer = footerOf(await read('dist/index.html'));
  assert.match(footer, /<a class="footer-brand" href="\/#top"[^>]*aria-label="NainDev, volver al inicio"/);
  assert.match(footer, /<svg class="footer-mark"[^>]*>\s*<path d="M148 148V848M308 288L686 738M848 148V848"/, 'the isotype');
  assert.match(footer, /<svg class="footer-wordmark" viewBox="0 0 423 38"/, 'and the wordmark');
  const columns = columnsOf(footer);
  assert.deepEqual(columns.map((column) => column.title), ['Servicios', 'Contenido', 'Tecnología', 'Contacto']);
  const [services, content, technology, contact] = columns.map((column) => column.hrefs);
  for (const href of ['/servicios/sistemas-criticos-dotnet/', '/servicios/arquitectura-ia-generativa/', '/servicios/validacion-3d/', '/servicios/']) assert.ok(services.includes(href), href);
  for (const href of ['/proyectos/', '/blog/', '/servicios/arquitectura-frontend-alto-rendimiento/', '/#method', '/#about', '/recursos/checklist-ia']) assert.ok(content.includes(href), href);
  assert.ok(technology.length >= 5 && technology.every((href) => href.startsWith('/tecnologia/')), 'five technology pages');
  assert.ok(contact.includes('/#contact'), 'the message goes to the contact section, which holds the copy button (MAIL-006)');
  assert.ok(!contact.some((href) => href.startsWith('mailto:')), 'no mailto link');
  assert.ok(contact.some((href) => href.startsWith('https://calendly.com/')));
  assert.ok(contact.includes('https://github.com/Nain9Dev'));
  assert.ok(contact.some((href) => href.startsWith('https://www.linkedin.com/in/')));
});

test('DF-021: one short legal line, no emoji, no credit, no duplicated id', async () => {
  const html = await read('dist/index.html');
  const footer = footerOf(html);
  assert.match(footer, /© <span[^>]*data-current-year[^>]*>\d{4}<\/span> NainDev · Analítica sin cookies/);
  assert.doesNotMatch(footer, /Analytics privacy-first|Sin dependencias de terceros/, 'the long sentence is gone');
  assert.doesNotMatch(footer, /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u, 'no emoji (the copyright sign is not one)');
  assert.doesNotMatch(footer, /David|Contrast3D/, 'the credit lives in the collaboration section');
  const ids = [...html.matchAll(/ id="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'ids stay unique with two wordmarks on the page');
  assert.match(footer, /class="status-pill"/);
  assert.match(footer, /class="footer-checklist"[^>]*data-calendly-track="footer"/, 'the checklist keeps its tracking');
});

test('DF-021: the English footer has the same columns', async () => {
  const footer = footerOf(await read('dist/en/index.html'));
  assert.deepEqual(columnsOf(footer).map((column) => column.title), ['Services', 'Content', 'Technology', 'Contact']);
  assert.match(footer, /NainDev · Cookie-free analytics/);
  const content = columnsOf(footer)[1].hrefs;
  for (const href of ['/en/projects/', '/en/blog/', '/en/#method', '/en/#about']) assert.ok(content.includes(href), href);
});

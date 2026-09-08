import test from 'node:test';
import assert from 'node:assert/strict';
import { parse, serialize } from 'parse5';
import { englishPath, extractSegments, localizeDocument, makeCatalog, validateTranslation, mapData } from './lib/localization.mjs';

test('English routes preserve Spanish addresses and fragments', () => {
  assert.equal(englishPath('/'), '/en/');
  assert.equal(englishPath('/servicios/validacion-3d/?q=1#scope'), '/en/services/validacion-3d/?q=1#scope');
  assert.equal(englishPath('/assets/logo.svg'), '/assets/logo.svg');
  assert.equal(englishPath('https://example.com/servicios/'), 'https://example.com/servicios/');
  assert.equal(englishPath('/en/services/'), '/en/services/');
  assert.equal(englishPath('/blog/article#example'), '/en/blog/article/#example');
  assert.equal(englishPath('/404.html'), '/en/404.html');
});

test('Extraction retains complete prose and protects inline markup and code', () => {
  const doc = parse('<p>Valida <strong>3 modelos</strong> con <code>Check(x)</code>.</p><script>const title="Español";</script>');
  const segments = extractSegments(doc);
  assert.equal(segments.length, 1);
  assert.equal(segments[0].source, 'Valida ⟦0⟧3 modelos⟦/0⟧ con ⟦1/⟧.');
  assert.throws(() => validateTranslation(segments[0].source, 'Validate 4 models.'), /placeholder|literal/);
});

test('Translated prose cannot inject markup, change attributes or executable scripts', () => {
  const doc = parse('<p>Visita <a href="/servicios/">los servicios</a>.</p><script>window.value="es";</script>');
  const segments = extractSegments(doc);
  const catalog = makeCatalog(segments, ['Visit ⟦0⟧the services⟦/0⟧. <img src=x onerror=alert()>']);
  const html = localizeDocument(serialize(doc), catalog);
  assert.ok(html.includes('&lt;img'));
  assert.ok(html.includes('href="/en/services/"'));
  assert.ok(html.includes('window.value="es";'));
  assert.ok(!html.includes('<img'));
});

test('Unreviewed and changed source text fail closed', () => {
  const segments = extractSegments(parse('<p>Texto oficial.</p>'));
  const catalog = makeCatalog(segments, ['Official text.']);
  assert.throws(() => localizeDocument('<p>Texto nuevo.</p>', catalog), /Missing/);
  catalog[segments[0].id].status = 'draft';
  assert.throws(() => localizeDocument('<p>Texto oficial.</p>', catalog), /review/);
  assert.throws(() => validateTranslation('Solo 3 modelos, no 4.', 'Only 3 models, not 5.'), /literal/);
  assert.doesNotThrow(() => validateTranslation('10.000 modelos en 2.3s.', '10,000 models in 2.3s.'));
  assert.throws(() => validateTranslation('2.3 segundos.', '2,300 seconds.'), /literal/);
  assert.throws(() => validateTranslation('Contacta con hola@naindev.com por 30€.', 'Contact contact@naindev.com for 30$.'), /literal/);
  assert.doesNotThrow(() => validateTranslation('en⟦0⟧GitHub⟦/0⟧', 'at ⟦0⟧GitHub⟦/0⟧'));
});

test('Nested attributes and noscript content are translated without losing markup', () => {
  const source = '<p>Visita <a href="/servicios/" title="Ver servicios">los servicios</a>.</p><noscript><p>Activa JavaScript.</p></noscript>';
  const segments = extractSegments(parse(source, { scriptingEnabled: false }));
  const values = {
    'Visita ⟦0⟧los servicios⟦/0⟧.': 'Visit ⟦0⟧the services⟦/0⟧.',
    'Ver servicios': 'View services',
    'Activa JavaScript.': 'Enable JavaScript.',
  };
  const catalog = makeCatalog(segments, segments.map(segment => values[segment.source]));
  const html = localizeDocument(source, catalog);
  assert.ok(html.includes('title="View services"'));
  assert.ok(html.includes('<noscript><p>Enable JavaScript.</p></noscript>'));
});

test('Page identity is localized while the publisher and website identities remain shared', () => {
  const source = '<script type="application/ld+json">{"@graph":[{"@type":"WebSite","@id":"https://www.naindev.com/#website","url":"https://www.naindev.com/","inLanguage":"es"},{"@type":"ProfilePage","@id":"https://www.naindev.com/#webpage","url":"https://www.naindev.com/","inLanguage":"es"}]}</script>';
  const html = localizeDocument(source, {});
  assert.ok(html.includes('https://www.naindev.com/en/#webpage'));
  assert.ok(html.includes('https://www.naindev.com/#website'));
  assert.ok(html.includes('"inLanguage":["es-ES","en-US"]'));
});

test('Inline translate=no content remains immutable', () => {
  const source = '<p>Usa <span translate="no">Official Brand</span> ahora.</p>';
  const segments = extractSegments(parse(source));
  assert.equal(segments[0].source, 'Usa ⟦0/⟧ ahora.');
  assert.ok(localizeDocument(source, makeCatalog(segments, ['Use ⟦0/⟧ now.'])).includes('<span translate="no">Official Brand</span>'));
});

test('Mermaid diagram syntax and whitespace are preserved as code', () => {
  const source = '<div class="mermaid">graph LR\n A[Client] --> B[Server]</div>';
  assert.equal(extractSegments(parse(source)).length, 0);
  assert.ok(localizeDocument(source, {}).includes('graph LR\n A[Client] --&gt; B[Server]'));
});

test('Data extraction localizes prose technology labels without changing identifiers or endpoints', () => {
  const source = { id: 'original-id', technologies: ['Modelado de datos'], links: [{ label: 'Abrir demo', url: '/demo/' }] };
  const result = mapData(source, value => ({ 'Modelado de datos': 'Data modeling', 'Abrir demo': 'Open demo' })[value]);
  assert.deepEqual(result, { id: 'original-id', technologies: ['Data modeling'], links: [{ label: 'Open demo', url: '/demo/' }] });
});

test('Project load failure renders a localized recovery link', async () => {
  const { renderProjectError } = await import('../public/assets/js/project-view.js');
  const originalDocument = globalThis.document;
  globalThis.document = {
    getElementById: () => ({ textContent: JSON.stringify({ projectError: 'Projects could not be loaded.', openGitHub: 'Open GitHub' }) }),
    createElement: () => ({ children: [], append(child) { this.children.push(child); } }),
  };
  try {
    let notice;
    let busy;
    renderProjectError({ replaceChildren(value) { notice = value; }, setAttribute(key, value) { busy = [key, value]; } });
    assert.equal(notice.textContent, 'Projects could not be loaded.');
    assert.equal(notice.children[0].href, 'https://github.com/Nain9Dev');
    assert.deepEqual(busy, ['aria-busy', 'false']);
  } finally { globalThis.document = originalDocument; }
});

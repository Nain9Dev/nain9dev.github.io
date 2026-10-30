// Guards for the contact page (owner decision of 2026-10-30, specs/next-design-fusion DF-024): /contacto/ and
// /en/contact/ offer the three ways to reach the owner, with the texts the owner approved, the address kept out of the
// markup (MAIL-006) and no WhatsApp link (B-014 and OQ-014 are open). Runs after the build.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { englishPath } from './lib/localization.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');

test('DF-024: the page exists in both languages, is indexable and is in the sitemap', async () => {
  assert.equal(englishPath('/contacto/'), '/en/contact/');
  for (const file of ['dist/contacto/index.html', 'dist/en/contact/index.html']) assert.ok(existsSync(join(ROOT, file)), file);
  const page = await read('dist/contacto/index.html');
  assert.doesNotMatch(page, /name="robots"[^>]*noindex/i);
  assert.match(page, /<link rel="canonical" href="https:\/\/www\.naindev\.com\/contacto\/"/);
  const sitemap = await read('dist/sitemap-0.xml');
  assert.match(sitemap, /<loc>https:\/\/www\.naindev\.com\/contacto\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/www\.naindev\.com\/en\/contact\/<\/loc>/);
  assert.equal((page.match(/<h1[\s>]/g) ?? []).length, 1, 'one H1');
});

test('DF-024: the approved texts, three ways to reach the owner and nothing else', async () => {
  const text = (html) => html.match(/<main[\s\S]*?<\/main>/)?.[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ') ?? '';
  const es = text(await read('dist/contacto/index.html'));
  for (const sentence of [
    'Una llamada de 30 minutos para ver tu caso',
    'Si hay encaje, hablamos de alcance y presupuesto. Si no, te lo digo en la misma llamada.',
    'acepto proyectos a tiempo parcial y en remoto para empresas de cualquier país.',
    'No hay tarifas publicadas: dependen del alcance y se hablan en la llamada.',
    'Eliges hueco en el calendario y recibes el enlace de la videollamada.',
    'Si prefieres escribir con calma o adjuntar un diagrama.',
    'Para ver la trayectoria o escribir por mensaje privado.',
  ]) assert.ok(es.includes(sentence), sentence);
  const en = text(await read('dist/en/contact/index.html'));
  assert.match(en, /A 30-minute call to look at your case/);
  assert.match(en, /Schedule a free call/, 'the site-wide English wording of the call button');
  assert.match(en, /Copy email/);
});

test('DF-024: the call, the copy button and LinkedIn are there; no address, no mailto, no WhatsApp', async () => {
  for (const file of ['dist/contacto/index.html', 'dist/en/contact/index.html']) {
    const page = await read(file);
    assert.match(page, /href="https:\/\/calendly\.com\/aitornainmendozavallejo-ksez\/30min"[^>]*target="_blank"/, `${file}: the call`);
    assert.match(page, /data-copy-email[^>]*data-email-user="contact"[^>]*data-email-domain="naindev\.com"/, `${file}: the copy button`);
    assert.match(page, /href="https:\/\/www\.linkedin\.com\/in\/aitor-nain-mendoza-vallejo\/"/, `${file}: LinkedIn`);
    assert.doesNotMatch(page, /contact@naindev\.com|href="mailto:/, `${file}: the address stays out of the markup (MAIL-006)`);
    assert.doesNotMatch(page, /wa\.me|whatsapp/i, `${file}: no WhatsApp`);
  }
  const source = await read('src/pages/contacto/index.astro');
  assert.match(source, /import '\.\.\/\.\.\/styles\/inner\.css';/);
  assert.match(source, /data-calendly-track="contacto"/);
});

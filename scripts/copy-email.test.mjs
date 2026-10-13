// Guards for specs/023-copy-email-button.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const ADDRESS = 'contact@naindev.com';

test('MAIL-005: the copy button copies the public contact address', async () => {
  const { initializeEmailCopy } = await import('../src/scripts/site-interactions.js');
  const runtime = { textContent: JSON.stringify({ copySuccess: 'copied', copyError: 'error', copyUnavailable: 'unavailable' }) };
  let listener = null;
  let copied = null;
  const button = {
    dataset: { emailUser: 'contact', emailDomain: 'naindev.com' },
    addEventListener: (type, fn) => { listener = fn; },
    removeEventListener() {}
  };
  const status = { textContent: '' };
  const saved = { document: globalThis.document, window: globalThis.window, navigator: Object.getOwnPropertyDescriptor(globalThis, 'navigator') };
  globalThis.document = { getElementById: (id) => (id === 'localized-ui' ? runtime : null) };
  globalThis.window = {};
  Object.defineProperty(globalThis, 'navigator', {
    value: { clipboard: { writeText: async (text) => { copied = text; } } },
    configurable: true
  });
  try {
    initializeEmailCopy({ button, status });
    assert.equal(typeof listener, 'function');
    await listener();
    assert.equal(copied, ADDRESS);
    assert.equal(status.textContent, 'copied');
  } finally {
    globalThis.document = saved.document;
    globalThis.window = saved.window;
    if (saved.navigator) Object.defineProperty(globalThis, 'navigator', saved.navigator);
  }
});

test('MAIL-006: the contact section keeps the address out of plain text', async () => {
  const section = await readFile('src/components/home/ContactSection.astro', 'utf8');
  assert.match(section, /data-copy-email[^>]*data-email-user="contact"[^>]*data-email-domain="naindev\.com"/);
  assert.ok(!section.includes(ADDRESS), 'the full address must not appear in the markup');
});

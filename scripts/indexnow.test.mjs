import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { buildIndexNowPayload, INDEXNOW_KEY, sitemapUrls } from './lib/indexnow.mjs';

const urls = ['https://www.naindev.com/', 'https://www.naindev.com/en/', 'https://www.naindev.com/blog/a/'];

test('the payload names the host, the key and where the key file lives (DISC-012)', () => {
  const payload = buildIndexNowPayload(urls);
  assert.equal(payload.host, 'www.naindev.com');
  assert.equal(payload.key, INDEXNOW_KEY);
  assert.equal(payload.keyLocation, `https://www.naindev.com/${INDEXNOW_KEY}.txt`);
  assert.deepEqual(payload.urlList, urls);
});

test('URLs of another host are rejected, because the key only proves ownership of this host', () => {
  assert.throws(() => buildIndexNowPayload([...urls, 'https://mcp.naindev.com/']), /host/i);
});

test('an empty list and a list over the protocol limit are rejected', () => {
  assert.throws(() => buildIndexNowPayload([]), /no URLs/i);
  assert.throws(() => buildIndexNowPayload(Array.from({ length: 10_001 }, (_, i) => `https://www.naindev.com/p${i}/`)), /10000/);
});

test('the key follows the IndexNow format and its file is published with the same content (DISC-013)', async () => {
  assert.match(INDEXNOW_KEY, /^[a-zA-Z0-9-]{8,128}$/);
  const files = (await readdir('public')).filter(file => file === `${INDEXNOW_KEY}.txt`);
  assert.deepEqual(files, [`${INDEXNOW_KEY}.txt`]);
  assert.equal((await readFile(`public/${INDEXNOW_KEY}.txt`, 'utf8')).trim(), INDEXNOW_KEY);
});

test('sitemapUrls reads every <loc> once', () => {
  const xml = '<urlset><url><loc>https://www.naindev.com/</loc></url><url><loc>https://www.naindev.com/en/</loc></url><url><loc>https://www.naindev.com/</loc></url></urlset>';
  assert.deepEqual(sitemapUrls(xml), ['https://www.naindev.com/', 'https://www.naindev.com/en/']);
});

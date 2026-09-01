import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const readPngSize = (buffer, label) => {
  const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  assert(buffer.subarray(0, 8).equals(pngSignature), `${label} must be a PNG file`);
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
};

const faviconPng = await readFile('public/favicon-96x96.png');
assert.deepEqual(readPngSize(faviconPng, 'favicon-96x96.png'), { width: 96, height: 96 });

const appleTouchIcon = await readFile('public/apple-touch-icon.png');
assert.deepEqual(readPngSize(appleTouchIcon, 'apple-touch-icon.png'), { width: 180, height: 180 });

const ico = await readFile('public/favicon.ico');
assert.equal(ico.readUInt16LE(0), 0, 'favicon.ico reserved field must be zero');
assert.equal(ico.readUInt16LE(2), 1, 'favicon.ico must use the icon resource type');
const iconCount = ico.readUInt16LE(4);
assert(iconCount >= 4, 'favicon.ico must contain at least four embedded sizes');

const icoSizes = new Set();
for (let index = 0; index < iconCount; index += 1) {
  const entryOffset = 6 + index * 16;
  const width = ico[entryOffset] || 256;
  const height = ico[entryOffset + 1] || 256;
  assert.equal(width, height, 'Every ICO image must be square');
  icoSizes.add(width);
}
assert.deepEqual([...icoSizes].sort((a, b) => a - b), [16, 32, 48, 64]);

const layout = await readFile('src/layouts/BaseLayout.astro', 'utf8');
assert.match(layout, /rel="icon" type="image\/png" sizes="96x96" href="\/favicon-96x96\.png"/);
assert.match(layout, /rel="icon" type="image\/x-icon" href="\/favicon\.ico"/);
assert.match(layout, /rel="apple-touch-icon" sizes="180x180" href="\/apple-touch-icon\.png"/);
assert.doesNotMatch(layout, /apple-touch-icon[^>]+\.svg/);

const header = await readFile('src/components/Header.astro', 'utf8');
assert.match(header, /<Image[^>]+\bpriority\b[^>]*\/>/s);

console.log('Brand icon contract passed.');

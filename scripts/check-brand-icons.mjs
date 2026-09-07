import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';

const checkFraming = async (input, label) => {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, info.height, `${label} must be square`);
  const size = info.width;
  const bounds = { left: size, top: size, right: -1, bottom: -1 };
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (data[(y * size + x) * 4 + 3] < 32) continue;
      bounds.left = Math.min(bounds.left, x);
      bounds.top = Math.min(bounds.top, y);
      bounds.right = Math.max(bounds.right, x);
      bounds.bottom = Math.max(bounds.bottom, y);
      assert(Math.hypot(x + 0.5 - size / 2, y + 0.5 - size / 2) < size / 2,
        `${label} clips the mark when displayed in a circle at (${x}, ${y})`);
    }
  }
  const margins = [bounds.left, bounds.top, size - 1 - bounds.right, size - 1 - bounds.bottom];
  assert(margins.every(margin => margin >= Math.floor(size * 0.15)), `${label} needs at least 15% clear space`);
  assert(bounds.right - bounds.left + 1 >= size * 0.6, `${label} mark is too small`);
  assert(Math.abs(bounds.left - margins[2]) <= 1 && Math.abs(bounds.top - margins[3]) <= 1,
    `${label} mark must be centered`);
};

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
await checkFraming(faviconPng, 'favicon-96x96.png');

const appleTouchIcon = await readFile('public/apple-touch-icon.png');
assert.deepEqual(readPngSize(appleTouchIcon, 'apple-touch-icon.png'), { width: 180, height: 180 });
await checkFraming(appleTouchIcon, 'apple-touch-icon.png');

const svg = await readFile('public/assets/images/favicon-optimized.svg');
await checkFraming(await sharp(svg).resize(96, 96).png().toBuffer(), 'SVG favicon');
for (const [input, size, label] of [[faviconPng, 96, 'PNG favicon'], [appleTouchIcon, 180, 'Apple touch icon']]) {
  const expected = await sharp(svg).resize(size, size).ensureAlpha().raw().toBuffer();
  const actual = await sharp(input).ensureAlpha().raw().toBuffer();
  assert(actual.equals(expected), `${label} must match the SVG mark`);
}

const ico = await readFile('public/favicon.ico');
const declaredIco = await readFile('public/favicon-naindev.ico');
assert(ico.equals(declaredIco), 'The conventional and declared ICO files must match');
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
  const length = ico.readUInt32LE(entryOffset + 8);
  const offset = ico.readUInt32LE(entryOffset + 12);
  assert(offset >= 6 + iconCount * 16 && offset + length <= ico.length, 'ICO payload must fit its container');
  const frame = ico.subarray(offset, offset + length);
  assert.deepEqual(readPngSize(frame, `ICO ${width}px frame`), { width, height });
  await checkFraming(frame, `ICO ${width}px frame`);
  const expected = await sharp(svg).resize(width, height).ensureAlpha().raw().toBuffer();
  const actual = await sharp(frame).ensureAlpha().raw().toBuffer();
  assert(actual.equals(expected), `ICO ${width}px frame must match the SVG mark`);
  icoSizes.add(width);
}
assert.deepEqual([...icoSizes].sort((a, b) => a - b), [16, 32, 48, 64]);

const layout = await readFile('src/layouts/BaseLayout.astro', 'utf8');
assert.match(layout, /rel="icon" type="image\/png" sizes="96x96" href="\/favicon-96x96\.png"/);
assert.match(layout, /rel="icon" type="image\/x-icon" href="\/favicon-naindev\.ico"/);
assert.match(layout, /rel="apple-touch-icon" sizes="180x180" href="\/apple-touch-icon\.png"/);
assert.match(layout, /rel="icon" type="image\/svg\+xml" sizes="any" href="\/assets\/images\/favicon-optimized\.svg"/);
assert.doesNotMatch(layout, /apple-touch-icon[^>]+\.svg/);

const header = await readFile('src/components/Header.astro', 'utf8');
assert.match(header, /<Image[^>]+\bpriority\b[^>]*\/>/s);

console.log('Brand icon contract passed: PNG, touch icon, SVG and four ICO frames fit a circular mask.');

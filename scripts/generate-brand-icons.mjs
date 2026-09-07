import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const source = await readFile('public/assets/images/favicon-optimized.svg');
const render = size => sharp(source).resize(size, size).png().toBuffer();

await writeFile('public/favicon-96x96.png', await render(96));
await writeFile('public/apple-touch-icon.png', await render(180));

const sizes = [16, 32, 48, 64];
const frames = await Promise.all(sizes.map(render));
const directory = Buffer.alloc(6 + 16 * frames.length);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(frames.length, 4);
let offset = directory.length;
frames.forEach((frame, index) => {
  const entry = 6 + index * 16;
  directory[entry] = sizes[index];
  directory[entry + 1] = sizes[index];
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(frame.length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += frame.length;
});
const ico = Buffer.concat([directory, ...frames]);
await writeFile('public/favicon.ico', ico);
await writeFile('public/favicon-naindev.ico', ico);
console.log('Generated stable PNG and ICO assets from the NainDev SVG.');

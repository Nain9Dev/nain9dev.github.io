// Icons of the installed site (specs/next-pwa-install, INS-003 to INS-005), rendered from the brand mark.
// generate-brand-icons.mjs writes them and check-brand-icons.mjs compares the committed files with this output.
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';

const MARK_SOURCE = 'public/assets/images/favicon-optimized.svg';

// The round caps of the mark reach 55% of the tile's half-diagonal at scale 1. At .66 they end at 36% of the
// width from the centre, inside the 40% circle a launcher is allowed to crop a maskable icon to.
const MASKABLE_MARK_SCALE = '.66';

/** The mark on a square tile with no rounded corners, scaled into the maskable safe zone. */
export const maskableSvg = (svg) => {
  const square = svg.replace(/(<rect\b[^>]*?)\srx="[^"]*"/, '$1');
  const scaled = square.replace(/scale\([^)]*\)/, `scale(${MASKABLE_MARK_SCALE})`);
  if (square === svg || scaled === square) {
    throw new Error(`${MARK_SOURCE} no longer has the rounded tile and the scaled mark the maskable icon is derived from`);
  }
  return scaled;
};

const render = (svg, size) => sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();

/** Every install icon as `{ path, size, purpose, png }`, in the order the manifest declares them. */
export const installIcons = async () => {
  const svg = await readFile(MARK_SOURCE, 'utf8');
  return [
    { path: 'public/icons/icon-192.png', size: 192, purpose: 'any', png: await render(svg, 192) },
    { path: 'public/icons/icon-512.png', size: 512, purpose: 'any', png: await render(svg, 512) },
    { path: 'public/icons/icon-maskable-512.png', size: 512, purpose: 'maskable', png: await render(maskableSvg(svg), 512) },
  ];
};

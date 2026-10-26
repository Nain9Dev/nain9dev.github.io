"""256-colour PNGs that keep the brand accents.

Plain median cut over a whole capture turns the small, saturated areas (the #80FF00 strokes, the cobalt
buttons) into the nearest large cluster, so green can come out olive or orange. The palette here is 192
median-cut entries for the whole image plus 64 median-cut entries taken from the saturated pixels only;
every pixel maps to its nearest entry, without dithering. No metadata is written.

Usage: python3 tools/lib/quantise.py <folder>   (every *.png under it, in place)
"""
import pathlib
import sys

import numpy as np
from PIL import Image


def quantise(im, base_n=192, accent_n=64):
    im = im.convert('RGB')
    a = np.asarray(im)
    mx = a.max(2).astype(int)
    mn = a.min(2).astype(int)
    mask = ((mx - mn) / np.maximum(mx, 1) > 0.35) & (mx > 60)
    pal = im.quantize(base_n).getpalette()[:base_n * 3]
    acc = a[mask]
    if len(acc):
        strip = Image.fromarray(np.ascontiguousarray(acc.reshape(1, -1, 3)))
        pal += strip.quantize(accent_n).getpalette()[:accent_n * 3]
    pal += [0, 0, 0] * (256 - len(pal) // 3)
    p = np.array(pal[:768], dtype=np.int32).reshape(256, 3)
    flat = a.reshape(-1, 3)
    uniq, inv = np.unique(flat, axis=0, return_inverse=True)
    idx = np.empty(len(uniq), dtype=np.uint8)
    u = uniq.astype(np.int32)
    for s in range(0, len(u), 4096):
        d = ((u[s:s + 4096, None, :] - p[None, :, :]) ** 2).sum(2)
        idx[s:s + 4096] = d.argmin(1)
    out = Image.fromarray(idx[inv.reshape(-1)].reshape(a.shape[:2]), 'P')
    out.putpalette(pal[:768])
    return out


if __name__ == '__main__':
    for f in pathlib.Path(sys.argv[1]).rglob('*.png'):
        quantise(Image.open(f)).save(f, format='PNG', optimize=True)

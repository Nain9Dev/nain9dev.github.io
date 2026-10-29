# NainDev brand kit

Source files of the NainDev identity, delivered by David (Contrast3D) on 2026-10-29. This folder is the single
place to look for a logo, a wordmark or a banner. Nothing here is published: the site copies what it needs into
`public/` or `src/`, and a guard (`scripts/design-brand-kit.test.mjs`) keeps it that way.

## Contents

`source/` holds the files exactly as delivered. Do not edit them; add a new file when David sends a new version.

| File | What it is |
| :--- | :--- |
| `source/favicon-deep.svg` | Isotype in green on the deep blue tile (1000 box, rounded corners). Used by the site favicon. |
| `source/favicon-paper.svg` | Isotype in brand blue on the paper tile. |
| `source/solid-black.png` | Isotype, black, 1000 px. |
| `source/solid-blue.png` | Isotype, brand blue, 480 px. |
| `source/solid-white.png` | Isotype, white, 480 px. |
| `source/full-black.png` | Isotype with a transparent field, black, 480 px. |
| `source/full-white.png` | Isotype with a transparent field, white, 480 px. |
| `source/wordmark-blue.png` | "NAINDEV" in brand blue, 423 x 38 px raster. |
| `source/wordmark-green.png` | "NAINDEV" in green, 423 x 38 px raster. |
| `source/wordmark-white.png` | "NAINDEV" in white, 423 x 38 px raster. |
| `source/aitor-linkedin-banner2x.png` | Personal LinkedIn banner, 3168 x 792 px (4:1, 2x of 1584 x 396). The left side stays dark and empty where the profile photo sits. |

`demos/` holds four animated captures David made for the Contrast3D products (`demo-contrast-hub.gif`,
`demo-contrast-viewer.gif`, `demo-dse.gif`, `demo-viewer-standard.gif`). They are source material, 1 to 6 MB each,
and are not served by the site.

`wordmark-green.svg`, `wordmark-blue.svg` and `wordmark-white.svg` are the vector wordmark (see Wordmark).

## Colours

| Role | Value |
| :--- | :--- |
| Green (mark on dark) | `#80FF00` |
| Brand blue (mark on paper) | `#0047AB` |
| Deep blue (tile, footer band) | `#002B66` |
| Paper (light tile) | `#EDF1F6` |
| White | `#FFFFFF` |

On the site the colours live as tokens in `src/styles/main.css`; do not copy literals from here.

## Rules

- The isotype is three round-capped strokes (`M148 148V848M308 288L686 738M848 148V848`, width 113, in a 1000 box).
  Never redraw, rotate, outline or add effects.
- Green goes on the deep blue, brand blue goes on paper, white goes on photographs and dark bands.
- The wordmark is published only as a vector (DF-005 in `specs/next-design-fusion`); the PNGs are references.
- Below 24 px high use the isotype alone.
- Social avatars are generated from the isotype and kept outside the repository (see the presence notes).

## Wordmark

David delivered the wordmark only as three 423 x 38 px PNGs. The SVGs here are rebuilt from them with plain
geometry (no font, no trace): seven upright stems of 4.9 px, bars of 3.4 px, diagonals of 4.5 to 4.6 px, a D made of
two bezier outlines, and a single clip to the cap height. The rebuild overlaps the delivered raster by more than
90% of the opaque pixels at the raster size (the rest is anti-aliasing), and the guard checks it for the three
colours. It is a faithful reproduction, not David's original file. When David sends the original vector, put it in
`source/`, replace the three SVGs and keep the guard.

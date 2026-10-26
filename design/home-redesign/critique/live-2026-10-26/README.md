# Before captures: naindev.com as published on 2026-10-26

These screenshots show the production site before the round 4 redesign. They cover the Spanish home (`/`) one viewport at a time, plus the first screen of `/servicios/`, `/blog/` and `/servicios/validacion-3d/`. They were taken on 2026-10-26.

## Source

- The session's network policy denied `www.naindev.com`, so these pages were **not** fetched from the live site. They come from a **local build of `origin/main` at `0419dfc5385996804c06696824a0ce81f4e0d387`** ("feat(design): micro-interactions on pills, toggles and the language switcher (#31)").
- That is the commit the latest deploy published: GitHub Actions run [40337573313](https://github.com/Nain9Dev/nain9dev.github.io/actions/runs/40337573313), "Deploy Astro site to GitHub Pages" #154, a push to `main`. It started at 2026-10-26 14:13:05Z, finished at 14:15:47Z and concluded `success`.
- Build steps: `npm ci`, then `npm run build` (`astro build && node scripts/build-locales.mjs`), with Node 22.22.0. `package.json` asks for Node >=24, but npm only printed an engine warning. No build step needed the network. `dist/` was served by `python3 -m http.server` on 127.0.0.1:8811.
- The browser blocked every request to another host. The only one the pages made was the `plausible.io` analytics script, so nothing visible depends on other hosts.

## How the captures were made

- **Browser:** Playwright Chromium 153 (headless), `deviceScaleFactor: 1`, locale `es-ES`.
- **Viewports:** 1440×900 for desktop, 390×844 for phone (`isMobile` and `hasTouch` set).
- **Themes:**
  - `dark` uses `colorScheme: 'dark'` with no stored choice, which is the site default.
  - `light` uses `colorScheme: 'light'` plus `localStorage.theme = 'light'`. The head script turns that into `html[data-theme="light"]`.
  - Body colours were checked in each theme: `rgb(7, 11, 22)` in dark, `rgb(237, 241, 246)` in light.
- **Performance mode:**
  - The site's probe (`src/scripts/hardware-acceleration.js`) treats the headless SwiftShader renderer as software and sets `html.low-performance`. That hides the WebGL hero, turns off reveal-on-scroll and softens the card shadows.
  - At 1440 the renderer name was hidden from the probe, so the page took the `high-performance` path that a desktop with a GPU gets: the WebGL wireframe, the reveals and the rail pulse. The page stayed on that path on every screen.
  - At 390 the site's own head script sets `low-performance` for any viewport narrower than 768 px. Real phones get the same treatment.
- **Method:**
  1. Load the page and wait for the network to go idle.
  2. Scroll through the whole page once, so the `content-visibility: auto` sections take their real height.
  3. Go back to the top. Scroll one viewport height, wait 700 ms, take a screenshot of the viewport, and repeat to the end.
  - The last screen stops at the bottom of the page, so it overlaps the one before it (366 px at 1440, 47 px at 390).
  - The sticky header is in every screen.
  - The privacy notice appears as it does for a first-time visitor: a corner card in screen 01 on desktop, and a block at the end of the page on phones.
- **Files:**
  - `home/NN-<width>-<theme>.png`: 19 screens per theme at 1440 and 31 per theme at 390, so 100 files.
  - `inner/<page>-<width>-<theme>.png`: 12 files.
- **Compression:**
  - Every PNG has 256 colours and no metadata. Total size is 8.1 MB: 7,003,569 bytes for `home/` and 1,108,645 bytes for `inner/`.
  - Plain Pillow median cut (`convert('RGB').quantize(256)`) shifted the accent colours. The green spine (#80ff00) came out orange and the cyan in the logo came out teal.
  - So the palette here is 192 median-cut entries plus 64 entries taken from the saturated pixels only. Each pixel maps to its exact nearest entry, with no dithering.

## Page heights

| Page | Viewport | Height at load (px) | Height once every section has rendered (px) | Screens |
|---|---|---:|---:|---:|
| Home `/` | 1440×900, dark and light | 12,899 | **16,734** | 19 (18.6 viewports) |
| Home `/` | 390×844, dark and light | 12,372 | **26,117** | 31 (30.9 viewports) |
| `/servicios/` | 1440 / 390 | 4,125 / 5,472 | 3,931 / 6,600 | first screen only |
| `/blog/` | 1440 / 390 | 2,598 / 5,713 | 2,577 / 5,864 | first screen only |
| `/servicios/validacion-3d/` | 1440 / 390 | 1,655 / 2,191 | 1,655 / 2,191 | first screen only |

The height at load is an estimate. Sections that have not rendered yet count as `contain-intrinsic-size: auto 900px` (`main > .section:not(.hero)`, PERF-008). The real height appears once a visitor has scrolled past them. The dark and light layouts are identical to the pixel.

## Home sections at 1440×900

The vertical positions are page coordinates and include the 97 px sticky header. Screen *n* starts at scrollY = (n−1)×900; screen 19 starts at 15,834.

| Section | Start (px) | End (px) | Height (px) | Viewports | Screens |
|---|---:|---:|---:|---:|---|
| Hero (`.hero`) | 97 | 971 | 874 | 0.97 | 01–02 |
| Live demos strip (`.live-demos`) | 971 | 1,496 | 525 | 0.58 | 02 |
| Terminal (`#terminal`) | 1,496 | 2,158 | 662 | 0.74 | 02–03 |
| Proof strip (`.proof-strip`) | 2,158 | 2,284 | 127 | 0.14 | 03 |
| Services (`#services`) | 2,284 | 3,202 | 918 | 1.02 | 03–04 |
| Tech stack (`#tech-stack`) | 3,202 | 4,256 | 1,053 | 1.17 | 04–05 |
| Free resource call to action (`#impact-metrics`) | 4,256 | 4,798 | 542 | 0.60 | 05–06 |
| **Projects catalog (`#projects`, 22 cards, 2 columns)** | 4,798 | 13,109 | **8,312** | **9.24** | 06–15 |
| Open ecosystem (`#open-ecosystem`) | 13,109 | 13,740 | 631 | 0.70 | 15–16 |
| Method (`#method`) | 13,740 | 14,697 | 956 | 1.06 | 16–17 |
| About (`#about`) | 14,697 | 15,194 | 497 | 0.55 | 17 |
| Partnership (`#partnership`) | 15,194 | 15,928 | 735 | 0.82 | 17–19 |
| Contact (`#contact`) | 15,928 | 16,454 | 525 | 0.58 | 18–19 |
| Footer | 16,454 | 16,734 | 280 | 0.31 | 19 |

At 390×844 the projects catalog runs from 6,240 to 20,392 px. That is 14,152 px, or 16.8 phone screens (screens 08–25) out of 31.

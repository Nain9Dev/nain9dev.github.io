# Plan: Low-end device performance

## Baseline (production, 2026-10-13, Lighthouse 13, headless Chrome)

| Profile | Score | FCP | LCP | Speed Index | TBT | Weight | Requests |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile (default throttling) | 76 | 2.8 s | 4.5 s | 5.0 s | 0 ms | 469 KiB | 43 |
| Desktop preset | 99 | 0.4 s | 0.9 s | 0.7 s | 0 ms | 625 KiB | — |

Mobile LCP element: `p.hero-summary`; 2.5 s of element render delay. Render-blocking estimate: 1.34 s (three stylesheets plus the Cloudflare email decoder).

## Findings and fixes

| Finding | Evidence | Fix | Requirement |
| :--- | :--- | :--- | :--- |
| `inter-300…800.woff2` share one MD5, as do `outfit-*`; twelve `@font-face` rules point at them | `md5sum`; eight font downloads, about 347 KiB, on the home page | One variable `@font-face` per family (`font-weight: 300 800`), files `src/assets/fonts/inter-var.woff2` and `outfit-var.woff2` hashed by Vite; preload URLs come from `?url` imports; delete duplicates and the unused `public/assets/fonts/fonts.css` | PERF-001, PERF-002 |
| `app.js` imports `locale.js?v=019` and `site-interactions.js?v=019`; other modules import them without `?v=`; three-level request waterfall | Resource timing shows both URLs | Move `public/assets/js/*.js` (except `three.module.min.js`) to `src/scripts/`; import them from processed Astro `<script>` blocks | PERF-003 |
| `main.css`, `terminal.css` and `locales.css` are three render-blocking, unminified requests versioned by hand | 42 KiB raw; Lighthouse render-blocking estimate 1.34 s | Import all three from `src/styles/` in `BaseLayout.astro` (one hashed stylesheet); `build-locales.mjs` no longer injects `locales.css` | PERF-004 |
| Head script creates a WebGL context before first paint | `BaseLayout.astro` inline script | Head keeps cheap checks only and adds `low-performance` when they fail; `hasHardwareAcceleration()` runs the WebGL probe when no class is set | PERF-005 |
| Hero copy carries `data-reveal` (opacity 0 until IntersectionObserver) | `Hero.astro` | Remove `data-reveal` from above-the-fold hero blocks | PERF-006 |
| `.availability::before` animates `box-shadow` forever on every device | `main.css` `availability-pulse` | Pulse a pseudo-element ring with `transform` and `opacity`; disable in low-performance | PERF-007 |
| No rendering skip for off-screen sections | — | `content-visibility: auto; contain-intrinsic-size: auto 900px` on home sections after the hero | PERF-008 |
| Logo served at 1600×400, rendered at most about 4.2rem tall | `naturalWidth` 1600 | `Image` with `widths`/`sizes` matching the rendered size | PERF-009 |
| `public/_headers` is ignored by GitHub Pages; assets get `max-age=14400`, HTML 600 | `curl -I` | Cloudflare Cache Rule (B-016) | PERF-010 |

## Design notes

- Bundled scripts: Astro hoists processed `<script>` blocks into one module per page and dedupes shared imports. With `ClientRouter`, module scripts run once; `app.js` already re-initialises on `astro:after-swap`, so behaviour is unchanged.
- Three.js: moved to `src/vendor/` and imported with `?url`, so Vite emits it unmodified under a hashed name; the dynamic import uses that URL (`/* @vite-ignore */`). Bundling it as a chunk was rejected because the minifier strips the MIT notice.
- The WebGL probe and the 3D renderer request `powerPreference: 'low-power'`, so a decorative scene does not wake a discrete laptop GPU.
- The `manualChunks` rule in `astro.config.mjs` is removed: it matched any module id containing `three`, which would have placed `three-hero.js` in the Three.js chunk.
- The project catalog fetch uses `cache: 'no-cache'` instead of `?v=` so cached data never outlives the bundle (the skew fixed in commit 9c6473d).
- Inline module scripts in `checklist-ia.astro` and `blog/[...slug].astro` that import `/assets/js/locale.js` become processed scripts importing `src/scripts/locale.js`.
- Tests that import modules from `public/assets/js/` are repointed to `src/scripts/`.

## Verification

1. `scripts/performance.test.mjs` asserts PERF-001 to PERF-009 against sources and `dist/`.
2. `npm run check` passes.
3. Lighthouse mobile and desktop against `astro preview` of the production build; results recorded in `tasks.md`.
4. After deploy (owner), the production home page is re-measured.

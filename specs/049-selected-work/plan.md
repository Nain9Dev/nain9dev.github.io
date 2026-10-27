# Implementation plan: Selected work and home narrative

Status: Draft

## Shape of the change

One branch (`feat/selected-work`), one pull request, six tasks in order, each verified before the next. Everything is static Astro and CSS; no JavaScript is added, no dependency.

### Data

`public/assets/data/projects.json`: the four featured entries gain a `story` object (`problem`, `approach`, `result`). Nothing else in the file changes, so the catalog, the live-demo strip, the `ItemList` and the English catalog entries keep their inputs.

### Components

- New `src/components/home/SelectedWork.astro`: reads `projects.json`, filters `featured` entries with an own-domain demo (same `isOwnDemo` test as `LiveDemos.astro`, moved to `src/utils/projects.ts` so both share it), sorts by `order`, renders `<section id="selected-work" class="section">` with the heading block and an ordered list of `<article class="case">`. Each case: `<figure class="case-media">` with the 640 px capture, and `<div class="case-body">` with eyebrow, H3, `<dl class="case-story">`, chips and links. The first case's image is `loading="eager" fetchpriority="high"`; the others lazy.
- `src/pages/index.astro`: new order (HN-001); `ProofStrip` and `ImpactMetrics` imports removed; `TechStack` rendered inside `ServicesSection` (passed as a slot) or placed directly after it inside the same `<section>`; choose the slot so the section id and heading hierarchy stay valid.
- `src/components/home/AboutSection.astro`: profile links first (IP-009 kept), then the disclosed copy, which now also carries the three proof sentences, then `<details class="quiet terminal-fold"><summary>Terminal interactiva</summary>` wrapping the terminal markup moved from `TerminalSection.astro`. The `<script>` import of `terminal.js` moves with it. `TerminalSection.astro` is deleted.
- `src/components/home/TechStack.astro`: category titles become visually hidden labels (`.sr-only`, already in `main.css`), the container becomes one wrapping row; id `#tech-stack` kept.
- `src/scripts/project-view.js`: card template switches to the row layout (index, title, status, four chips, links, detail disclosure holding summary and proof). The static `catalog-index` fallback keeps its markup.
- `ProofStrip.astro` and `ImpactMetrics.astro` deleted; the `[ImpactMetricsManager]` marker in `performance-build.test.mjs` is removed in the same change.

### CSS (`src/styles/main.css`)

- New block "Selected work": `.case` grid (`grid-template-columns: minmax(0, 1fr) minmax(0, 1fr)` from 60 rem, `.case:nth-child(even) .case-media { order: 2 }`), `.case-media` frame with the token radius and `--color-shadow` solid offset, `.case-story` as a two-column `dl` on wide screens (term in mono label style, definition in body), chips reusing `.chip`, links reusing `.card-link`. Hover and focus scale on the capture only inside `@media (prefers-reduced-motion: no-preference)` and not under `html.low-performance`.
- New block "Catalog rows": `.project-row` replacing the tall `.project-card` rules; the removed rules are listed in `tasks.md` with their byte saving.
- Stack strip: `.tech-stack-container` row rules; the layer-band rules of VS-004 removed.
- `.proof-strip` rules removed; the `content-visibility` block in `performance.test.mjs` that names it is updated to the remaining selectors.
- Measured after each block: `gzip(dist/index.html)` must stay ≤ 30 KiB.

### Localization

New Spanish strings (heading, three terms, "Terminal interactiva", twelve story lines) get reviewed English targets in `src/i18n/en-US.json`; `npm run check:locales` lists any orphan. Existing strings keep their hashes because no sentence is edited.

### Guards

- New `scripts/selected-work.test.mjs` (SW-007), registered in `package.json` `check`.
- Updated in the same change: `portfolio-refresh.test.mjs` (HERO-021 order line becomes SelectedWork → Services → LiveDemos), `storytelling.test.mjs` (section list without `TerminalSection`/`ImpactMetrics`), `home-clarity.test.mjs` (proof sentences now read from `AboutSection.astro`), `performance.test.mjs` (`.proof-strip` dropped from the `content-visibility` list), `claims.test.mjs` (ImpactMetrics read replaced by the checklist page), `post-paint.test.mjs` (terminal read from `AboutSection.astro`), `stack-method.test.mjs` (row layout instead of bands).

### Verification

`npm run check`; `check:budget` on a quiet host; axe in both themes at 1440 and 390; reduced-motion probe; Lighthouse mobile and desktop on `/` and `/en/`; captures before and after with the local capture tool (outside the repository); a keyboard pass over the four cases, the terminal disclosure and the catalog rows.

## Risks

- LCP moves to the first capture: at 640x360 WebP under 30 KB and `fetchpriority="high"` it should stay under 2.5 s on the mobile profile; measured, not assumed (SW-008). If it fails, the first capture becomes `loading="lazy"` too and the hero text stays the LCP element.
- The English build regenerates the home from reviewed segments: every new string must be reviewed before `npm run build` passes (`Missing translation` stops the build).
- The catalog row layout touches `project-view.js`, which the storytelling guard inspects; the guard is updated alongside.

# Specification: Low-end device performance

Status: In progress

## Objective

On 2026-10-13 the owner asked to make www.naindev.com navigate smoothly on low-resource devices. Lighthouse 13 against production on the same day measured mobile performance 76 (FCP 2.8 s, LCP 4.5 s, Speed Index 5.0 s, 469 KiB, 43 requests) and desktop 99. The page ships the same two variable font files under twelve URLs, loads several client modules twice under different specifiers, probes WebGL synchronously before first paint and gates the hero text behind a script-driven reveal. This feature removes that waste, keeps the desktop effects for capable hardware and adds a guard so the regressions cannot return.

Owner decisions (2026-10-13 interview): full scope including bundling client scripts and styles through Astro (ADR-0002); keep the 3D hero, particles, glow and View Transitions, gated by capability; the owner configures the Cloudflare cache rule; Lighthouse may be used locally for measurement, not in CI.

## Functional requirements (EARS)

- **PERF-001**: When a page is rendered, the site shall reference each self-hosted font family through exactly one `@font-face` rule with a weight range and one file, and the font directory shall contain no byte-identical duplicates.
- **PERF-002**: When a page is rendered, the site shall preload only fonts that a stylesheet references.
- **PERF-003**: When client scripts are built, each source module shall be bundled once by Astro into hashed files under `/_astro/`, with no manual `?v=` cache-busting parameter in sources.
- **PERF-004**: When stylesheets are built, they shall be bundled and minified by Astro into at most one hashed stylesheet per page under `/_astro/`.
- **PERF-005**: While the document head is parsed, the site shall not create a WebGL context; the WebGL capability probe shall run only from the deferred client bundle.
- **PERF-006**: When the home page is first painted, the hero text shall be visible without waiting for client JavaScript.
- **PERF-007**: While a decorative animation runs indefinitely, it shall animate only `transform` or `opacity`, and it shall stop in low-performance mode.
- **PERF-008**: When below-the-fold home sections are off screen, the browser shall be allowed to skip their rendering (`content-visibility: auto` with an intrinsic size).
- **PERF-009**: When the header logo is rendered, the served image width shall not exceed twice its largest rendered width.
- **PERF-010**: When a hashed or versioned static asset is served in production, the response shall allow long-term browser caching. (Depends on B-016, owner action.)

## Edge cases and error handling

- Browsers without `content-visibility` support render sections normally.
- If the deferred WebGL probe fails or reports a software renderer, the page switches to `low-performance` after first paint; content stays visible because the low-performance rules only force elements visible.
- Three.js stays a separate, unmodified on-demand file loaded only on capable desktops; it is not part of the main bundle.
- English pages produced by `scripts/build-locales.mjs` reference the same hashed bundles as the Spanish pages.

## Out of scope

- Visual redesign (owned by the designer in `design/home-redesign`).
- Replacing Plausible or the Cloudflare email obfuscation script.
- Lighthouse CI in GitHub Actions.
- Recompressing `og-cover-v2.png` (social preview only, not loaded by pages).

## Acceptance criteria

- `npm run check` passes, including `scripts/performance.test.mjs`.
- Local Lighthouse mobile run against a production build scores at least 90 with LCP under 2.5 s.
- Production home page transfers no duplicate font file and no module twice.

## Session state

- Last updated: 2026-10-13, implementation session
- Done: T01 to T07. PERF-001 to PERF-009 implemented and covered by `scripts/performance.test.mjs` and `scripts/performance-build.test.mjs`; full `npm run check` passes locally. Browser checks on the local build: Spanish and English home, blog share functions, checklist UTM field, SPA navigation back to the home page (catalog, terminal and metrics re-initialise), no console errors besides View Transition aborts in a hidden tab (also present before).
- Verified: local Lighthouse comparison in `tasks.md`.
- Next: T09 (owner commit and deploy), then re-measure production.
- Blocked: PERF-010 waits on B-016 (T08, owner). ADR-0002 is `Proposed`.

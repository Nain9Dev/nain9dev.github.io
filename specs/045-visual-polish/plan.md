# Implementation plan: Visual polish and motion system

Status: Draft (waiting for the direction choice; written for direction B, with the deltas for A and C noted)

## Principles

- Ambitious on the surface, conservative underneath: CSS custom properties, CSS animations and transitions, the Web Animations API only where a sequence needs runtime control, `IntersectionObserver` for reveals, cross-document View Transitions already enabled (ADR-0003). No new runtime dependency.
- Net-zero CSS: every rule added is paid for by a rule removed. The inline stylesheet of the home is 10.2 KiB gzip inside a 22.7 KiB document, 2.8 KiB below the CSS-002 ceiling. Retired effects (particles, blurred glows, the tilt, the mock UI comparison, the case-study card family, duplicated card variants) fund the new system.
- Content frozen: the built HTML of every page, with `<style>` and font URLs stripped, must not change (VP-010). A comparison script runs on every pull request.
- Guards move with their spec: when a value asserted by a test changes (background token, font sizes, font files), the test is updated in the same pull request and the requirement table says why.

## Modules (one pull request each; branches `visual/01-tokens` … `visual/05-polish`)

### PR 1 · Design tokens (`visual/01-tokens`)

- **Files:** `src/styles/main.css` (new `:root` block replacing lines 30–59; every literal colour, radius, shadow, duration and easing in the file rewritten to tokens), `src/styles/terminal.css`, `src/styles/locales.css`, `scripts/performance-build.test.mjs` (the `--color-background` marker), new `scripts/visual-tokens.test.mjs`.
- **Tokens:** colour (`--color-bg`, `--color-bg-raised`, `--color-band`, `--color-ink`, `--color-ink-muted`, `--color-line`, `--color-cobalt`, `--color-cobalt-ink`, `--color-link`, `--color-green`, `--color-red`), type (`--font-display`, `--font-body`, `--font-mono`, `--text-xs` to `--text-3xl` as `clamp()`), space (`--s1` 4 px to `--s32` 128 px, `--section-sm/md/lg`), shape (`--radius` 4 px, `--radius-pill`), elevation (`--shadow-raised` solid 8 px cobalt, `--shadow-panel` 12/22 px), motion (`--dur-fast` 120 ms, `--dur-base` 200 ms, `--dur-slow` 480 ms, `--ease-standard`, `--ease-out-quart`, `--stagger` 60 ms).
- **Also here:** retire `--color-secondary` as an alias, remove the orange literals, unify the three greens, remove `transition: all`.
- **Covers:** VP-001, VP-002 (scale declared), VP-011.
- **Test:** `visual-tokens.test.mjs` asserts no hex literal outside the `:root` block, no `transition: all`, one radius token used by every card selector, the fluid scale ratio at 320 px and 1440 px computed from the clamp terms.
- **Direction A delta:** light tokens, `color-scheme: light`, social image and favicon review moved into PR 1. **Direction C delta:** radius 0, shadows none, `h1` guard in `portfolio-refresh.test.mjs` raised with the spec.

### PR 2 · Hero and navigation (`visual/02-hero-nav`)

- **Files:** `src/components/Header.astro` (a disclosure button for the mobile menu; links unchanged), `src/components/home/Hero.astro` (wrapper classes for the compose sequence only; text unchanged; the emoji badges get an inline SVG icon with the emoji kept in a visually hidden span so the text is unchanged — to confirm against VP-010, otherwise the emoji stay), `src/scripts/site-interactions.js` (header shrink state, menu toggle with `aria-expanded`, Escape to close, focus return), `src/scripts/hero-scene.js` (canvas fade-in class after the first frame; geometry untouched), `src/scripts/ambient-glow.js` (unchanged; CSS consumer changes to the grid mask), `src/scripts/app.js` (particles removed from the idle queue — `post-paint.test.mjs` PERF-015 list updated in the same change), `src/scripts/particles.js` deleted.
- **Covers:** VP-005, VP-009, half of VP-006.
- **Tests:** `hero-compose.test.mjs`: the hero animation classes live under `prefers-reduced-motion: no-preference`; the hero HTML contains the title text outside any element with `opacity: 0`; `Header.astro` has a `<button aria-expanded aria-controls>` below 42 rem; `app.js` no longer imports `particles.js`.
- **Risk:** the header menu is the one structural markup change; it adds a button, not a link, so VP-010 holds (buttons are excluded from the content diff by design and listed in the PR).

### PR 3 · Cards, grids and skills (`visual/03-cards`)

- **Files:** `src/styles/main.css` (one `.card` system applied to service, project, live-demo, blog, pain and tech-badge selectors; the catalog index and case-study families are folded into it), `src/scripts/project-view.js` (inline `transitionDelay` removed; stagger from CSS `:nth-child` up to 12 then a cap), `src/scripts/card-tilt.js` deleted and removed from the idle queue, `src/scripts/project-filters.js` (filtering fades the grid in place without scale), `src/scripts/tech-stack.js` deleted (dead code; `english-standardization.test.mjs` list updated), `src/components/home/TechStack.astro` (inline `style` removed, class instead).
- **Covers:** VP-004, VP-007, VP-008, VP-012 (the heaviest page section).
- **Tests:** `card-system.test.mjs`: every card selector resolves radius and shadow through the tokens; no `opacity: 0` base rule outside `[data-reveal]`; no `style=` in `TechStack.astro`; `project-view.js` sets no `transitionDelay`; focus-visible rules exist for `.card-link`, `.filter-button`, `.tech-badge`.

### PR 4 · Page transitions and footer (`visual/04-transitions-footer`)

- **Files:** `src/styles/main.css` (`::view-transition-old/new(root)` keyframes, `main` slide, privacy banner entrance, footer layout and chips on the card system), `src/components/Footer.astro` (styling classes only; the `.status-dot` inline style moves to a class — `portfolio-refresh.test.mjs` expects exactly one `style=` in the footer today, updated with the spec). Contact channels wait for OQ-014.
- **Covers:** VP-006 (page transitions), VP-010.
- **Tests:** `navigation.test.mjs` NAV-002 regex kept intact (the `@view-transition` rule stays first in its media block); a new assertion that the transition keyframes are inside `prefers-reduced-motion: no-preference`.

### PR 5 · Polish (`visual/05-polish`)

- **Files:** `src/pages/404.astro`, `src/pages/recursos/gracias.astro`, `src/pages/recursos/checklist-ia.astro` (classes only), `src/scripts/terminal.js` (reduced-motion check: write the welcome in one step; `accessibility.test.mjs` A11Y-005 assertions kept), `src/components/SEO.astro` only if the social image or theme-colour needs a token value (direction A), favicons untouched unless direction A.
- **Covers:** VP-006 (terminal), VP-013, VP-016 closure.
- **Tests:** `terminal.js` matches `prefers-reduced-motion`; axe sweep and Lighthouse recorded in `tasks.md`.

## Font swap (PR 1 or a PR 0, direction B)

- Outfit → Urbanist variable, weights 300–800, same `unicode-range` as Inter, subset with `pyftsubset` as spec 028 documents. The file is expected around 24–30 KiB; `scripts/fonts.test.mjs` FONT-001 gets the new name and a 32 KiB ceiling. `PERF-001` (two `@font-face`, `300 800`) holds. `src/layouts/BaseLayout.astro` preload import renamed. Fallback metrics (`size-adjust`, `ascent-override`, `descent-override`, `line-gap-override`) computed with fontTools so the swap causes no layout shift.
- Needs the full Urbanist file (OQ-015) and the OFL licence text next to the font, as the designer's branch does.

## Key decisions

- **Decision:** direction B, dark surface with the brand palette. **Discarded:** A (port of the paper prototype; larger blast radius, duplicates the designer's work) and C (off-brand, aggressive for the audience). **Rationale:** in the spec. **ADR:** `docs/30-decisions/ADR-0012-visual-direction-deep-blue-precision.md`, `Proposed`, written when the owner chooses.
- **Decision:** replace Outfit with Urbanist, keep Inter. **Discarded:** Urbanist for body too (one more font file, PERF-001 allows two), keep Outfit (off-brand). **Rationale:** the brandbook names Urbanist; two files keep spec 028. **ADR:** same ADR, section "Fonts".
- **Decision:** retire particles, blurred glow and the card tilt; keep the WebGL hero scene unchanged. **Discarded:** a new hero scene (HERO-001 to HERO-004 lock it; a change is its own spec). **Rationale:** budget and focus.
- **Decision:** verification tooling stays outside the repository (DevTools-protocol capture, axe injection, reduced-motion probe) and Lighthouse runs through the existing `lighthouse` dependency with a desktop preset added to a local runner. **Discarded:** Playwright + `@axe-core/playwright` (new development dependencies; would need an ADR and the spec 033 precedent chose injection). **Rationale:** VP-014; the owner may still ask for Playwright, then an ADR.
- **Decision:** `--color-background` and other guarded values change together with their tests, cited by requirement. **Discarded:** keeping `#090a0f` as the page colour to avoid touching the test. **Rationale:** the test guards that styles are inlined, not the colour; the marker is updated to the new token value.

## Constraints that bite (from the test and spec survey, 2026-10-21)

| Guard | Where | Effect on this work |
| :--- | :--- | :--- |
| Home HTML gzip ≤ 25 KiB; today 22 732 B | `performance-build.test.mjs` CSS-002 | Net-zero CSS; measured on every PR |
| Exactly two `@font-face`, `font-weight: 300 800`, two files | `performance.test.mjs` PERF-001 | Font swap keeps two variable files |
| Inter ≤ 34 KiB (220 B margin), Outfit ≤ 30 KiB | `fonts.test.mjs` FONT-001 | New file gets its own ceiling |
| Visible characters inside the shared `unicode-range` | `fonts.test.mjs` FONT-002 | No new decorative glyphs; `→` and `·` are already covered |
| Inline `<style>` must contain `--color-background:#090a0f` | `performance-build.test.mjs` | Marker updated with the token |
| `h1` clamp max ≤ 4.8 rem; `.hero h1` ≤ 4.6 rem and `max-width` 14–29 ch | `portfolio-refresh.test.mjs` VIS-010, HERO-022 | Scale designed inside; C would need a spec change |
| `main > .section:not(.hero)` keeps `content-visibility: auto` | `performance.test.mjs` PERF-008 | Section tiers keep the selector |
| Infinite animations only `transform`/`opacity`; stopped in low-performance | `performance.test.mjs` PERF-007 | Pulse and any loop comply |
| `runQueueWhenIdle([...])` block lists the four effects by name | `post-paint.test.mjs` PERF-015 | Removing particles and tilt updates that list in the same PR |
| `@view-transition` first in its media block; header `view-transition-name` | `navigation.test.mjs` NAV-002 | Transition keyframes go after it |
| No `style=` in the listed components; footer exactly one | `portfolio-refresh.test.mjs` | Footer dot moves to a class with the test |
| Hero scene geometry, colours and ≤ 8 KiB chunk (1.1 KiB margin) | `hero-scene.test.mjs` HERO-001…004 | Only a class toggle added |
| `ecosystem-bar.js` < 20 000 B raw, ≤ 5 KiB gzip, Shadow DOM | `ecosystem-bar.test.mjs` | Untouched |
| Lighthouse mobile gate on `/`, `/en/`, `/servicios/` | `scripts/lib/performance-budget.mjs` | VP-012 adds a desktop run locally |

## Verification per pull request

1. `npm run check` (all guard tests, `astro check`, build, performance build test, fonts, hero scene, brand icons, SEO, locales, claims).
2. Content diff: built HTML before and after, styles and font URLs stripped, must be empty for every page.
3. `npm run check:budget` (mobile, five runs, median) plus a desktop Lighthouse run with the same runner and `formFactor: desktop`; scores pasted into the PR description.
4. axe-core sweep of the eleven page types at 1440 px and 390 px.
5. Reduced-motion probe: emulate `prefers-reduced-motion: reduce`, load `/`, scroll, assert `document.getAnimations()` is empty and the terminal welcome is complete within one frame.
6. Keyboard pass: Tab through the home at both widths, capture each focused control.
7. Before and after captures (same tool as the baseline) at both widths, fold and full, shown to the owner.
8. Any animation that lowers a Lighthouse score below the budget, or that the owner finds distracting, is removed in the same PR.

## Test strategy

- Unit and contract tests under `scripts/*.test.mjs`, one file per PR, added to the `check` script in `package.json`.
- The existing build-time tests remain the regression net; guarded values move with their requirement.
- Audits (Lighthouse desktop, axe, reduced-motion probe, content diff) run locally with tooling outside the repository; results are recorded in `tasks.md` with the date and commit. If the owner wants them in CI, that is a separate spec (CI time and the ADR-0011 contention work).

## Data model changes

None.

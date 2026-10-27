# ADR-0017: Inner-page styles leave `main.css`

Status: Proposed
Date: 2026-10-27

## Context

CSS-001 (spec 031) inlines every stylesheet into each document so first paint never waits for a request, and CSS-002 caps the home document at 30 KiB gzip (ADR-0013, raised from 25 KiB on 2026-10-22). `main.css` is one global file imported by `BaseLayout.astro`, so every page, the home included, inlines the rules of the service hub, the service pages, the blog index, the articles, the technology pages and the content cards of the privacy and resource pages. ADR-0013 measured the move of those rules out of the home at about 1.2 KiB and left it as a follow-up. The home now sits at 30 030 B (spec 049), 700 B under the tripwire, and the next change (links from the selected cases to their work pages) adds bytes.

## Decision

- Rules that no home document uses move from `src/styles/main.css` to `src/styles/inner-pages.css`. The pages, not the layout, import the stylesheets: Astro bundles a page's own CSS before the CSS of the components it renders, so a layout import of `main.css` would place the moved rules first and change the cascade (measured: `.page-top` lost to `.section`, 16 px on the service pages). `src/styles/site.css` imports `main.css`, `terminal.css` and `locales.css` in the layout's old order; the home imports `site.css`; every other page imports `src/styles/inner.css` (`site.css` then `inner-pages.css`); the work pages add `src/styles/work.css`. Astro's `inlineStylesheets: 'always'` keeps every page self-contained, so CSS-001 holds and no stylesheet request appears anywhere.
- The move is mechanical and measured: a rule moves only when none of its class or id tokens appears in `dist/index.html` or `dist/en/index.html`; before-and-after captures of every inner page type at 1440 and 390 px must be identical; guards that read a moved rule from `main.css` are repointed in the same change.
- `main.css` stays the single home of tokens, layout primitives, header, footer, cards shared with the home, themes and motion rules.

## Consequences

- The home document drops by at least 1 KiB gzip, measured in `specs/050-work-pages/tasks.md`; the tripwire of ADR-0013 stays at 30 KiB.
- Inner pages gain nothing and lose nothing in bytes: the rules they used are still inline, and the home-only rules they also inlined are still there through `site.css`. A later ADR may split the home-only rules the same way if an inner-page budget is ever set.
- A new inner page must import `inner.css`; a new home-like page imports `site.css`; the layout imports no stylesheet. `scripts/case-pages.test.mjs` asserts the imports on every page under `src/pages`, and `performance.test.mjs` (PERF-004) asserts the chain from `site.css` to `main.css`.
- Dead rules found by the inventory (no class or id token used anywhere in `src/`) were deleted rather than moved: `.error-page`, `.error-panel`, `.project-grid-container`, `.tech-badge-small`, `.service-hero` and its children.

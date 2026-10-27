# Tasks: Work pages and inner-page stylesheets

- [ ] **T01** `[A]` Guard `scripts/case-pages.test.mjs` written first and registered in `npm run check`; it fails on `main`.
  - **Covers**: IS-004 (asserting WK-001 to WK-004, WK-006, WK-009, WK-012, IS-001)
  - **Done when**: the file exists, is in `package.json` `check`, and fails for the expected reasons before T02 and T03.
- [ ] **T02** `[A]` Inner-page stylesheets: inventory of `main.css` rules unused by the home, move to `src/styles/inner-pages.css`, imports in the inner page files, guards repointed, before/after captures compared, home gzip measured.
  - **Covers**: IS-001, IS-002, IS-003
  - **Done when**: `npm run check` passes, the home contains none of the moved selectors, the eleven inner-page captures are pixel-identical, the saving is at least 1 KiB and is written below. Own commit.
- [ ] **T03** `[A]` `work` collection and schema, `src/pages/trabajo/[id].astro`, `/trabajo/` redirect, `Architecture.astro`, four diagram components with their Mermaid sources, `work.css`, `trabajo → work` hub mapping and its localization test.
  - **Covers**: WK-001, WK-002, WK-004, WK-007 (route), WK-008, WK-010, WK-012
  - **Done when**: the four pages build in both locales with placeholder bodies, `check:seo` passes, the diagrams render in both themes at 1440 and 390 px.
- [ ] **T04** `[M]` Texts: four Spanish MDX bodies drafted from each repository's public docs, 450 to 900 words, no claims; English targets drafted locally and reviewed; appendix of `spec.md` filled.
  - **Covers**: WK-003, WK-005, WK-006, WK-007 (segments)
  - **Needs from owner**: approval of the four Spanish texts and their English in the pull request (given on 2026-10-27, recorded in `spec.md`, with the Nain3D catalog correction).
  - **Done when**: `check:claims`, `check:case-studies`, `check:locales` pass; the guard's word count passes for the four pages.
- [ ] **T05** `[A]` Home: title link and "Cómo está hecho" link on each selected case; `selected-work.test.mjs` SW-002 assertion extended; home gzip measured.
  - **Covers**: WK-009
  - **Done when**: `gzip(dist/index.html)` ≤ 30 720 B, `ItemList` byte-identical, guards green.
- [ ] **T06** `[M]` Audits and pull request: axe both themes on the four pages, reduced-motion probe, Lighthouse mobile and desktop on one work page, captures at 1440 and 390 px, document sizes; PR with base `main`.
  - **Covers**: WK-010, WK-011
  - **Needs from owner**: merge.
  - **Done when**: the PR carries the evidence and the owner has merged.

## Stylesheet split (IS-001 to IS-003)

Method: `main.css` parsed rule by rule; a rule is inner-only when every comma-separated selector part carries at least one class or id token that appears neither in `dist/index.html` and `dist/en/index.html` nor as a string in any script or component (runtime classes). First pass: single-token rules; second pass: compound selectors (`.blog-card .tag-list`, `.service-group .service-card`, …). Rules whose tokens appear nowhere in `src/` or `public/assets/js` were deleted instead of moved: `.error-page`, `.error-panel` (and its `h1`, `p`), `.project-grid-container`, `.tech-badge-small`, `.service-hero`, `.service-hero h1`, `.service-hero-content`, `.service-hero .hero-summary`, `.service-hero .button-group` (about 1.6 KB raw).

| Section of `main.css` | Rules | Raw bytes |
| :--- | ---: | ---: |
| Top-level rules without a section comment (page-top, blog-main, thanks-*, lead-*, tech-grid, tech-link-card, check-list, related-*, back-link, center-actions, page-intro, card-action, page-cta, service-group, project-grid-container, error-*) | 53 | 4 685 |
| Content cards (privacy, resource and technology pages) | 6 | 1 310 |
| Blog structure | 8 | 1 126 |
| Servicios SMB (pain cards, process steps, service hero) | 16 | 2 336 |
| Spec 047 inner pages (service glyph and hub, service page, blog index, article, share row) | 22 | 2 673 |
| Spec 047 follow-up (technology header) | 1 | 310 |
| **Total** | **106** | **12 440** |

Import order: Astro bundles a page's own CSS before the CSS of the components it renders, so importing `inner-pages.css` from the pages while the layout imported `main.css` placed the moved rules first and shifted `.page-top` under `.section` (16 px on the service pages). Fix: the layout imports no stylesheet; `src/styles/site.css` imports `main.css`, `terminal.css` and `locales.css` in the layout's old order; the home imports `site.css`; every other page imports `inner.css` (= `site.css` then `inner-pages.css`); the work pages add `work.css`. `inlineStylesheets: 'always'` keeps every page without a stylesheet request (CSS-001).

Home document: 30 030 B gzip before the split, 28 361 B after the first pass, 28 076 B after the second (`/en/`: 29 423 → 27 478 B). Saving: 1 954 B, above the 1 KiB IS-002 floor.

## Guard changes

- `scripts/case-pages.test.mjs` (new): WK-001 to WK-004, WK-006, WK-007, WK-009, WK-012, IS-001, IS-004.
- `scripts/card-system.test.mjs` VP-004, VP-008; `scripts/inner-pages.test.mjs` IP-002 to IP-005; `scripts/portfolio-refresh.test.mjs` VIS-009, VIS-011, VIS-012: read `main.css` + `inner-pages.css` for the moved rules.
- `scripts/performance.test.mjs` PERF-004: the layout no longer imports `main.css`; asserts `site.css` imports it and the home imports `site.css`. PERF-021: the later-service-group rule is read from `inner-pages.css`.
- `scripts/localization.test.mjs`: `englishPath('/trabajo/<id>/')` → `/en/work/<id>/`; new test for the SVG opt-in translation (title, desc, text, tspan; icon SVGs untouched).
- `scripts/lib/localization.mjs`: `trabajo: 'work'` hub; `visit` translates the prose of `svg[data-translate="yes"]`.

## Measurements

- Four pages: 581, 595, 567 and 572 Spanish words (guard range 450 to 900), one diagram each.
- English catalog: 137 new reviewed segments (1 806 in total); `build-locales` reports 0 pending.
- Home document after T05 (title links and "Cómo está hecho" added): 28 140 B gzip (`/en/` 27 537 B), 1 890 B under the pre-split value and 2 580 B under the 30 720 B tripwire. Work pages about 22.7 KB gzip each.
- Capture comparison (IS-003, eleven page types at 1440 and 390 px, full build of `origin/main` as the baseline): every inner page identical pixel for pixel; the home differs only where the links were added (desktop: inside the cases; phones: everything below the first case shifts by the new link rows); the 404 page differs in 90 pixels of the terminal cursor.
- axe-core 4.13, WCAG 2.0 to 2.2 A/AA, dark and paper: 0 violations on `/`, `/en/`, the four work pages, two English work pages, a service page and an article at 1440 and 390 px (run twice: before and after the phone scroll treatment).
- Reduced-motion probe: no animation runs on `/`, `/en/`, two work pages and `/servicios/`.
- Lighthouse 13.5 (local preview, quiet host): `/trabajo/parametricad-ai/` desktop perf 1.00, a11y 1.00, LCP 476 ms, TBT 0, CLS 0; mobile 1.00 / 1.00, LCP 1 654 ms; `/en/work/nain3d-conformance-gateway/` desktop 1.00 / 1.00, LCP 431 ms; mobile 1.00 / 1.00, LCP 1 805 ms.
- Browser pass (built site): dark and paper themes on the Nain3D page, diagram labels measured against their boxes on every page (longest label 189 of 200 units after shortening two of them and switching the diagram font to the body face), phone layout of the modernizer page with the sideways-scrolling diagram.

## Session log

- 2026-10-27 · Interview done (four owner decisions in `spec.md`); worktree `D:/wt/nain9dev.github.io-feat-case-pages` on `feat/case-pages` from `origin/main` `26e614b`; spec, plan, tasks, two ADRs written.
- 2026-10-27 · T01 to T05 implemented test first (guard red on `main`, 9 of 10 tests); split measured and pixel-compared against a full build of `origin/main`; four texts drafted from the repositories' docs and translated; `npm run check` run before the audits. The Nain3D catalog discrepancy (OpenCASCADE, Khronos) is recorded in `spec.md` for the owner. Next: T06.

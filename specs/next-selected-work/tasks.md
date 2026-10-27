# Tasks: Selected work and home narrative

- [ ] **T01** `[A]` Guard test `scripts/selected-work.test.mjs` written first and registered in `npm run check`; it fails on `main`.
  - **Covers**: SW-007 (asserting SW-001 to SW-004, HN-001 to HN-005)
  - **Done when**: the test file exists, is in `package.json` `check`, and fails for the expected reasons before T02.
- [ ] **T02** `[A]` Story data: `story` object on the four featured entries of `public/assets/data/projects.json`, Spanish drafts from the spec appendix; English targets in `src/i18n/en-US.json`.
  - **Covers**: SW-003, SW-004, HN-007
  - **Done when**: `check:claims`, `claims.test.mjs` and `check:locales` pass with the new strings.
- [ ] **T03** `[A]` `SelectedWork.astro`, shared `isOwnDemo` helper, CSS block, home order.
  - **Covers**: SW-001, SW-002, SW-005, SW-006, HN-001
  - **Done when**: the section renders four cases in order at 1440 and 390 px, the `ItemList` is byte-identical, the guard passes its SW assertions.
- [ ] **T04** `[A]` About section with the proof sentences and the folded terminal; `ProofStrip`, `ImpactMetrics` and `TerminalSection` deleted; guards updated (`home-clarity`, `post-paint`, `claims`, `performance`, `storytelling`, `performance-build` marker).
  - **Covers**: HN-002, HN-005, HN-006
  - **Done when**: the terminal works inside the disclosure with keyboard and mouse; every relocated sentence is found in the built home; `npm run check` passes.
- [ ] **T05** `[A]` Stack strip inside the services section; catalog rows in `project-view.js` and CSS; removed CSS listed with sizes.
  - **Covers**: HN-003, HN-004, SW-008
  - **Done when**: `gzip(dist/index.html)` ≤ 30 KiB, catalog filters and counts unchanged, `stack-method` and `portfolio-refresh` guards updated and green.
- [ ] **T06** `[M]` Audits and pull request: axe both themes, reduced-motion probe, Lighthouse mobile and desktop, before and after captures, document size; PR with base `main`.
  - **Covers**: SW-008, SW-009, SW-010
  - **Needs from owner**: approval of the twelve Spanish and twelve English story lines; merge.
  - **Done when**: the PR description carries the evidence and the owner has merged.

## Sentences relocated from the home (HN-006)

- Proof strip, three pairs ("Experiencia real" / "Trabajo a diario con .NET y SQL Server.", "Código revisable" / "Los proyectos y las demos están enlazados.", "Alcance claro" / "Proyectos a tiempo parcial y en remoto, con el alcance acordado desde la primera llamada."): → `AboutSection.astro`, `div.about-proof`, same markup (icon, strong, span), visible.
- Checklist box ("Recurso Gratuito", "¿Tu sistema de IA está listo para producción?", its paragraph and the button "📥 Descargar Checklist de Arquitectura"): → not on the home; the checklist stays linked from the footer, the 404 page and eight blog posts, and keeps `/recursos/checklist-ia/`.
- Terminal eyebrow "Interactúa con mi perfil" and hint "Prueba mi terminal interactiva. Escribe help para empezar.": → inside the about disclosure, after the summary. Heading "Terminal Profesional": → no longer on the home (the summary "Terminal interactiva" replaces it); it stays on the 404 page, which keeps its own terminal section.
- The terminal widget itself: → `Terminal.astro`, shared by the about disclosure and the 404 page; `TerminalSection.astro` deleted.
- Stack eyebrow "Tecnologías", heading "Stack tecnológico" (now an H3 inside the services section) and its paragraph: → `div.tech-strip` after the service cards; category names visually hidden.

New strings (all with reviewed English targets in `src/i18n/en-US.json`, 20 segments): "Trabajo seleccionado", "Problema", "Enfoque", "Resultado", "Terminal interactiva" (already in the catalog as the widget's accessible name), the twelve story lines, and three composed segments (status eyebrow with the index placeholder, the two link rows).

## Guard changes (SW-007)

- `scripts/selected-work.test.mjs` (new, 13 tests): SW-001 to SW-004, SW-007, HN-001 to HN-005.
- `scripts/portfolio-refresh.test.mjs`: HERO-021 order line → HN-001 order (selected work, services, strip, catalog); VIS-003 thumbnail assertions read `SelectedWork.astro` instead of `project-view.js`; VIS-008 no longer reads `ImpactMetrics.astro` and asserts `.resource-cta` is gone; VIS-013 counts the proof icons in `AboutSection.astro`.
- `scripts/storytelling.test.mjs`: VS-001 section list without `TerminalSection` and `ImpactMetrics`; VS-010 asserts summary and proof inside the detail for every row.
- `scripts/home-clarity.test.mjs`: AVAIL-001 reads the availability sentence from `AboutSection.astro`.
- `scripts/post-paint.test.mjs`: PERF-011 reads the prompt markers from `Terminal.astro`.
- `scripts/performance.test.mjs`: PERF-021 `content-visibility` rule without `.proof-strip`.
- `scripts/stack-method.test.mjs`: VS-004 revised by HN-003 (strip with `display: contents` groups, no spine, badges in a row).
- `scripts/card-system.test.mjs`: VP-004 list drops `.impact-metric-card` and `.project-thumb`, adds `.case-media`; VP-008 checks `.service-card` and `.project-row` twins.
- `scripts/inner-pages.test.mjs`: IP-008 revised by HN-004 (row index in the markup, no cover band).
- `scripts/visual-tokens.test.mjs`: VP-003 medium tier now `#open-ecosystem, #partnership`.
- `scripts/claims.test.mjs`: the checklist call to action is asserted in the footer.

## Measurements (2026-10-27, local production build)

- `gzip(dist/index.html)`: 29 916 B (limit 30 720 B, ADR-0013); `/en/`: about 29 300 B. The budget is tight: the next home change should first move page-specific CSS out of `main.css` (ADR-0013 follow-up).
- Home: 10 `<section>` elements, 4 cases, `npm run check` exit 0 (all guards, astro check, bilingual build, performance build tests, fonts, brand icons, SEO, locales, case studies, claims).
- axe (11 page types, 1440 and 390, dark and paper): 0 violations after the `.repo-code` fix. Before it, the only violations were WCAG 2.5.8 target size on the open-ecosystem `.repo-code` links (23.6 px tall), which production already showed on 2026-10-27 (4 to 6 nodes per home); fixed in passing with `min-height: 24px`.
- Reduced-motion probe: no animation runs on `/`, `/en/`, `/servicios/`, `/blog/`, `/404.html`.
- Lighthouse 13.5 (local preview, quiet host): `/` desktop perf 1.00, a11y 1.00, LCP 480 ms, TBT 0, CLS 0; `/` mobile perf 0.99, a11y 1.00, LCP 1 885 ms, TBT 11 ms, CLS 0; `/en/` desktop 1.00 / 1.00; `/en/` mobile perf 0.99, a11y 0.97 with one `target-size` flag on the about quiet summary "partially obscured": the known artefact of `content-visibility: auto` sections (spec 048 notes), since the summary measures 32 x 32 px and a hit test lands inside it after a scroll pass, and axe reports nothing there.
- Phone pass (375 px, `/en/`): cases stack capture over text, chips wrap, links keep their size; the terminal fold opens and runs inside the about section at 1280 px.

## Session log

- 2026-10-27 · Interview done (four owner decisions in `spec.md`), spec, plan, tasks and ADR written in worktree `D:/wt/nain9dev.github.io-feat-selected-work` (branch `feat/selected-work`).
- 2026-10-27 · T01 to T05 implemented test first; `npm run check` green; selected work, catalog rows, stack strip and the terminal fold checked in the browser at 1280 px (terminal opens and runs inside the disclosure); audits above. Changes staged in the worktree, nothing committed, no pull request yet. Next (T06): the owner reads the story appendix in `spec.md`; commit, before/after captures with the local capture tool, pull request with base `main` carrying the measurements; the owner approves the twelve lines and merges.

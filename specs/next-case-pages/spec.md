# Spec: Work pages for the selected projects, and inner-page styles out of `main.css`

Status: Proposed (owner decisions of 2026-10-27 recorded below)
Branch: `feat/case-pages` · worktree `D:/wt/nain9dev.github.io-feat-case-pages`
ADRs: `docs/30-decisions/ADR-next-work-pages-scope-the-case-study-ban.md`, `docs/30-decisions/ADR-next-inner-page-stylesheets.md` (both Proposed)

## Objective

The home now tells four projects as a three-line story (spec 049, SW-001 to SW-004). A visitor who wants to know how one of them is built has nowhere to go but the repository. This spec gives each of the four selected projects a page under `/trabajo/<id>/` (English `/en/work/<id>/`) that a technical buyer can read in three or four minutes: the problem, the architecture as a diagram, the decisions and why, what the public demo lets them verify, the stack and the links. It also moves the styles that only inner pages use out of `main.css`, so the home document leaves the 30 KiB tripwire zone before any further home change (ADR-0013 follow-up).

## Owner decisions (2026-10-27, one question per turn)

1. Depth: a compact page (600 to 900 words per project), not a long-form write-up and not a bare expanded story.
2. Diagrams: hand-authored inline SVG on the design tokens, so it reads on the dark surface and on paper, with an accessible title and description; no rendering dependency. The Mermaid source of each diagram is kept under `docs/assets/diagrams/` for maintenance.
3. Copy: the agent drafts the Spanish from each repository's public documentation (README, `docs/`, ADRs), stating only what the code or the demo lets a visitor verify, with no figure, client, duration or promise; reviewed English targets; the owner approves the four texts in the pull request before merge (`[M]`).
4. Spec 007 (case studies retired on 2026-09-16): an ADR scopes CASE-001 to CASE-003 so that technical write-ups of the owner's own public projects under `/trabajo/` are allowed, while client case studies, the `/casos/` and `/en/case-studies/` routes and their redirects stay retired. The site never uses the words "caso de estudio", "caso de éxito", "case study" or "success story": the pages are "trabajo" and "proyecto".

## Functional requirements (EARS)

### Work pages

- **WK-001 (route and source)**: When the site is built, the system shall publish one page `/trabajo/<id>/` for every entry of a new content collection `work` (`src/content/work/<id>.mdx`), where `<id>` is the `id` of a project in `public/assets/data/projects.json` that has `selected: true`; the guard fails when a selected project has no work entry or a work entry names a project that is not selected or does not exist.
- **WK-002 (page anatomy)**: When a work page renders, it shall present, in this reading order inside `<main>`: a header with the eyebrow (two-digit index of the project among the selected ones and its catalog `status`), the H1 (project title), one lead sentence, the project capture (`thumbnail`, 640x360, `loading="eager"`, `fetchpriority="high"`, decorative `alt=""`) and the project links (demo first, then code, each `target="_blank"` with `rel="noopener noreferrer"`); then the sections "Contexto", "Arquitectura" (the diagram of WK-004 and one paragraph), "Decisiones" (three or four items, each a decision and its reason), "Qué puedes comprobar en la demo" (a list of concrete actions) and "Stack" (every entry of `technologies` as chips, `translate="no"`); and a footer navigation with links to the previous and next selected project and back to `/#selected-work`.
- **WK-003 (length)**: When a work page is built, its main text (excluding navigation, chips and the diagram's accessible text) shall hold between 450 and 900 words in Spanish; the guard counts them.
- **WK-004 (diagram)**: When a work page renders, the architecture section shall contain one inline `<svg role="img">` with a `<title>` and a `<desc>` describing the components and the flow, coloured only through classes that read the design tokens in `work.css` (no colour literal, no presentation colour attribute), with text in the page language that the localization build translates like any other text (the SVG opts in with `data-translate="yes"`; icon SVGs stay opaque), and with no `<script>` and no animation; its Mermaid source lives at `docs/assets/diagrams/work-<id>.mmd` and the guard checks the file exists for every work page.
- **WK-005 (no claims)**: When a work page is built, it shall contain no figure, percentage, duration, client, employer, "zero downtime" or guarantee; `npm run check:claims` and `scripts/claims.test.mjs` pass unchanged (the collection lives under `src/content`, already scanned).
- **WK-006 (vocabulary)**: When any page is built in either locale, it shall contain none of the case-study wordings of CASE-002 (`casos? de estudio|éxito`, `case study`, `success story`) and no link to `/casos/` or `/en/case-studies/`; `scripts/case-studies.test.mjs` keeps passing as it is.
- **WK-007 (English)**: When the English site is built, every work page shall exist at `/en/work/<id>/` (the `trabajo` hub maps to `work` in `scripts/lib/localization.mjs`), every new Spanish segment shall have a reviewed English target in `src/i18n/en-US.json`, and `npm run check:locales` passes.
- **WK-008 (structured data and SEO)**: When a work page is built, its head shall carry a title of at most 60 characters, a description of at most 160, a canonical URL, the alternate language links, an Open Graph image (the project capture), the `BreadcrumbList` the SEO component already emits for every page (Inicio › project, since `/trabajo/` is a redirect and not a hub) and a `SoftwareSourceCode` node (`name`, `description`, `codeRepository`, `programmingLanguage` from `technologies`, `url`, `author` → `#person`); `npm run check:seo` passes and the sitemap lists the four pages in both locales.
- **WK-009 (home link)**: When the home renders, each selected case (SW-002) shall link to its work page from the title and from a last link "Cómo está hecho" in the links row, after the demo and code links; the home `ItemList` (SEO-020) does not change and the home document stays at or under 30 KiB gzip (CSS-002, ADR-0013).
- **WK-010 (motion and themes)**: When a work page renders, it shall use only the existing reveal (`data-reveal`) on its sections, nothing on the diagram; under reduced motion or `html.low-performance` nothing moves; both themes render the diagram and the chips with token colours only; axe-core reports no violation at 1440 and 390 px in both themes.
- **WK-011 (approval, texts Approved by the owner on 2026-10-27)**: When the pull request opens, it shall carry the four Spanish texts (also in the appendix of this spec) and their English targets for the owner's approval, captures of the four pages at 1440 and 390 px, the document sizes, Lighthouse mobile and desktop on one work page and the `npm run check` result; it is merged only by the owner.
- **WK-012 (navigation)**: When the header or footer renders, they shall not gain a "Trabajo" entry in this spec (the pages are reached from the home cases, from the sitemap and from search); the hub redirect `/trabajo/` → `/#selected-work` is served as a `noindex` redirect document in both locales so a shortened URL never answers 404.

### Inner-page styles out of `main.css`

- **IS-001 (split)**: When the site is built, the rules that only inner pages use (service hub and page, blog index and article, technology page, content cards of privacy, resources and thank-you pages, the services-by-problem blocks) shall live in `src/styles/inner-pages.css`; the pages import the stylesheets and the layout none (the home imports `site.css`, every other page `inner.css`, which pulls `site.css` and then `inner-pages.css`, so the cascade order of the single file is preserved; the work pages add `src/styles/work.css`); the home document contains none of the moved selectors and every inner page keeps its rules inline (CSS-001: no stylesheet request).
- **IS-002 (budget)**: When the home is built after the split, `gzip(dist/index.html)` shall be at least 1 KiB under its value before the split (measured in `tasks.md`) and at or under 30 KiB after WK-009 adds the home links.
- **IS-003 (no visual change)**: When each existing inner page is built before and after the split, its rendered captures at 1440 and 390 px shall be identical pixel for pixel except for the reading-progress bar, and axe keeps 0 violations; `npm run check` passes (every guard that reads `main.css` by selector is pointed at the file that now holds the rule, each change named in `tasks.md`).
- **IS-004 (guard)**: `scripts/case-pages.test.mjs` (new, registered in `npm run check`) shall assert WK-001 to WK-004, WK-006, WK-009, WK-012, IS-001 and the absence of colour literals and `transition: all` in the new stylesheets.

## Edge cases and error handling

- A selected project loses `selected`: the guard fails until its work entry is removed or the flag restored, so the pages never drift from the home.
- JavaScript disabled: the pages are static; the reveal has its no-script path as today.
- Narrow phones: the diagram keeps a 40rem floor inside a sideways-scrolling, keyboard-focusable figure (labelled), so a 14 px label never renders under about 12 px; the page itself never scrolls sideways. Measured at 375 px: labels 15 px, page width 375 px.
- The English build translates the diagram labels and `<title>`/`<desc>` like any text: labels are short nouns so the English never overflows its box; the guard renders nothing, so this is checked in the browser pass.
- The `/trabajo/` hub without an id is a redirect, not a listing: a listing would be the case-study hub that spec 007 retired.

## Out of scope

- A "Trabajo" entry in the header or footer navigation, a listing page, or pages for projects that are not selected.
- Any change to the home sections other than the two links of WK-009.
- New dependencies, new JavaScript, new fonts, new captures (the existing 640x360 thumbnails are reused).
- Client testimonials, figures or results.

## Acceptance criteria

- `npm run check` green, including `scripts/case-pages.test.mjs` and the unchanged `check:case-studies`.
- Four pages at `/trabajo/<id>/` and `/en/work/<id>/`, each 450 to 900 Spanish words, each with its diagram and its Mermaid source.
- Home gzip measured before and after the split and after the links; the split alone saves at least 1 KiB.
- The owner approved the four Spanish texts and their English targets in the pull request.
- Captures of the four pages and of the inner pages before and after the split attached to the pull request.

## Appendix: page texts (Spanish, approved by the owner on 2026-10-27)

The four write-ups are the files of `src/content/work/` in this branch, approved as written (commit `2091fca`); the English targets in `src/i18n/en-US.json` are their reviewed translations. Title, description and lead of each, so the approval covers the head of the page too:

**parametricad-ai.mdx** · title "ParametriCAD AI: geometría CAD validada antes de exportar" · description "De un formulario o una frase a un sólido CAD comprobado: motor determinista, validación topológica y exportación a GLB, STL, STEP y DXF." · lead "Un modelo de lenguaje puede proponer parámetros, pero no decide si una pieza se puede fabricar. Aquí la geometría la construye un motor determinista y la publica solo la validación topológica."

**nain3d-conformance-gateway.mdx** · title "Nain3D: un veredicto determinista para cada activo 3D" · description "Nain3D evalúa un archivo GLB en el navegador con un motor determinista, agrega las comprobaciones sin dejar pasar fallos y mantiene la IA fuera del veredicto." · lead "Un activo 3D generado por IA puede parecer correcto y romper el proceso que viene después. Nain3D devuelve para el mismo archivo siempre el mismo veredicto, y la IA solo propone."

**financial-management-api.mdx** · title "API de operaciones de pólizas: ciclo de vida auditado" · description "API .NET para el ciclo de vida de pólizas: aislamiento por organización, concurrencia optimista y auditoría en la misma transacción, con demo pública." · lead "Una póliza cambia de estado, pertenece a una organización y nunca debe perder una edición concurrente. La API lo garantiza con el token, la versión de fila y una auditoría escrita junto al cambio."

**nain-legacy-modernizer.mdx** · title "Harness de modernización .NET: migrar sin reescribir" · description "Harness para migrar un monolito .NET por porciones: pasarela YARP, ejecución en sombra y un informe de paridad que decide si cada ruta está lista para cortar." · lead "Un monolito .NET heredado no se reescribe de golpe. Este harness mueve una porción cada vez, compara el servicio nuevo con el viejo sobre tráfico real y solo corta cuando la paridad lo permite."

Sources: each repository's `README.md`, `docs/` and ADRs as of 2026-10-27, read for this spec; the modernizer text describes what `origin/main` of that repository publishes (static demo, parity CLI), not the control panel commit still being published. Every figure, benchmark, client and vendor name found in those documents was left out.

### Nain3D catalog entry (decided by the owner on 2026-10-27: correction applied)

Applied in this branch: `technologies` → `["Python", "trimesh", "NumPy", "Vue 3", "Three.js"]`; `story.approach` → "Validación geométrica determinista con Trimesh y NumPy, agregador que falla cerrado y el mismo motor en Python y en el navegador, con pruebas de paridad."; and, because they carried the same two claims, `summary` → "Motor de validación geométrica determinista para activos 3D, con el mismo motor en Python y en el navegador, backend FastAPI y cliente Vue 3 con Three.js." and `proof` → "Mide la malla con Trimesh y NumPy y devuelve un veredicto reproducible para el mismo archivo. Es un proyecto de ingeniería: contratos explícitos, pruebas de paridad y despliegue propio." (the old proof also said "caso de estudio"). Reviewed English targets replaced in the catalog. `public/assets/data/ecosystem.v1.json` still names OpenCASCADE and a Khronos conformance gate for Nain3D: that file feeds the ecosystem bar shared with the demos and is the owner's open action A-030 in the SEO folder, not touched here. The original record follows.

Original note:

Reading the Nain3D repository for this spec showed that its engine is Trimesh and NumPy and that it has no Khronos conformance gateway (Khronos appears only as a future step in its docs). The catalog entry in `public/assets/data/projects.json` (`technologies` lists OpenCASCADE; the story line approved on 2026-10-27 reads "Validación geométrica determinista con OpenCASCADE y trimesh, contratos explícitos y pasarela de conformidad Khronos, con pruebas y despliegue propio.") predates this reading. The work page does not repeat those two claims. Proposed correction, not applied, for the owner's decision in the pull request: `technologies` → `["Python", "trimesh", "NumPy", "Vue 3", "Three.js"]`; `story.approach` → "Validación geométrica determinista con Trimesh y NumPy, agregador que falla cerrado y el mismo motor en Python y en el navegador, con pruebas de paridad entre ambos." (reviewed English target to add with it).

## Session state

- Last updated: 2026-10-27, case-pages session.
- Done: owner interview (four decisions above); worktree created from `origin/main` at `26e614b` (spec 049 consolidated, #36); spec, plan, tasks and two ADRs written; T01 guard; T02 split (two passes, 106 rules, `site.css` / `inner.css` import order fix); T03 collection, route, redirect, diagrams, `work.css`, `trabajo → work`, SVG text translation in the localization build; T04 four texts and 137 reviewed English segments; T05 home links. `npm run check` running; captures and audits next.
- Done (T06): audits, captures, PR Nain9Dev/nain9dev.github.io#37 with base `main`; the owner approved the four texts and the Nain3D catalog correction on 2026-10-27, both recorded above and applied.
- Next: owner merges #37. After merge: consolidate WK-001 to WK-012 and IS-001 to IS-004 into `docs/10-requirements.md` and `docs/50-traceability.md`, number the spec and the two ADRs (owner sets them to Approved), changelog, remove the worktree by hand.
- Blocked: nothing. The only remaining `[M]` step is the merge.

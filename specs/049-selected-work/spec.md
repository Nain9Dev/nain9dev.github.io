# Specification: Selected work and home narrative

Status: Consolidated (#35 merged 2026-10-27; requirements in `docs/10-requirements.md`, ADR-0015 Proposed)

## Objective

Make the home page read like the portfolios that win a CTO's attention: the first thing after the hero is a short, visual case list, not a catalog. Four projects with a public demo are told as a story in three lines (problem, approach, result) next to a large capture; the twenty-two-project catalog becomes a compact, filterable index further down; the sections that delay the offer (terminal, proof strip, lead magnet) leave the first screens. The home drops from fourteen sections to ten (the open-ecosystem section stays after the catalog, ECO-020). No sentence of the existing copy is rewritten and nothing leaves the HTML: text is folded or moved, never deleted.

Owner decisions of 2026-10-27 (interview, one question per turn):

1. Priority lever: a "selected work" section (chosen over a new hero visual, a plain trim, or a proof strip of verifiable receipts; those remain candidates for later specs).
2. Featured projects: Nain3D, the .NET modernization harness (YARP and Shadow Runner), the policy operations API and ParametriCAD AI. Together they cover the three hero pillars (critical backend, AI under human review, 3D validation) and every one has a public demo on a `naindev.com` subdomain with a capture.
3. Story copy: the agent drafts the twelve lines from the `summary` and `proof` fields already published in `public/assets/data/projects.json`, with no figures, clients or promises; the "result" line states what the public demo lets a visitor verify. The owner approves the Spanish and the English in the pull request before merge.
4. Home order: reorder and compact (hero, selected work, services, live demos, compact catalog, method, about with the terminal folded inside and the partnership next to it, contact); the stack becomes a one-line strip inside the services section; the proof strip and the checklist box leave the home (the checklist keeps its page and its blog links).

This supersedes the 2026-10-22 rule "no home section restructuring" (spec 045 and 046 scope), which protected those specs' blast radius; it is not a product rule. The rule "copy, links, routes and metadata never change" stays for everything except the twelve story lines and the three labels, which are new strings, not rewrites.

## Functional requirements (EARS)

### Selected work

- **SW-001 (section)**: When the home page renders, a section `#selected-work` with an H2 ("Trabajo seleccionado") shall follow the hero directly, before the services, and shall present exactly the projects whose `selected` flag is true (a new boolean, set only on `featured` entries; eight entries are `featured`, so that flag alone cannot pick four) and whose `links` include a demo on a `naindev.com` subdomain, in catalog `order`; with the current data that is `parametricad-ai`, `nain3d-conformance-gateway`, `financial-management-api` and `nain-legacy-modernizer`.
- **SW-002 (case layout)**: When a selected case renders, it shall show, in this reading order: an eyebrow with its two-digit index and its catalog `status`; the project title as an H3; a three-line story rendered as a description list whose terms are "Problema", "Enfoque" and "Resultado"; up to five technology chips from `technologies`; and the project's links (demo first, then code), each with `target="_blank"` and `rel="noopener noreferrer"`. The capture (`thumbnail`, 640 px WebP, explicit 640x360 dimensions, `loading="lazy"` except for the first case, which is `eager` with `fetchpriority="high"`) sits beside the text on wide screens, alternating sides case by case, and above the text on phones.
- **SW-003 (story source, Approved by the owner on 2026-10-27)**: The story lines live in a new `story` object of each selected entry in `public/assets/data/projects.json` (`problem`, `approach`, `result`, Spanish, each at most 160 characters) and nowhere else; a selected entry with a demo and no complete `story` fails the guard test, and a non-selected entry with a `story` fails it too. The drafts are in the appendix of this spec and in `tasks.md` and are the only new sentences this spec introduces, besides the three term labels and the section heading.
- **SW-004 (no claims)**: The story lines shall contain no figure, percentage, duration, client, employer, "zero downtime" or guarantee; `npm run check:claims` and `scripts/claims.test.mjs` shall pass unchanged. The result line describes what the demo shows or lets the visitor do.
- **SW-005 (structured data)**: The home `ItemList` (SEO-020) shall keep listing every public catalog project with the same URLs; the selected cases add no new node. The `Person`/`Organization` nodes do not change.
- **SW-006 (motion)**: Where the visitor has not asked for reduced motion, each case shall enter with the existing scroll reveal (`data-reveal`, opacity and translate only) and the capture shall scale to 1.03 inside its clipped frame on hover and keyboard focus of the case link; under reduced motion or `html.low-performance` nothing moves. No JavaScript is added for the section.

### Home narrative

- **HN-001 (order)**: When `src/pages/index.astro` renders, the sections shall appear in this order and only these: `Hero`, `SelectedWork`, `ServicesSection` (with the stack strip inside it, after the service cards), `LiveDemos`, `ProjectsSection`, `OpenEcosystem` (kept after the catalog, ECO-020), `MethodSection`, `AboutSection` (with the terminal folded inside it, after the profile links), `PartnershipSection`, `ContactSection`. `Testimonials` keeps its current place before contact: it renders nothing until an approved entry exists (TEST-002). Ten sections instead of fourteen.
- **HN-002 (terminal folded)**: When the about section renders, the terminal shall sit inside a `<details>` disclosure (VS-001 pattern) whose summary reads "Terminal interactiva"; the terminal markup, its `role="log"` and its input stay in the HTML, and `src/scripts/terminal.js` keeps loading as today so the behaviour inside the disclosure is unchanged. The disclosure is closed by default and does not animate on open.
- **HN-003 (stack strip)**: When the services section renders, the stack shall follow the service cards as one horizontal band per category label is dropped: a single row of the existing badges (icon and visible name, VS-004 names kept), wrapping on narrow screens, with the category names kept in the HTML as visually hidden text before each group. `#tech-stack` stays as the band's id so the header link and the technology pages' back links keep working.
- **HN-004 (catalog compact)**: When the project catalog renders, the filter toolbar and counts shall stay as today, and each project shall render as one compact row (index, title, status, up to four technology chips, links) instead of a tall card; the summary and proof text stay in the row's detail disclosure (VS-010 pattern). The four selected projects are listed in the catalog too, so the catalog stays complete (PRJ-022 unique sequential order unchanged).
- **HN-005 (removed from home, kept elsewhere)**: When the home renders, it shall not include `ProofStrip` nor `ImpactMetrics` (the checklist box). The proof strip's three sentences move into the about section's disclosed copy so no sentence leaves the site; the checklist stays reachable from `/recursos/checklist-ia/` and from the blog cards that already link it. The components' files are deleted and their guard tests updated in the same change.
- **HN-006 (text preserved)**: When the home is built, every visible and hidden sentence of the previous build shall be present in the new build, except the sentences this spec removes from the home and relocates (listed in `tasks.md`); the new sentences are only those of SW-003 and the labels of SW-002, HN-002 and HN-003.
- **HN-007 (English)**: Every new Spanish string shall have a reviewed English target in `src/i18n/en-US.json`; `npm run check:locales` passes and the English home shows the same order and the same four cases.

### Guards and budgets

- **SW-007 (guard)**: A new `scripts/selected-work.test.mjs`, registered in `npm run check`, shall assert SW-001 to SW-004, HN-001 to HN-005 and the absence of colour literals and `transition: all` in the new CSS; the existing guards that encode the old order (`portfolio-refresh.test.mjs` HERO-021 line, `storytelling.test.mjs` section list, `home-clarity.test.mjs` proof strip, `performance.test.mjs` `.proof-strip` selector, `claims.test.mjs` ImpactMetrics read) are updated in the same pull request, each change named in `tasks.md`.
- **SW-008 (budgets)**: The home gzip document stays at or under 30 KiB (CSS-002, ADR-0013): the CSS of the project cards' tall layout and of the proof strip is removed in the same change that adds the case and row rules. Lighthouse mobile on `/` and `/en/` keeps performance ≥ 0.95 and accessibility 1.00; LCP ≤ 2.5 s with the first capture as the LCP candidate measured, not assumed; CLS ≤ 0.1.
- **SW-009 (accessibility)**: axe-core reports no violation on `/` and `/en/` at 1440 and 390 px in both themes; the description list, the disclosures and the alternating layout keep a logical DOM order; captures are decorative (`alt=""`) because the title and story carry the meaning.
- **SW-010 (approval)**: The pull request carries before and after captures at 1440 and 390 px (fold and full page), the document size, the Lighthouse scores and the `npm run check` result, and is merged only by the owner.

## Edge cases and error handling

- A featured project loses its demo link: it drops out of the selected work and stays in the catalog; the section never renders fewer than three cases without the guard failing, so the owner notices.
- JavaScript disabled: the section is static HTML; the catalog keeps its static index (CAT-001); the terminal disclosure opens but the terminal shows its no-script state as today.
- Reduced motion and low-performance mode: no reveal, no scale (existing paths).
- Phones: captures take the full width above the text; chips wrap; links stay 44 px targets.
- Paper theme: the case frame uses the token surface and the `--color-shadow` role; no new colour.
- The English build moves the header CTA (locales.css); nothing here touches the header.

## Out of scope

- Dedicated case pages (`/trabajo/<id>/`): a later spec once the owner wants long-form write-ups; this spec keeps routes unchanged.
- Any change to the hero text, the services copy, the method or the contact.
- A new hero visual, a "verifiable receipts" strip and client testimonials (paused).
- New dependencies, new JavaScript, new fonts.

## Acceptance criteria

- `npm run check` green, including the new guard; `check:budget` within limits on a quiet host (ADR-0011).
- Home section count on `/`: ten `<section>` elements inside `main` (eleven with an approved testimonial).
- The owner approved the twelve Spanish lines and the twelve English lines in the pull request. Done: approved on 2026-10-27 as written in the appendix (SW-003).
- Captures before and after attached to the pull request.

## Appendix: story lines (Spanish, approved by the owner on 2026-10-27)

Written only from the published `summary` and `proof` fields; no figure, client or promise. Approved as written; the English targets in `src/i18n/en-US.json` are the reviewed translations of these lines.

**ParametriCAD AI**
- Problema: Pedir geometría CAD a un modelo de lenguaje sin comprobarla produce mallas abiertas o con normales invertidas, inútiles para fabricar.
- Enfoque: Motor paramétrico determinista con CadQuery y OpenCASCADE; el modelo de lenguaje solo extrae parámetros, y es opcional; la validación topológica es obligatoria.
- Resultado: Cada sólido se comprueba estanco y 2-variedad antes de exportar a GLB, STL, STEP o DXF; la demo lo enseña en el visor web.

**Nain3D**
- Problema: Un activo 3D generado por IA puede parecer correcto y romper el proceso aguas abajo; hacía falta un veredicto que no dependa de quién lo mira.
- Enfoque: Validación geométrica determinista con OpenCASCADE y trimesh, contratos explícitos y pasarela de conformidad Khronos, con pruebas y despliegue propio.
- Resultado: El mismo archivo devuelve siempre el mismo veredicto; la demo pública permite comprobarlo con cualquier GLB.

**API de Operaciones de Pólizas**
- Problema: El ciclo de vida de una póliza exige aislar los datos de cada organización, auditar cada cambio y resolver ediciones concurrentes sin perder ninguna.
- Enfoque: API .NET 10 con roles JWT, concurrencia optimista con rowversion, ETag e If-Match, errores como ProblemDetails e integración continua contra un SQL Server real.
- Resultado: Con datos sintéticos, la API pública permite recorrer Borrador, Activa y Cancelada y provocar un conflicto de concurrencia controlado.

**Harness de modernización .NET (YARP y Shadow Runner)**
- Problema: Un monolito .NET heredado no se reescribe de golpe, y cada migración parcial arriesga el comportamiento que hoy funciona en producción.
- Enfoque: Strangler Fig con proxy inverso YARP y Shadow Runner: el servicio nuevo corre en paralelo y sus respuestas se comparan semánticamente con las del monolito.
- Resultado: La demo muestra el enrutamiento transparente entre monolito y microservicios .NET 10 y la auditoría de cada diferencia detectada.

## Session state

- Last updated: 2026-10-27, selected-work session.
- Done: interview (four decisions above), live-site review, research of reference portfolios, spec, plan, tasks, ADR `Proposed`; T01 to T05 implemented in worktree `D:/wt/nain9dev.github.io-feat-selected-work` on `feat/selected-work`: `npm run check` green, axe 0 violations in both themes, reduced-motion probe clean, Lighthouse mobile 0.99 / 1.00 on `/`, home document 30 030 B gzip after merging `main` (limit 30 720). Committed, captures taken, pull request #35 open with base `main`. The owner approved the twelve story lines on 2026-10-27 (SW-003).
- Merged: #35 on 2026-10-27. Consolidated: spec number 049 and ADR-0015 assigned; SW-001 to SW-010 and HN-001 to HN-007 in `docs/10-requirements.md` and `docs/50-traceability.md`; changelog entry; task index row.
- Next: nothing in this spec. Follow-up candidates from the interview, not started: a new hero visual, a verifiable-receipts strip, case pages under `/trabajo/<id>/`, and moving page-specific CSS out of `main.css` before the next home change (budget tight).
- Blocked: nothing. ADR-0015 waits for the owner's approval.

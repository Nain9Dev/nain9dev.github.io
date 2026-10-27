# Spec: Architecture diagrams for the private projects in production

Status: Draft (branch `feat/private-diagrams` · worktree `D:/wt/nain9dev.github.io-feat-private-diagrams`, from `origin/main` `8229ff6`)
ADR: `docs/30-decisions/ADR-next-private-project-diagrams.md` (Proposed)

## Objective

The three strongest entries of the catalog are private and in production (`conformance-architecture`, `interactive-3d-viewer`, `collaborative-crm`). PRJ-002 forbids links and names for them, so today they are the only rows of the catalog with nothing to look at: a status, a summary and a proof paragraph behind "Ver detalle". The catalog heading promises that private projects are "described only by architecture and stack". This spec keeps that promise literally: each of the three rows gains an anonymized architecture diagram, hand-authored on the design tokens like the work-page diagrams (WK-004), shown inside the row's disclosure and loaded only when a visitor opens it, so the home document does not grow and nothing is requested for a closed row.

## Owner decisions

None required before the pull request: the diagrams are built only from the published `summary`, `proof` and `technologies` of each entry, so no new fact is published. The owner approves the three diagrams in the pull request (`[M]`, PD-009) and may veto the disclosure label.

## Functional requirements (EARS)

- **PD-001 (scope and data)**: When the catalog is served, every private project whose `status` begins with "Privado · En producción" shall carry `diagram: "/assets/diagrams/<id>.svg"` pointing at a file under `public/`, and no other project shall carry a `diagram`; PRJ-002 holds for the three entries (no links, no client, product, partner or employer name).
- **PD-002 (diagram file)**: Each diagram shall be a hand-authored SVG with `viewBox="0 0 720 320"`, `role="img"`, `aria-labelledby` naming its own `<title>` and `<desc>`, and `data-translate="yes"`; coloured only through the token classes of `diagram.css` (`node`, `node-accent`, `label`, `label-soft`, `flow`, `flow-accent`, `arrow`, `arrow-accent`; no colour literal, no `style` attribute, no `<script>`, no animation); every `id` in the file carries a prefix unique to that diagram so three diagrams can share one document; its Mermaid source lives at `docs/assets/diagrams/project-<id>.mmd`.
- **PD-003 (anonymity and claims)**: The text of a diagram shall describe only architecture and stack already published in the entry's `summary`, `proof` and `technologies`: no client, product, partner or employer name, no internal identifier, no figure that the entry does not already state, no percentage; `scripts/check-claims.mjs` scans `public/assets/diagrams/*.svg` with the source directories.
- **PD-004 (rendering)**: When the catalog renders a project with a `diagram`, the row's disclosure shall read "Ver arquitectura y detalle" (interface key `projectDetailDiagram`) and hold, after the proof, a focusable figure (`class="arch-diagram project-diagram"`, `tabindex="0"`, `aria-label` from the key `projectDiagram`) whose SVG is fetched from the locale path of the file (`/en` prefix on English pages) the first time the disclosure opens and inserted inline, so it reads the page tokens in both themes; while the disclosure is closed nothing is requested; a failed fetch removes the figure and leaves the row intact; rows without a `diagram` do not change.
- **PD-005 (English)**: When the English site is built, `dist/en/assets/diagrams/<id>.svg` shall exist for every diagram, with every text segment translated from reviewed entries of `src/i18n/en-US.json` (`sync-translations` collects the SVG segments like page segments; `build-locales` writes the English files); `check:locales` fails when an English diagram is missing or still equals its Spanish source.
- **PD-006 (shared styles and budget)**: The figure and SVG rules shall live in `src/styles/diagram.css`, imported by `site.css` so the home and the work pages share them; `Architecture.astro` uses `class="arch-diagram"` and `work.css` holds no diagram rule; the new file uses tokens only and no `transition: all`; the home document stays at or under 30 720 B gzip (CSS-002) and the four work pages render their diagrams unchanged.
- **PD-007 (accessibility and motion)**: When the home renders with the three disclosures open, axe-core shall report no violation at 1440 and 390 px in both themes; on phones the figure scrolls sideways with a 40rem floor for the SVG instead of shrinking its labels, and the page never scrolls sideways; the diagram has no animation and the reveal motion of the row is unchanged.
- **PD-008 (guard)**: `scripts/private-diagrams.test.mjs`, registered in `npm run check`, shall assert PD-001 to PD-004 and PD-006 from the sources; `scripts/check-locales.mjs` asserts PD-005 on the build.
- **PD-009 (approval)**: When the pull request opens, it shall carry the three diagrams rendered in both themes, the home document size, the axe result and the `npm run check` result; it is merged only by the owner.

## Edge cases and error handling

- A private project changes status to something other than "Privado · En producción": the guard requires its `diagram` to be removed, so the scope never drifts.
- JavaScript disabled: the catalog shows the static index as today; the diagrams are a progressive addition of the client-rendered rows.
- Fetch failure or non-SVG response: the figure is removed; the summary and proof stay.
- A diagram opened on an English page fetches `/en/assets/diagrams/<id>.svg`; the English file exists because `check:locales` fails otherwise.
- A browser without `fetch` is not supported by the catalog script already (ES modules).

## Out of scope

- Work pages (`/trabajo/`) for the private projects: WK-012 and ADR-0016 keep those for public projects with an own demo.
- Diagrams for private projects not in production, or for public projects (their captures carry the row).
- Any home restructuring, new section, copy change outside the two new interface keys, new dependency or new font.
- Client names, figures or results beyond what the catalog entries already state.

## Acceptance criteria

- `npm run check` green with `scripts/private-diagrams.test.mjs` and the extended `check:locales` and `check:claims`.
- Three diagrams in `public/assets/diagrams/`, three Mermaid sources, three English diagrams in `dist/en/assets/diagrams/`.
- Browser pass: the three rows open with their diagram in dark and paper, Spanish and English, 1440 and 390 px; axe 0 violations; no request for the diagrams before opening.
- Home document gzip size recorded in `tasks.md`, at or under 30 720 B.

## Traceability

| Requirement | Verified by |
| :--- | :--- |
| PD-001 to PD-004, PD-006 | `scripts/private-diagrams.test.mjs` |
| PD-003 | `npm run check:claims` (scope extended to the SVG files) |
| PD-005 | `npm run check:locales` |
| PD-006 budget | `scripts/performance-build.test.mjs` (CSS-002 tripwire) |
| PD-007 | axe-core run recorded in `tasks.md`; manual phone pass |
| PD-009 | Pull request, owner merge |

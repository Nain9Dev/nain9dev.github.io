# Implementation plan: Visual storytelling

Status: In progress

## Modules

- **Quiet text** (`src/components/home/Quiet.astro`): a `<details class="quiet">` with an icon-only `<summary aria-label="Más detalle">`; used by the section headings of services, stack, projects, ecosystem, partnership, terminal and method, by the About copy, the contact paragraph and the resource and method calls to action. Covers VS-001, VS-006.
- **Hero map** (`main.css`): the existing `.system-map` markup styled as a pipeline (rail, nodes with ports, travelling pulse); `.system-node small` and `.panel-hint` visually hidden. No markup change. Covers VS-002.
- **Demo gallery** (`src/components/home/LiveDemos.astro`, `main.css`): tiles built from `projects.json` thumbnails; title overlay; host and technologies visually hidden; horizontal snap scroll on phones. Covers VS-003.
- **Stack map and method timeline** (PR 7): `TechStack.astro` layer bands; `.step-list` horizontal rail with `animation-timeline: view()`. Covers VS-004, VS-005.
- **Guards** (`scripts/storytelling.test.mjs`): quiet pattern present and accessible, hidden text still in the files, gallery images lazy with empty alt, pulse keyframes transform-only and stopped in low-performance mode.

## Key decisions

- **Progressive disclosure over copy cuts**: `<details>` keeps the text in the DOM and needs no script. Discarded: `line-clamp` (still shows text), JavaScript toggles (one more module). ADR-0013 records it together with the budget revision.
- **Hero map without new markup**: the panel's links already are the nodes; CSS draws the diagram. Discarded: an inline SVG diagram (adds bytes to every home build and duplicates the links).
- **Budget**: the home document is 24.5 KiB gzip against a 25 KiB ceiling before this work; captures and the disclosure pattern add markup. ADR-0013 proposes 30 KiB for `/` and `/en/` with the Lighthouse gate unchanged, measured per pull request. Discarded: splitting critical and deferred CSS (CSS-001 forbids a stylesheet request) and removing the static catalog index (SEO and no-JS fallback).

## Test strategy

- Unit guards in `scripts/storytelling.test.mjs`, added to `npm run check`.
- Audits outside the repository as in spec 045: axe sweep, reduced-motion probe, Lighthouse mobile and desktop, captures.

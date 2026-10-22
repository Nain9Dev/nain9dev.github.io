# Implementation plan: portfolio coverage

Status: In progress

## Modules

- **Catalog data** (`public/assets/data/projects.json`): NainLegacyModernizer gets the demo link first, the active-demo status and its capture; nain-mcp-validator gets its README capture. The card renderer (`src/scripts/project-view.js`) and the live-demos strip already read `thumbnail`, so no script changes. Covers PRJ-024, PRJ-025.
- **Captures** (`public/assets/images/demos/`, `public/assets/images/repos/`): 640x360 and 400x225 WebP per repository, produced outside the repository with the DevTools-protocol tool used by specs 045 and 046 (first screen at 1280x720 for live sites; the rendered README article, dark scheme, clipped to 16:9 for GitHub). Covers ECO-022, PRJ-024, PRJ-025.
- **Open ecosystem** (`src/components/home/OpenEcosystem.astro`, `src/styles/main.css` block `#open-ecosystem`): each repository declares `site` (optional) and `thumbnail`; the tile becomes a picture tile like the live-demos strip, the repository mark stays as a corner badge, and a secondary `GitHub` chip appears when the tile links a live site. Covers ECO-022, ECO-023.
- **Suite bar catalog** (`public/assets/data/ecosystem.v1.json`): one more item in "Backend & Cloud". Additive change to the versioned data file (schema 1 unchanged). Covers ECO-024.
- **Guard tests** (`scripts/portfolio-refresh.test.mjs`, `scripts/ecosystem-bar.test.mjs`): VIS-003 live count 14 → 15; new tests for PRJ-024, PRJ-025, ECO-022, ECO-023; ECO-002 expects the modernizer URL.

## Data model changes

None: `projects.json` keeps its fields; `thumbnail` was introduced by VIS-003.

## Key decisions

- **Decision**: repositories without a live site show a capture of their README on GitHub rather than an icon.
  - **Discarded alternative**: keep the icon tiles for them (uneven gallery; the owner asked for a capture on every repository); build a web page for each (separate work in each repository, proposed as follow-up).
  - **Rationale**: the capture shows what the link opens, is honest about the state (code, not a demo) and keeps the six tiles visually uniform.
- **Decision**: when a repository publishes a live site, the ecosystem tile links the site and a small chip keeps the GitHub link.
  - **Discarded alternative**: tile to GitHub with the site as the chip (the picture shows the site, so the main click should open it).
  - **Rationale**: the owner's goal is a link that proves the project runs online; ECO-020 (every repository linked to GitHub) stays true through the chip.
- **Decision**: README captures live under `/assets/images/repos/`, live-site captures under `/assets/images/demos/`.
  - **Rationale**: VIS-003 reserves `demos/<id>.webp` for live demos; the path says what the picture is.
- **Decision**: docs consolidation deferred until pull request #23 merges.
  - **Rationale**: another session is rewriting `docs/10-requirements.md`, `docs/50-traceability.md` and `docs/90-changelog.md`; two writers on those files would overwrite each other.

## Test strategy

- Node test files above, run with `node --test`, then the full `npm run check` (localized build, performance budget, SEO, claims).
- Browser check of the home: live-demos strip (15 tiles), catalog cards for the two entries, ecosystem tiles at 1440 px and 390 px.

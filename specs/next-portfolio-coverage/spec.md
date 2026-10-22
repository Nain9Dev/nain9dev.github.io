# Portfolio coverage: every public repository with a link and a capture

Status: In progress

## Objective

Owner request of 2026-10-22: every repository of the `Nain9Dev` GitHub account must appear on www.naindev.com with a link that shows it in use online and a capture, in the same visual form as the live demos already have (ParametriCAD, Nain3D, NainPolicy, NainOrder...). The same review names the next repository to improve visually.

## Inventory (2026-10-22, `gh repo list`)

| Repository | Where it is listed | Live site | Capture before | Gap |
| :--- | :--- | :--- | :--- | :--- |
| parametricad-ai, Nain3D, NainPolicy, NainOrder, NainNotify, NainConfigurator, NainDrive, NainTAI, Orbe3D, PongArcade, NainProspect, NainWrite, GameHaven, HaveTickets | Catalog card and live-demos strip | `*.naindev.com` | Yes | None |
| NainLegacyModernizer | Catalog card (`nain-legacy-modernizer`) | `https://modernizer.naindev.com/` (GitHub Pages, live, not linked) | No | Link, status and capture (PRJ-024) |
| nain-mcp-validator | Catalog card | None | No | README capture (PRJ-025) |
| brandbook | Open ecosystem tile (GitHub link) | `https://brand.naindev.com/` (not linked) | No | Site link and capture (ECO-022, ECO-023) |
| status | Open ecosystem tile (GitHub link) | `https://status.naindev.com/` (not linked) | No | Site link and capture (ECO-022, ECO-023) |
| engineering-handbook, template-dotnet-clean-arch, template-fastapi-vue-clean-arch, .github | Open ecosystem tile (GitHub link) | None | No | README capture (ECO-022) |
| tai-study-system-js (archived) | Linked from the NainTAI card | Vercel (archived) | n/a | None |
| Nain9Dev (profile README), nain9dev.github.io (this site) | Not projects | n/a | n/a | None |

Every live site answered HTTP 200 on 2026-10-22. No repository is missing from the site; the gaps are links and captures.

## Requirements

- **PRJ-024**: When a catalogued public repository publishes a live site on a `naindev.com` subdomain, the catalog shall link it with the demo label before the repository link, give it the status `Demo pública activa` and show its capture at `/assets/images/demos/<id>.webp` (NainLegacyModernizer → `https://modernizer.naindev.com/`).
- **PRJ-025**: When a catalogued public repository has no live site, its card shall show a capture of its README as rendered on GitHub, at `/assets/images/repos/<id>.webp` with the same size and weight limits as VIS-003, so every public entry carries a picture (nain-mcp-validator).
- **ECO-022**: Each open-ecosystem tile shall show a capture (640x360 WebP under 30 KB with a 400x225 variant under 10 KB, lazy-loaded with explicit dimensions): of the live site when the repository publishes one on a `naindev.com` subdomain (`brandbook`, `status`), otherwise of its README on GitHub.
- **ECO-023**: When a repository publishes a live site, its tile shall link that site and keep a secondary link to the repository on GitHub; otherwise the tile shall link GitHub. Every link opens in a new tab with `rel="noopener noreferrer"`; the section still needs no client JavaScript (ECO-021).
- **ECO-024**: The suite bar catalog (`public/assets/data/ecosystem.v1.json`) shall list the NainLegacyModernizer demo in the backend category, so every live demo is reachable from the bar on every subdomain.

## Edge cases and error handling

- README captures use GitHub's dark colour scheme (signed-out GitHub follows `prefers-color-scheme`) and clip the rendered article only, so no account chrome, avatar or banner appears.
- The `.github` repository capture is stored as `dot-github.webp` (a leading dot would hide the file on Unix tooling).
- Private entries keep no thumbnail (VIS-003); the live-demos strip keeps listing only `naindev.com` links, so a README capture never appears there.
- The captures are decorative (`alt=""`): the tile text names the repository.

## Out of scope

- Building a web demo for the repositories that have none (nain-mcp-validator, engineering-handbook, both templates): separate work in those repositories, proposed to the owner.
- Consolidating these requirements into `docs/10-requirements.md`, `docs/50-traceability.md` and `docs/90-changelog.md`: deferred until pull request #23 (docs consolidation of specs 045 to 047) is merged, to avoid editing the same documents in parallel.

## Acceptance criteria

- `scripts/portfolio-refresh.test.mjs` covers PRJ-024, PRJ-025, ECO-022 and ECO-023; `scripts/ecosystem-bar.test.mjs` covers ECO-024.
- `npm run check` passes; the home shows 15 live-demo tiles and 6 ecosystem tiles with captures, checked in the browser at desktop and phone widths.

## Visual review of the existing demos (2026-10-22)

Judged on the first screen each demo shows, which is what the capture and the visitor see:

1. **NainTAI** (`tai.naindev.com`): the first screen is a sign-in form; nothing of the simulator is visible without an account. Weakest capture of the set. Next to improve: a public landing or a guest mode that shows the exam experience.
2. **NainOrder** (`order.naindev.com`): the dashboard opens with every metric at zero and empty charts. Seeded demo data would make the first screen read as a running system.
3. **ParametriCAD AI** (`parametricad.naindev.com`): the viewer opens on a plain grey tube; a richer default part and a visible result panel would carry the card.
4. **Orbe3D**: a title screen, acceptable for a game but static; a gameplay frame would say more.

The rest (NainDrive, NainPolicy, NainNotify, HaveTickets, GameHaven, Nain3D, NainConfigurator, NainWrite, NainProspect, PongArcade) open on a screen that already shows the product.

## Session state

- Last updated: 2026-10-22, session portfolio-coverage (worktree `D:/wt/nain9dev.github.io-feat-portfolio-coverage`, branch `feat/portfolio-coverage`)
- Done: T01 to T05. Inventory and live-site checks; captures (outside the repository, DevTools protocol, 1280x720 first screen or README article clip with a 28 px margin, dark scheme); catalog data, ecosystem tiles with captures and site links, suite bar item, guard tests; seven reviewed English entries added to `src/i18n/en-US.json` (the tile markup changed, so the segments changed).
- Verified: full `npm run check` exit 0 (243 tests, bilingual build of 148 outputs, SEO, locales and claims contracts); home 27.1 KiB gzip and `/en/` 26.6 KiB (ADR-0013 ceiling 30 KiB); strip with 15 tiles, the two cards and the six ecosystem tiles checked at 1440 px and 390 px on the local preview (port 4323) and on `/en/`. Nothing committed.
- Next: owner decisions on T06 (web pages for the repositories without one; first screens of NainTAI, NainOrder, ParametriCAD); commit and pull request when the owner asks; T07 once pull request #23 is merged.
- Blocked: —

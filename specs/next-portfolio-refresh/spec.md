# Portfolio refresh: live demos, Nain3D and structured data

Status: In progress

## Objective

Owner request of 2026-10-19 (autonomous session): make the portfolio more visual and less text-heavy, keep the repository and demo list current, and strengthen search presence. The reviews section stays paused until the review service is configured.

## Requirements

- PRJ-020: When a public demo exists on a `*.naindev.com` subdomain, the catalog shall link that address instead of a third-party host (`order.naindev.com`, `policy.naindev.com`, `drive.naindev.com`).
- PRJ-021: The catalog shall list the public repository `Nain9Dev/Nain3D` with its live demo `https://3d.naindev.com/`, directly after `parametricad-ai`, without the `production` category and without commercial 3D wording that belongs to the Contrast3D site.
- PRJ-022: The catalog shall add a live demo link for NainNotify (`https://notify.naindev.com/`) and keep every project order unique and sequential.
- VIS-001: The home page shall show a live-demos strip between the proof strip and the services, built at build time from `projects.json` (every link on a `naindev.com` subdomain), with no client JavaScript and no iframe.
- VIS-002: Each live-demo tile shall show the project title, its subdomain as an immutable identifier and a link that opens in a new tab with `rel="noopener noreferrer"`.
- SEO-020: The home page JSON-LD shall include an `ItemList` of the public catalog projects with absolute URLs, so search engines read the list of projects and repositories.

- PRJ-023: The catalog shall present NainProspect and NainWrite as public projects linking `https://github.com/Nain9Dev/NainProspect` and `https://github.com/Nain9Dev/NainWrite` (owner decision 2026-10-19); six private entries remain.

- VIS-003: When a project has a live demo on a `naindev.com` subdomain, its catalog card shall show a decorative 640x360 WebP thumbnail (under 30 KB) at `/assets/images/demos/<id>.webp`, lazy-loaded with explicit dimensions.

## Out of scope

- The reviews and recommendations section (paused by the owner until the review service is configured).
- The private projects list and their wording.

## Session state

- Last updated: 2026-10-19
- Done: PRJ-020 to PRJ-022, VIS-001, VIS-002, SEO-020 implemented test first (`scripts/portfolio-refresh.test.mjs`); English catalog entries added; full `npm run check` green (exit 0); strip checked in the browser (9 tiles). Nothing committed.
- Done (later): PRJ-023 (owner approved 2026-10-19) and VIS-003 thumbnails for 9 live demos; full `npm run check` green; cards checked in the browser.
- Next (superseded list): owner decisions on NainProspect/NainWrite in the catalog and on the next visual step (project thumbnails, hero reduction); consolidate requirements into `docs/10-requirements.md` and traceability in `docs/50-traceability.md` when merged.
- Blocked: —

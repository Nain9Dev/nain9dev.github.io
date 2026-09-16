# Remove Case Studies Tasks

- [x] [H] Owner decides to remove every case study from the live site and keep old URLs redirecting (2026-09-16).
- [x] [A] Specify CASE-001 to CASE-008 and the redirect map.
- [x] [A] Map every tracked reference.
- [x] [A] Add `scripts/case-studies.test.mjs`, wire it into `npm run check` and observe failure against a build of `HEAD`.
- [x] [A] Remove pages, collection, home section, links, wording, dead JS, data and CSS; add redirects.
- [x] [A] Add 37 reviewed English catalog entries and remove 150 unused ones.
- [x] [A] Run the full `npm run check`.
- [x] [M] Owner authorized removal; committed and pushed as `6b52b08`.
  - **Needs from owner**: approval of the assumptions in `plan.md` and the commit.
- [x] [A] After deployment, confirm in production that `/casos/`, `/casos/stealth-3d-ai/`, `/casos/optimizacion-saas/` and their English equivalents redirect, and that header, hero and home show no case studies.

## Handoff

- Done: Case-study collection, pages, home section, header link, hero button,
  technology page section, thank-you block, service page links and terminal
  link removed. Hero now links "Ver Servicios" to `/servicios/`. Dead
  `case-studies.js`, `case-studies.json`, the terminal analytics hook and
  unused CSS selectors removed. Eleven redirects declared (five case-study
  URLs, three retired technology pages, three pre-existing). Catalog: 37 new
  reviewed entries, 150 unused entries removed, 1391 entries, 0 pending, 0 unused.
- Verified: `scripts/case-studies.test.mjs` against a fresh build of `HEAD`:
  6 tests, 0 pass, 6 fail (case-study pages present, link and wording findings on every page,
  home section present, `/casos/` not a redirect, terminal link, sitemap URLs).
  After the change, full `npm run check` exits 0: 18 unit tests pass;
  `astro check` 0 errors, 0 warnings, 28 hints; bilingual build 146 outputs,
  60 indexable language URLs; brand icon contract passes; `seo.test.mjs` 3 of 3;
  SEO contract 130 pages, 22 redirects, 60 indexable URLs; localization
  contract 65 language pairs; `case-studies.test.mjs` 6 of 6; claim scan passes.
  Astro redirect output inspected (meta refresh, `noindex`, canonical; see
  `plan.md`).
- Next: None. Production checked 2026-09-16 after deploy of `6b52b08`: home (ES/EN), thank-you, services and C# technology pages have no case-study links; `/casos/`, `/casos/stealth-3d-ai` and `/en/case-studies/optimizacion-saas` serve meta refresh to `/servicios/`, `/servicios/validacion-3d/` and `/en/services/optimizacion-rendimiento-apirest-dotnet/` (GitHub Pages adds a 301 for the trailing slash; no true 301 to the target).
- Blocked: nothing. HTTP 301 is not possible on GitHub Pages (known limit).

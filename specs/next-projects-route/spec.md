# Specification: A /proyectos/ catalog and a 3D bridge to the Contrast3D products

Status: Draft (branch `chore/projects-route`, from `origin/main` `473d427`). Interview answers of 2026-10-29, `specs/next-design-fusion` layer 5.

## Objective

Two owner decisions, taken in the interview of 2026-10-29:

1. **Positioning.** naindev.com is pure software: backend, critical systems, AI and the tooling around them. Every 3D product is promoted by its own site: DSE (`datumstatutum.com`, deterministic conformance) and Contrast Viewer (`viewer.contrast3dhub.com`, once public), with Contrast3D (`www.contrast3d.com`) as the design and CGI studio. naindev.com keeps a single bridge to them, without losing the indexed URLs that exist today.
2. **Catalog.** The home shows six featured software projects and a link to a `/proyectos/` page that holds the whole filterable catalog, so the home gets lighter (the document is within 1 KB of the 30 720 B tripwire, ADR-0013).

## Decisions (from the owner, 2026-10-29)

| # | Decision | Answer |
| :--- | :--- | :--- |
| D1 | What the home shows in "Proyectos y demos" | Six featured projects and a "see all" link |
| D2 | Which six | Collaborative CRM (private, in production), Policy Operations API, .NET modernization harness, NainOrder, notification microservice, driving-school invoicing |
| D3 | How 3D is handled | A bridge to Contrast3D: the 3D projects leave the catalog, one entry points to DSE and Contrast Viewer, the 3D service page and the Nain3D case stay as bridge pages with links to those products, no URL is removed |
| D4 | Destinations | `datumstatutum.com` (DSE, public today), `viewer.contrast3d.com` (Contrast Viewer product site, to be created; D5), `www.contrast3d.com` (studio) |
| D5 | Contrast Viewer site (owner, later the same day) | A new static marketing site on `viewer.contrast3d.com`, cloned from the DSE `web/` generator on Cloudflare Pages. The app host `viewer.contrast3dhub.com` keeps its access gate untouched, and no public path is added to it (ADR-0012 of the viewer rejected one). The site reuses only public material and names no client |
| D6 | DSE indexing (owner, later the same day) | The `noindex` of `datumstatutum.com` (meta, `_headers`, `robots.txt`) is lifted now; the change is prepared in the DSE repository and published by the owner |
| D7 | Contrast Hub | Mentioned on naindev.com only as an example of private software built (CRM, calculations), with no screenshots, no host and no client data |
| D8 | Goal | naindev.com promotes DSE and Contrast Viewer as products with their own public sites, and stays focused on software, full stack and backend; the 3D bridge becomes a "products" band that links to both |

## Functional requirements (EARS)

- **NPR-001 (home selection)**: When the home is built, the projects section shall list exactly the six projects of D2, in that order, each with its status, summary and links from `public/assets/data/projects.json`, followed by a link to `/proyectos/` that states the catalog size.
- **NPR-002 (catalog page)**: When `/proyectos/` and `/en/projects/` are built, they shall show every catalog project with the existing filters (all, production, .NET, Python and data, demos), the static text index without JavaScript, and the same status wording as the home.
- **NPR-003 (3D leaves the catalog)**: When the catalog is built, the projects `conformance-architecture`, `interactive-3d-viewer`, `nain3d-conformance-gateway`, `nain-mcp-validator`, `parametricad-ai`, `orbe-runner-3d` and `pong-arcade` shall not be listed as separate projects; one bridge entry shall name DSE, Contrast Viewer and Contrast3D with a link each.
- **NPR-004 (no URL removed)**: While the migration runs, every URL in the sitemap today (`/servicios/validacion-3d`, `/trabajo/nain3d-conformance-gateway/` and the English paths) shall keep answering 200 or a permanent redirect, and the SEO contract (`check:seo`) shall list no broken internal link.
- **NPR-005 (links only to public pages)**: A link to Contrast Viewer shall point to `viewer.contrast3d.com` and be rendered only when that site answers 200; until then the bridge shall show DSE and Contrast3D alone. No page of naindev.com shall link `viewer.contrast3dhub.com` or any host of the Contrast Hub.
- **NPR-007 (Contrast Viewer site)**: When the Contrast Viewer site is built, it shall be static, bilingual and free of client names, internal hostnames, keys and demo models without a CC0 or CC-BY credit; it shall not use the words "certified" or "AI-powered" nor state a public price.
- **NPR-006 (message)**: When the hero, the services and the structured data mention 3D, they shall describe NainDev's own work (validation architecture, contracts, tooling) and point to DSE for the product, and no sentence shall claim that NainDev sells 3D production or CGI.

## Edge cases and error handling

- The three private production projects keep their anonymized diagrams (spec 049/ADR-next-private-project-diagrams); only the 3D ones (`conformance-architecture`, `interactive-3d-viewer`) are absorbed into the bridge, and their diagrams are kept in the repository for the day the viewer is public.
- Work pages under `/trabajo/` keep their `SoftwareSourceCode` data; the Nain3D page gains a visible pointer to DSE and a canonical note, not a redirect (D3).
- Filters: a catalog without 3D loses the "3D" filter; the localization pipeline needs the changed segments (`npm run translations:generate`).
- The "free call" and the services links in the hero are unchanged.

## Out of scope

- Building the Contrast Viewer site (its own repository and specification, T07) and the DSE site changes (in the DSE repository). DNS and the Pages project for `viewer.contrast3d.com` are owner actions (B-022).
- David's services diagrams and the credit to David (separate layers of `specs/next-design-fusion`).
- Removing any 3D URL (a later ADR, with redirects, if the owner wants it).

## Acceptance criteria

- `npm run check` green with a new guard `scripts/projects-route.test.mjs` (NPR-001 to NPR-006), written first.
- Home document smaller than today's 29 058 B gzip; `/proyectos/` measured and under the inner-page budget.
- `check:seo` and `check:locales` pass with `/proyectos/` and `/en/projects/` indexable and the sitemap updated.
- Browser pass at 1440 and 390 px in both themes.

## Session state

Interview closed on 2026-10-29; spec, plan and tasks written; no code yet.

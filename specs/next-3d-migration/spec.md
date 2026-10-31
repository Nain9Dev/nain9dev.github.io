# Specification: Move the 3D showcases out of this portfolio without breaking a URL

Status: Draft. Nothing here is applied; it waits for B-023 and B-024 (the repository moves) and for the owner's answers below.

## Objective

The owner decided on 2026-10-31 (OQ-017) that the 3D showcases leave this portfolio: DSE receives Nain3D, ParametriCAD and the MCP validator; the Contrast Viewer site receives the interactive viewer; Orbe Runner and Pong leave; Contrast Hub stays private. This spec inventories every URL and data entry the move touches so the change can be made later in one safe pass, with a permanent redirect for every indexed page that goes away.

## Inventory of what the move touches (checked 2026-10-31)

| Item | Where | Today | Proposed handling | Needs the owner |
| :--- | :--- | :--- | :--- | :--- |
| Case page `/trabajo/nain3d-conformance-gateway/` | `src/content/work/nain3d-conformance-gateway.mdx` | Indexed, linked from the home (selected work) | 301 to the Nain3D page on the DSE site, then remove the entry | Destination URL on the DSE site |
| Case page `/trabajo/parametricad-ai/` | `src/content/work/parametricad-ai.mdx` | Indexed, linked from the home | 301 to its page on the DSE site, then remove | Destination URL |
| Selected work on the home | `projects.json` (`selected: true`), `SelectedWork.astro` | Two of four cases are 3D | Replace the two with one case that links DSE (B-026) | Wording of the replacement case |
| Demo host `3d.naindev.com` | DNS and hosting, outside this repository | Live demo of Nain3D | Redirect or retire when the DSE site hosts the demo | Where the demo lives next; DNS |
| Demo host `parametricad.naindev.com` | DNS and hosting, outside this repository | Live demo of ParametriCAD | Same | Same |
| Catalog bridge row `contrast3d-products` | `projects.json` | One row for the seven 3D projects, links DSE | Keep; it already points to the new homes | None |
| 3D projects behind the bridge | `projects.json` (`bridge: true`) | `conformance-architecture`, `interactive-3d-viewer`, `parametricad-ai`, `nain3d-conformance-gateway`, `nain-mcp-validator`, `orbe-runner-3d`, `pong-arcade` | Remove `orbe-runner-3d` and `pong-arcade` (owner decision); the others follow their repository | None for the games |
| Products band | `ProductsBand.astro` | Links DSE and the Viewer site | Keep | None |
| Service pages about 3D | `src/content/servicios/` (`validacion-3d`, `optimizacion-carga-3d`, `backend-escalable-modelos-3d-azure`, `sistemas-validacion-geometrica-nube`, `procesamiento-3d-healthcare`) | Indexed NainDev offers (backend and validation for 3D) | **Recommendation: keep.** They sell NainDev's own backend work and carry the search ranking for it | Confirm |
| Blog posts about 3D | `src/content/blog/` (eight of eleven mention 3D in their tags or title) | Indexed technical articles in C# and .NET | **Recommendation: keep.** They are backend engineering content, not product pages | Confirm |
| Existing redirects that land on a 3D service | `astro.config.mjs` (`/casos/stealth-3d-ai` and others) | Point to `/servicios/validacion-3d/` | Unchanged while the service pages stay | None |

## Functional requirements (EARS)

- **M3-001 (no broken URL)**: When a page that is indexed today leaves this site, the build shall answer it with a permanent redirect (`astro.config.mjs` `redirects`) to its new home, and a guard shall fail if a removed work entry has no redirect.
- **M3-002 (order of work)**: The site shall drop a 3D case only after its new page answers 200 on the DSE site; until then the case page and the home keep it.
- **M3-003 (home)**: When the two 3D selected cases are removed, the home shall show one replacement case that links DSE, and the selected-work guards shall be updated in the same change.
- **M3-004 (games)**: When `orbe-runner-3d` and `pong-arcade` are removed from `projects.json`, the catalog counts and every guard that counts projects shall be updated in the same change.
- **M3-005 (what stays)**: The service pages and the blog posts about 3D shall stay unless the owner decides otherwise, because they carry NainDev's own backend positioning.

## Open questions for the owner

1. Destination URLs on the DSE site for the Nain3D and ParametriCAD pages (needed for M3-001).
2. Where the two live demos will be hosted after the move, so the old hosts can redirect.
3. Whether the service pages and the blog posts stay as recommended (M3-005).

## Not in this spec

Moving the repositories and the DNS changes are the owner's tasks (B-023, B-024). This spec changes no file of the site.

# Plan: A /proyectos/ catalog and a 3D bridge

## Approach

Three small pull requests, each one guarded first and measured. The catalog data stays in `public/assets/data/projects.json` (one source for the home, the new page, the structured data and the filters), so no content is copied.

1. **Catalog page** (NPR-002). `src/pages/proyectos/index.astro` and the English twin reuse the existing catalog renderer and the filter module; the inner-page stylesheet pattern of ADR-0017 applies (`inner.css`, never the layout). The sitemap and `englishPath` mapping list the new route. The home still shows everything at this step.
2. **Home selection** (NPR-001). `ProjectsSection.astro` renders the six featured projects (a `featured` order read from the data, replacing the current 12 flags) and the link with the count. The client renderer and its filter bar move to the catalog page, which lowers the home's weight.
3. **3D bridge** (NPR-003 to NPR-006). The seven 3D projects get a `bridge` marker in the data and are replaced in the catalog by one entry; the 3D service page and the Nain3D case page keep their URLs and gain the pointer to DSE and Contrast3D; the hero summary and structured data are reviewed for the wording of NPR-006.

## Data change

`projects.json` gains `featuredOrder` (1 to 6, absent otherwise) and `bridge: true` on the seven 3D entries; the old `featured` flag is read-only until step 2 removes its uses.

## Risks

- **SEO**: the Nain3D page and the 3D service page are indexed; they stay (NPR-004). A redirect is a later, separate decision.
- **Weight**: the inner page loads the catalog JSON like the home does today; measured in step 1.
- **Wording**: NPR-006 touches the hero and service copy; the owner approves the sentences before step 3 merges.
- **Dependency**: the Contrast Viewer link waits for B-022; the bridge ships with DSE and Contrast3D first.

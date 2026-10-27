# Plan: Work pages and inner-page stylesheets

## Design

### Content model

- `src/content.config.ts` gains a `work` collection: `glob` over `src/content/work/*.mdx`, schema `{ project: string (projects.json id), title: string, description: string (≤ 160), lead: string, order: number }`. The MDX body holds the sections "Contexto", "Decisiones" and "Qué puedes comprobar en la demo" as plain Markdown headings and lists, so the localization build translates it block by block like the blog.
- Everything that already exists in `projects.json` (title, status, technologies, links, thumbnail, story) is read from there by `project` id at build time, never duplicated in the MDX. The eyebrow index is the project's position among the selected ones in catalog `order`, the same number the home shows.
- `src/utils/projects.ts` gains `selectedProjects()` (selected, with demo, sorted) so `SelectedWork.astro` and the work pages share the same list, and `workPath(id)` → `/trabajo/<id>/`.

### Route and layout

- `src/pages/trabajo/[id].astro`: `getStaticPaths` from the `work` collection cross-checked against `selectedProjects()`; renders `BaseLayout` with the page title, description, the capture as Open Graph image and the JSON-LD graph of WK-008 (`serializeJsonLd`, `BreadcrumbList` + `SoftwareSourceCode`). Body: `header.work-head` (eyebrow, h1, lead, capture in `figure.work-media`, links `p.work-links`), then `<Content components={{ ... }} />` for the Markdown sections, with the architecture section injected between "Contexto" and "Decisiones" through a named slot convention: the MDX uses a `<Architecture />` component imported from `src/components/work/Architecture.astro`, which renders the heading, the diagram component for that id and the paragraph passed as children. Then `section.work-stack` (chips) and `nav.work-nav` (previous, next, back to `/#selected-work`).
- `src/pages/trabajo/index.astro`: the `noindex` redirect document to `/#selected-work`, built the way the retired case-study URLs are (`astro.config.mjs` `redirects` produce the same document; adding `'/trabajo': '/#selected-work'` there is enough if Astro keeps the fragment; otherwise a tiny page with `<meta http-equiv="refresh">` and `<link rel="canonical">`).
- Diagrams: `src/components/work/diagrams/<Id>.astro`, one per project, inline `<svg role="img" aria-labelledby>` with `<title>` and `<desc>`, `viewBox` 0 0 720 360, boxes and arrows only (`<rect>`, `<path>`, `<text>`), colours via `fill="var(--color-surface)"`, `stroke="var(--color-line)"`, accent `var(--color-accent)` and text `var(--color-text)`, so both themes work without extra rules. A `<marker>` arrowhead per SVG. Labels in Spanish, short, translated by the build like any text node. The Mermaid sources go to `docs/assets/diagrams/work-<id>.mmd`.
- Localization: `hubs` in `scripts/lib/localization.mjs` gains `trabajo: 'work'`; `scripts/localization.test.mjs` gets the mapping case. New segments: the four MDX bodies (about 40 to 60 segments each), the frontmatter title, description and lead, the section headings, the link label "Cómo está hecho", the eyebrow, the navigation labels and the diagram texts. Drafted with the local translator (`scripts/translate-local.py`, Ollama) into the catalog, then every target reviewed by hand and marked `reviewed`.

### Stylesheets

- Inventory method (T02): build `main`, collect every selector of `main.css` (postcss-free: a small script splits rules on `}` and reads selectors), test each against `dist/index.html` and `dist/en/index.html` with `parse5` + a CSS selector check (`css-select` is already a transitive dependency of the test toolchain? If not, match by class and id tokens: a rule moves only when none of its class or id tokens appears in either home document). Rules whose tokens appear only in inner pages move to `src/styles/inner-pages.css` in source order, under the same section comments. Rules shared with the home stay.
- Candidates from the section map: "Content cards (shared by privacy, resource and technology pages)", "Blog Structure", "Servicios SMB", "Spec 047: inner pages" (service glyph and hub, service page, blog index, article), "Spec 047 follow-up" (technology header) and the inner-page parts of the themes block. The service glyph is also used by the home services section: checked by token, not by section.
- `inner-pages.css` is imported at the top of each inner page file (`servicios/index.astro`, `servicios/[categoria].astro`, `blog/index.astro`, `blog/[...slug].astro`, `tecnologia/[tech].astro`, `recursos/*.astro`, `privacidad.astro`, `404.astro`). Astro bundles the page's CSS and inlines it (`inlineStylesheets: 'always'`), so CSS-001 holds and no request is added. `work.css` holds the `.work-*` rules and is imported only by `trabajo/[id].astro`.
- Guards that read `main.css` by selector (`inner-pages.test.mjs`, `card-system.test.mjs`, `visual-tokens.test.mjs`, `themes.test.mjs`, `micro-interactions.test.mjs`, `polish.test.mjs`, possibly others found by `grep -l "main.css" scripts/*.test.mjs`) are pointed at the new file for the moved rules; each change is listed in `tasks.md`.
- Pixel check (IS-003): `capture-cdp.mjs` of the eleven page types before (production build of `origin/main`) and after, compared with a pixel diff script in the scratchpad (sharp is in `node_modules` through the capture tooling? If not, compare PNG buffers byte for byte after cropping the progress bar row). Any difference stops the split until explained.

### Order of work

1. T01 guard (fails on `main`).
2. T02 stylesheet split, measured and pixel-checked, committed on its own so the diff is reviewable.
3. T03 collection, route, layout, diagrams with placeholder texts; T04 texts and English; T05 home links and budget; T06 audits, captures, PR.

## Risks

- Translation volume: four pages add about 200 segments. Mitigation: local drafts, hand review, `check:locales` as the gate.
- Spec 007 guard: any "caso de estudio" in a draft fails `check:case-studies`; the texts use "trabajo", "proyecto", "demo".
- Home budget: WK-009 adds two links per case (about 300 B gzip); the split pays for it first.
- Diagram legibility on phones: 720 wide `viewBox` with at most four columns; labels of one or two words; verified at 390 px in the browser pass.
- Parallel sessions: the tidy session removes merged worktrees under `D:/wt/nain9dev.github.io-*`; this worktree has an unmerged branch and a claim line, so its checks keep it.

# Profile Coherence Plan

1. Test first: add `scripts/profile-coherence.test.mjs` covering COPY-010 to
   COPY-014 and PRJ-001 to PRJ-003, and register it in `npm run check`.
   Observe failure.
2. Hero: eyebrow, H1, summary, stack line and badges in
   `src/components/home/Hero.astro`.
3. Tech stack: rewrite `public/assets/data/tech-stack.json`; add CC0 Simple
   Icons SVGs (Vue, PostgreSQL, Tailwind CSS, Astro, Pydantic, GitHub Actions,
   MCP) with brand fill colors.
4. Terminal: `experience` and `stack` in
   `public/assets/data/terminal-commands.json`.
5. Catalog: rewrite `public/assets/data/projects.json` from each project's
   README; allow private entries without links in
   `public/assets/js/project-catalog.js`; render a private-code note in
   `public/assets/js/project-view.js` with a runtime message.
6. Translations: prepare, write reviewed English text, accept, drop unused
   entries.
7. Update requirements, traceability, tasks and changelog. Run `npm run check`.

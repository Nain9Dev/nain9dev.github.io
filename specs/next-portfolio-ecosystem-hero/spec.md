# Open ecosystem section and lighter hero

Status: In progress

## Objective

Owner decisions of 2026-10-20 (interview): list the remaining public repositories in their own section, make the first screen more visual with less text, keep the title "Arquitecto de Software Full Stack" as the source of truth, and audit SEO afterwards.

## Requirements

- ECO-020: The home page shall show an "open ecosystem" section after the project catalog, listing the public repositories `engineering-handbook`, `template-dotnet-clean-arch`, `template-fastapi-vue-clean-arch`, `brandbook`, `status` and `.github` as links to `https://github.com/Nain9Dev/<name>`, opened in a new tab with `rel="noopener noreferrer"`.
- ECO-021: Repository names shall be marked `translate="no"`; the section shall need no client JavaScript.
- HERO-020: The hero summary shall be at most two sentences and keep "conformidad determinista", "primer dominio" with "3D", "Python y .NET" and "revisión humana".
- HERO-021: The live-demos strip shall come directly after the hero, before the terminal section.

## Out of scope

- Reviews section (paused by the owner).
- Changes to the H1 or to the availability sentence.

## Session state

- Last updated: 2026-10-20
- Done: spec and answers recorded.
- Next: tests first, then `OpenEcosystem.astro`, hero summary, ordering, English entries, `npm run check`.
- Blocked: —

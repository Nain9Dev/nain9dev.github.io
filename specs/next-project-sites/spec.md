# Spec: project pages on the portfolio

## Goal

The five repositories that had no web (nain-mcp-validator, engineering-handbook, template-dotnet-clean-arch, template-fastapi-vue-clean-arch and the organisation `.github`) now publish a static page on their own subdomain. The portfolio links those pages and shows captures of them instead of captures of their README on GitHub.

## Requirements (EARS)

- **PRJ-026**: When nain-mcp-validator publishes its project page, the catalog shall link `https://mcp.naindev.com/` before the repository link and show a capture of that page at `/assets/images/demos/nain-mcp-validator.webp`.
- **ECO-025**: When `engineering-handbook`, `template-dotnet-clean-arch`, `template-fastapi-vue-clean-arch` and `.github` publish a project page (`handbook`, `template-dotnet`, `template-fastapi`, `standards` under `naindev.com`), their tiles shall link it, show a capture of it under `/assets/images/demos/` and keep the GitHub chip.

## Decisions

- Captures follow the existing rule (640x360 WebP under 30 KB, 400x225 under 10 KB, first screen at 1280x720) so the VIS-003 and ECO-022 limits apply unchanged.
- The README captures in `public/assets/images/repos/` are removed: no entry uses them any more.
- The catalog status of nain-mcp-validator stays `Herramienta pública`. The page is documentation, not an interactive demo, so it does not get the demo label.
- The suite bar catalog (`ecosystem.v1.json`) is not changed: these pages are documentation, not products of the suite.

## Out of scope

- The pages themselves: they live in each repository (`site/`, published by `.github/workflows/pages.yml`).

## Acceptance criteria

- `scripts/portfolio-refresh.test.mjs` covers PRJ-026 and ECO-025 (16 live entries in VIS-003).
- `npm run check` passes, and the home shows the five links and captures at desktop and phone widths.

## Session state

- Last updated: 2026-10-27, session project-pages (worktree `D:/wt/nain9dev.github.io-project-sites`, branch `chore/project-sites`).
- Done: the five pages are live (HTTPS served, enforcement pending the GitHub certificate); captures taken from the live pages; catalog, tiles, tests and documents updated.
- Verified: full `npm run check` exit 0 (251 tests, bilingual build, SEO, locales, claims); on the local build the six tiles link the live sites with their captures loaded, and the nain-mcp-validator card shows `Ver página`.
- Next: pull request; the owner merges.
- Blocked: HTTPS enforcement on the five repositories, `[M]`, until GitHub issues the certificates.

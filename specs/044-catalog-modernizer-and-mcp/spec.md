# Catalog additions: NainLegacyModernizer and nain-mcp-validator

Status: In progress

## Objective

On 2026-10-19 the owner authorized expanding the project catalog in `public/assets/data/projects.json` to showcase two core engineering pillars aligned with LinkedIn:
1. `nain-mcp-validator`: Standalone Model Context Protocol (MCP) server for deterministic 3D mesh invariant checks (C1-C10) and content addressing.
2. `nain-legacy-modernizer`: Zero-downtime legacy .NET modernization harness utilizing YARP reverse proxying and dual-write shadow running (.NET 10).

## Requirements

- PRJ-011: `public/assets/data/projects.json` shall list `nain-mcp-validator` with categories `["3d", "python", "backend", "data"]` at order 4 (directly following `parametricad-ai`).
- PRJ-012: `public/assets/data/projects.json` shall list `nain-legacy-modernizer` with categories `["backend", "dotnet", "demo"]` at order 6 (within the enterprise backend block).
- PRJ-013: All 21 projects shall maintain unique, sequential order indexes from 0 to 20 without gaps.
- PRJ-014: `PUBLIC_REPOS` in `scripts/profile-coherence.test.mjs` shall include `'NainLegacyModernizer'` and `'nain-mcp-validator'`.
- PRJ-015: Spanish copy and English localization translations shall be synchronized with status reviewed in `src/i18n/en-US.json`.

## Edge cases

- `nain-mcp-validator` and `nain-legacy-modernizer` are public showcase repositories and must not carry the `production` category (strictly reserved for the private enterprise triad in PRJ-009).
- Total private projects remains unchanged at 8 (`PRIVATE_COUNT = 8`).
- Both repositories link to their canonical GitHub URLs: `https://github.com/Nain9Dev/nain-mcp-validator` and `https://github.com/Nain9Dev/NainLegacyModernizer`.

## Session state

- Last updated: 2026-10-19
- Done: spec authored, test assertions updated in `profile-coherence.test.mjs`, `projects.json` updated with `nain-mcp-validator` (order 4) and `nain-legacy-modernizer` (order 6), bilingual translations in `en-US.json` reviewed, full `npm run check` pipeline verified with 156 unit/integration tests and 66 localized language pairs.
- Next: commit and push upon explicit user command.
- Blocked: —

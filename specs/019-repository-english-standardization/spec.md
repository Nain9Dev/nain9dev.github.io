# Specification: Repository English Standardization

## Overview
Standardize all repository documentation, metadata, comments, and diagnostic logs into professional, concise English without redundancies or emojis, complying with the workspace language rule while preserving end-user localized prose.

## Requirements (EARS)
- **ENG-001**: When developers or evaluators read `README.md`, it shall be written in concise, professional English without emojis, presenting the verified software architecture profile (.NET, Python, deterministic 3D/data conformance, Astro SSG), directory structure, and development commands.
- **ENG-002**: When visitors view the repository metadata on GitHub, the repository description and topics shall be in professional English reflecting deterministic conformance, .NET, Python, and 3D web systems.
- **ENG-003**: When security policies or architectural documentation (`SECURITY_POLICY.md`, `MIGRATION_LOG.md`, `IMAGE_MIGRATION_PLAN.md`) are maintained, they shall be written in professional English without non-English prose.
- **ENG-004**: When client scripts and components in `public/assets/js/` and `src/` are inspected, all comments, debug logs, and internal diagnostic warnings shall be written in professional English, while user-facing interface text continues to respect the localization system.

## Acceptance Criteria
1. Automated test `scripts/english-standardization.test.mjs` verifies that `README.md`, `SECURITY_POLICY.md`, and `public/assets/js/` contain no Spanish prose or comments and no emojis in documentation headers.
2. GitHub repository description and topics are updated via GitHub CLI (`gh repo edit`).
3. `npm run check` passes with zero errors and zero regressions.

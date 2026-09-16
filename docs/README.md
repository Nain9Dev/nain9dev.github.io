# Documentation map

Canonical documentation for www.naindev.com. Numbered by lifecycle phase; each phase closes before the next opens. Feature work lives in `../specs/NNN-feature-name/` and consolidates here.

| Phase | Document | Status |
| :--- | :--- | :--- |
| Planning | [00-charter.md](00-charter.md) | Draft |
| Analysis | [10-requirements.md](10-requirements.md) | Draft |
| Analysis | [11-open-questions.md](11-open-questions.md) | Open |
| Design | [20-architecture.md](20-architecture.md) | Draft |
| Design | [21-data-model.md](21-data-model.md) | Draft |
| Design | [30-decisions/](30-decisions/) | see each ADR |
| Development | [40-tasks.md](40-tasks.md) | Active |
| Development | [41-blockers.md](41-blockers.md) | Active |
| Testing | [50-traceability.md](50-traceability.md) | Active |
| Deployment | [60-runbook.md](60-runbook.md) | Draft |
| Maintenance | [90-changelog.md](90-changelog.md) | Active |

Other documentation kept in place:

- [06-runbook/english-localization.md](06-runbook/english-localization.md): translation workflow, predates this structure; linked from `60-runbook.md`.
- `../specs/003-english-localization/ADR-001-static-localization.md`: feature-level ADR, indexed from `30-decisions/`.
- `../design/README.md`: design brief for external collaborators.
- `../SECURITY_POLICY.md`: rules for what may be committed to this public repository.

## How to work here

1. Any change starts in a specification, never in the code.
2. New feature → new folder `specs/NNN-feature-name/` (copy `specs/000-template-feature/`): `spec.md` (EARS requirements) → `plan.md` → `tasks.md`.
3. Stable requirements are consolidated in `10-requirements.md`. This project keeps the per-feature prefixes already in use (`BR-`, `SEO-`, `LOC-`, `DES-`, `CLM-`) instead of `REQ-###`. Ambiguities go to `11-open-questions.md` and block their requirement.
4. Significant decisions become ADRs under `30-decisions/`, status `Proposed`. Only the owner approves.
5. List every external dependency in `41-blockers.md` before writing code.
6. Implement one task at a time, test first. Tasks are labelled `[A]`, `[M]` or `[H]`.
7. Map each requirement to its test in `50-traceability.md`. A requirement with no test is not done.
8. Session handoff: before ending a session and after each task, write the current state into the active `tasks.md`. Sessions start by reading docs, never from memory.

## Task labels

| Label | Meaning |
| :--- | :--- |
| `[A]` | The agent completes it alone. |
| `[M]` | Mixed: the agent does its part but needs a human action to close it. |
| `[H]` | Human only: accounts, credentials, payments, terms, business decisions. |

If a `[M]` or `[H]` task is open and blocks progress, the agent stops and says so.

## Public repository

This repository is public. Do not add credentials, private client material, personal identifiers or unverified business claims to any document. Private planning notes belong in the git-ignored `docs/private/` (see `SECURITY_POLICY.md`).

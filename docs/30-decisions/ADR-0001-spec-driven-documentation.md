# ADR-0001: Adopt spec-driven lifecycle documentation

Status: Proposed
Date: 2026-09-16

## Context

Features 001 to 004 were specified in `specs/NNN-*/` with EARS-style requirements, plans and task handoffs, but there was no product-wide view: requirements, verification evidence, external dependencies and open questions were scattered across feature folders. The only documentation under `docs/` was `docs/06-runbook/english-localization.md`. Unverified homepage claims were noted in spec handoffs without a place to track their resolution.

## Decision

Adopt the numbered lifecycle structure under `docs/` (`00-charter` to `90-changelog`, `30-decisions/`) and the feature template `specs/000-template-feature/`. `docs/` is the stable source of truth; feature specs consolidate into it.

Project-specific choices:

- Keep existing requirement prefixes (`BR-`, `SEO-`, `LOC-`, `DES-`, `CLM-`) instead of renumbering to `REQ-###`.
- Keep existing files where they are: `docs/06-runbook/english-localization.md` is linked from `60-runbook.md`, and `specs/003-english-localization/ADR-001-static-localization.md` stays in its feature folder.

## Existing decision records

| ADR | Title | Status | Location |
| :--- | :--- | :--- | :--- |
| ADR-001 | Localize the generated static document | Proposed | `specs/003-english-localization/ADR-001-static-localization.md` |
| ADR-0001 | Adopt spec-driven lifecycle documentation | Proposed | this file |

The numbering schemes differ (`ADR-001` feature-level, `ADR-####` project-level). New project-level decisions use `ADR-####` in this folder.

## Alternatives considered

- Keep documentation only in `specs/`: no consolidated requirement or traceability view; rejected.
- Move and renumber existing specs and ADR into `docs/`: breaks existing references in commits and handoffs; rejected.
- Renumber requirements to `REQ-###`: loses the link to test names and spec text; rejected.

## Consequences

- Every new change starts with a spec and a requirement entry in `10-requirements.md`.
- `50-traceability.md` must be updated whenever a check or test is added or removed.
- The repository is public, so these documents cannot hold private strategy, credentials or personal identifiers.
- The template refers to `AGENTS.md` as the constitution, but `AGENTS.md` is git-ignored in this repository (OQ-007). Until resolved, the constitution is local-only and not reviewable by collaborators.

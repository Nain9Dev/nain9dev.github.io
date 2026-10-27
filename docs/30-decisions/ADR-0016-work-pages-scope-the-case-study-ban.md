# ADR-0016: Work pages for the owner's public projects scope the case-study ban

Status: Proposed (owner decision in the interview of 2026-10-27; approval pending in the pull request)
Date: 2026-10-27

## Context

Spec 007 (2026-09-16) retired the case studies: CASE-001 forbids any case-study page, listing or content collection in any locale, CASE-002 and CASE-003 forbid the links and the wording ("caso de estudio", "caso de éxito", "case study", "success story") on every page, and CASE-004 to CASE-007 redirect the retired URLs and keep them out of the sitemap. The pages removed were marketing case studies about client work whose claims could not be shown.

Spec 049 (selected work, 2026-10-27) put four of the owner's own public projects on the home with a three-line story each. The owner now wants each of them to have a page a technical buyer can read in a few minutes: the problem, the architecture, the decisions, what the public demo lets a visitor verify. These pages describe repositories and demos anyone can open; they name no client and carry no figure.

## Decision

- Technical write-ups of the owner's own public projects are published under `/trabajo/<id>/` (English `/en/work/<id>/`), one per project with `selected: true` in `projects.json`, from a `work` content collection. They are not case studies in the sense of spec 007: no client, no result figure, no success narrative; only what the code and the demo show.
- CASE-001 to CASE-003 are scoped, not repealed: the `/casos/` and `/en/case-studies/` routes stay retired with their redirects (CASE-004 to CASE-007 unchanged), no case-study content collection returns, and the vocabulary ban stays in force on every page, the new ones included. The site speaks of "trabajo" and "proyecto".
- `/trabajo/` without an id is a `noindex` redirect to `/#selected-work`, not a listing, so no hub of case studies reappears.
- The claims checker (`check:claims`, `claims.test.mjs`) already scans `src/content`; the new pages are covered without changes.

## Consequences

- `scripts/case-studies.test.mjs` keeps passing unchanged: the new routes do not match its patterns and the texts avoid its wordings; `scripts/case-pages.test.mjs` adds the positive contract (one page per selected project, anatomy, diagram, vocabulary).
- `docs/10-requirements.md` marks CASE-001 to CASE-003 as "scoped by ADR-0016 (spec 050)" at consolidation; the requirements keep their ids.
- If the owner later wants client case studies again, that is a new decision superseding spec 007, not an extension of this one.

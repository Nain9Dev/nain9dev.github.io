# Conformance Chassis Copy

Status: Implemented

## Objective

On 2026-09-27 the owner decided that the site describes the work done in the
Contrast3D x NainDev collaboration as a multi-domain deterministic conformance
architecture, not only as 3D validation. The product stays confidential: the
site describes the architecture and its first domain, never its name, internal
profiles, clients or results.

## Requirements

- COPY-007: When the home page is built, the About section shall describe the
  collaboration work as a multi-domain, Open Core, deterministic conformance
  architecture designed to validate products of any sector against explicit,
  versioned specifications, and shall name AI-generated 3D assets as its first
  domain.
- COPY-008: When the terminal `story` command is served, it shall describe the
  same multi-domain conformance approach and name 3D assets as the first domain.
- COPY-009: When the About section or the terminal commands are served in
  either locale, they shall not contain the internal product name ("DSE",
  "Datum Statutum Exploratum", "E3C"), internal profile identifiers (such as
  "RT-01" or "RT-FIN-01").

## Edge cases

- Only the 3D domain is implemented today. The copy describes the other domains
  as the purpose of the design ("diseñada para"), never as running validators.
- The English page is generated from the reviewed catalog entries.

## Out of scope

- The role sentence (COPY-003) and the full-time enterprise job sentence.
- Service pages and blog posts about 3D validation.
- Any claim of shared clients, joint projects or results (spec 009 rule stays).

## Acceptance criteria

- `npm run check` passes with the new tests in `scripts/offer-copy.test.mjs`.
- The English About section and terminal story read the reviewed translation.

## Session state

- Last updated: 2026-09-27
- Done: see `tasks.md`.
- Next: owner commit and deploy, then production check.
- Blocked: —

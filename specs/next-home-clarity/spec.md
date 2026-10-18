# Home clarity improvements

Status: In progress

## Objective

Make the home page clearer and more useful for a CTO or founder arriving for the first time, without adding claims. Items come from the 2026-10-18 review, in order: hero headline, Spanish labels, server-rendered project catalog, footer label and call-to-action hierarchy. The owner chose to put the "full stack software architect" profile in the headline (2026-10-18).

## Requirements

- HERO-001: When the home page is rendered, its single H1 shall state the profile "Arquitecto de software full stack" and a concrete value (reliable backend, verifiable AI), instead of the abstract "reglas deterministas" phrase.
- HERO-002: The hero summary shall keep the deterministic multi-domain conformance description with 3D as the first domain (COPY-010) and mention Python, .NET and human-reviewed AI.
- HERO-003: The hero eyebrow shall not repeat the job title already shown in the H1.
- LABEL-001: When the Spanish home page is rendered, the tech stack section and its categories shall use Spanish labels (no "Skills", "Tech Stack", "Languages", "Tools", "Data", "AI & DevOps").
- CAT-001: When the home page is served as static HTML, the project catalog shall be present in the markup (no "Cargando proyectos…" placeholder as the only content).
- FOOT-001: The footer status link shall be labelled by its destination ("Estado del servicio"), not "Sistemas Operativos".
- CTA-001: The contact section shall present one primary action (book a call) and one secondary action (copy email), without repeating the same booking button more than twice on the page.

## Edge cases

- English strings are generated from reviewed catalog entries (`src/i18n/en-US.json`); every changed Spanish string needs a reviewed English target.
- No new metrics, clients or availability promises (see `docs/11-open-questions.md`).

## Out of scope

- Visual redesign (David, `design/home-redesign`), problem landing pages, recurring partner link on contrast3d.com.

## Session state

- Last updated: 2026-10-18
- Done: spec draft.
- Next: HERO-001..003 and LABEL-001 (tests first), then CAT-001, FOOT-001, CTA-001.
- Blocked: —

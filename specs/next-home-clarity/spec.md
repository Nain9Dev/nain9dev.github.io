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
- AVAIL-001: The home page shall state availability as part-time, remote work with scope agreed on the first call; it shall not mention weekends and the hero panel badge shall read "Tiempo parcial" instead of a bare "Disponible" (owner decision 2026-10-18).
- CTA-001: Every booking link shall offer a call ("Agendar llamada gratuita"; the header uses "Agendar llamada"; the audit service page may keep "Agendar Auditoría de Sistemas") and no link shall promise a free audit, diagnosis or consultancy, matching the brief (owner decision 2026-10-18).

## Edge cases

- English strings are generated from reviewed catalog entries (`src/i18n/en-US.json`); every changed Spanish string needs a reviewed English target.
- No new metrics, clients or availability promises (see `docs/11-open-questions.md`).

## Out of scope

- Visual redesign (David, `design/home-redesign`), problem landing pages, recurring partner link on contrast3d.com.

## Session state

- Last updated: 2026-10-18
- Done: HERO-001..003, LABEL-001, FOOT-001 (commit 2ce2b92); CTA-001 (commit 9ba5d1a); CAT-001 implemented as a static `catalog-index` list built from `projects.json` and replaced by the client cards, `npm run check` green, budget passes (attempt 2; attempt 1 was runner noise), verified in the browser. Not committed.
- Next: owner review and commit.
- Noted, out of scope: `QuoteSimulator.astro` on `/servicios/` estimates scope and the brief says no prices; ask the owner.
- Blocked: —

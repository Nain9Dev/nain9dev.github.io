# Honest Offer Copy Tasks

- [x] [H] Owner decisions of 2026-09-16: free call instead of free audit, part-time remote availability, Contrast3D x NainDev role, terminal cleanup, OQ-008 as design goals, OQ-009 kept.
- [x] [A] Specify COPY-001 to COPY-006.
- [x] [A] Extend `scripts/check-claims.mjs` and `scripts/claims.test.mjs`; add `scripts/offer-copy.test.mjs` and wire it into `npm run check`. Observe failure.
- [x] [A] Change CTA labels, hero availability line and About role.
- [x] [A] Rewrite terminal `help`, `story`, `metrics`, `demo`, `experience` and `status`.
- [x] [A] Reword availability in four service pages as design goals.
- [x] [A] Add 37 reviewed English catalog entries and remove 47 unused ones.
- [x] [A] Resolve OQ-008 and OQ-009; update requirements, traceability, tasks and changelog.
- [x] [A] Run the full `npm run check`.
- [x] [H] Owner decisions recorded 2026-09-16; committed as `c2f17a4`.
- [x] [A] After deployment, confirm the home page, thank-you page, services hub and terminal (ES/EN) in production.

## Handoff

- Done: Every Calendly CTA that promised an audit now offers a free call
  (home hero, services hub, thank-you page, MedTech service, five blog links and
  one blog autoresponse email). Hero availability line and About role replaced.
  Terminal no longer mentions the confidential project, NDA, redacted values,
  "Grado Industrial" or telemetry; `status` was added to `help`. Service pages
  describe availability as a design goal; the logistics "Resultados Medibles"
  heading became "Objetivos de Diseño". Catalog: 1381 entries, 0 pending,
  0 unused.
- Verified: `offer-copy.test.mjs` failed 6 of 6 before the copy change (a
  tightened pattern later failed again on `clean-architecture-3d.mdx` and
  `procesamiento-3d-healthcare.mdx` before those were fixed). The new matcher
  case failed against the previous `BLOCKED_CLAIMS`; the source scan failed on
  `backend-critico-logistica.mdx` and `terminal-commands.json`. Full
  `npm run check` exits 0: 28 unit tests, `astro check` 0 errors / 0 warnings /
  28 hints, 65 pages built, brand icons, SEO contract (130 pages, 22 redirects,
  60 indexable URLs), localization contract (65 pairs), 6 case-study tests,
  claim scan. English build output checked for "free audit", "Stealth",
  "immediate availability", "NDA", "[REDACTED]" and "99.9x%": only the retired
  `/casos/stealth-3d-ai/` path inside noindex redirect documents remains.
- Next: Owner decisions on OQ-010 and on remaining audit-labelled CTAs, thank-you headline, 15-minute session wording and latency/Core Web Vitals guarantees. Production verified 2026-09-16: home (ES/EN), services hub, thank-you page and terminal data (ES/EN) show the free call, part-time availability and Contrast3D x NainDev, with no free audit, immediate availability, Stealth, NDA, REDACTED or 99.9x% text.
- Blocked: Nothing. Open follow-ups for the owner: OQ-010 (client result figures
  in two blog posts); paid-audit CTAs "Agendar Auditoría de Sistemas" and
  "Agendar Auditoría de Arquitectura" still link to the free Calendly call;
  the thank-you heading "¿Quieres que auditemos tu arquitectura actual?" and
  "sesión de 15 minutos" wording versus the 30-minute Calendly event were left
  unchanged.

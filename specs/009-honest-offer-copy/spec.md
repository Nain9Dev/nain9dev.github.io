# Honest Offer Copy

## Scope

On 2026-09-16 the owner reviewed how the site describes the offer and decided:

1. The Calendly call is a free introductory call, not a free audit.
2. The owner works a full-time job and accepts part-time, remote projects for
   companies in any country. No copy may claim immediate or full-time
   availability.
3. The About section names the current role as Lead Software Architect at
   Contrast3D x NainDev, a new collaboration with Contrast3D. The site shall not
   claim shared clients, joint projects, customers or results for it.
4. The terminal drops the confidential project, the redacted values and every
   unverified figure (uptime, p95 latency, database load, "industrial grade").
5. OQ-008: availability in service pages and blog posts is a design goal, not an
   achieved or guaranteed result.
6. OQ-009: the personal address in privacy policy section 7 stays, because the
   Google app verification requires it. No change to `privacidad.astro`.

## Requirements

- COPY-001: When the site is built, no call to action in either locale shall
  offer a free audit. The Calendly buttons formerly labelled "Agendar Auditoría
  Gratuita" shall read "Agendar llamada gratuita", with their URLs and UTM
  parameters unchanged.
- COPY-002: When the home page is built, the hero availability line shall read
  "Acepto proyectos a tiempo parcial y en remoto para empresas de cualquier
  país.", and no source shall claim immediate availability.
- COPY-003: When the home page is built, the About section shall describe the
  role as "Lead Software Architect en Contrast3D x NainDev, la colaboración con
  Contrast3D" and shall not mention a stealth startup.
- COPY-004: When the terminal commands are served in either locale, they shall
  contain no confidential or NDA project, no redacted value and no telemetry or
  performance figure; `story` shall describe the problem solved and name
  Contrast3D x NainDev only as a collaboration; `metrics` shall state that no
  public metrics exist yet; `status` shall show availability for part-time
  remote projects; `contact` shall keep `contact@naindev.com`.
- COPY-005: When a service page or blog post describes availability or
  zero-downtime deployments, it shall present them as design goals and shall
  not state a guaranteed availability percentage.
- COPY-006: When an availability percentage of the form "99.9x%", a p95 latency
  reading, an uptime reading or a "[REDACTED]" placeholder returns to sources,
  runtime data or build output, `npm run check` shall fail and name the file.

## Affected content

| File | Change |
| :--- | :--- |
| `src/components/home/Hero.astro` | CTA label and availability line |
| `src/components/home/AboutSection.astro` | Role sentence |
| `src/pages/recursos/gracias.astro`, `src/pages/servicios/index.astro` | CTA label |
| `src/content/blog/clean-architecture-dotnet-ia.mdx`, `optimizacion-modelos-3d-nube-csharp.mdx`, `validacion-3d-backend-csharp.mdx` | Calendly link text promising an audit |
| `public/assets/data/terminal-commands.json` | `help`, `story`, `metrics`, `demo`, `experience`, `status` |
| `src/content/servicios/backend-critico-logistica.mdx`, `procesamiento-3d-healthcare.mdx`, `sistemas-criticos-dotnet.mdx`, `auditoria-sistemas.mdx` | Availability wording as design goals |
| `src/i18n/en-US.json` | Reviewed entries for changed segments; unused entries removed |

## Non-goals

- Calendly URLs, UTM parameters and event duration.
- The paid audit service (`auditoria-sistemas.mdx`) and its "diagnóstico" CTA.
- "zero downtime" used as a technique name in body text (blog post
  `escalar-procesamiento-3d-csharp-nube.mdx`, terminal `stack`).
- The About sentence stating the owner's full-time enterprise job: it is true
  and claims no availability.
- Privacy policy section 7 (OQ-009, kept).
- Non-availability guarantees elsewhere (for example "baja latencia
  garantizada" in `arquitectura-ia-fintech.mdx`). Not covered by OQ-008.

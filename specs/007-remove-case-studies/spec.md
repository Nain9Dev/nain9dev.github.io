# Remove Case Studies

Status: Implemented, owner review and production verification pending

## Scope

On 2026-09-16 the owner decided to remove the case studies ("casos de estudio")
from the live site entirely. They must not be shown or linked anywhere, in
either locale. Search equity must be preserved: every retired URL redirects to
the most related existing page instead of returning 404.

Retired pages:

- `/casos/`, `/casos/stealth-3d-ai/`, `/casos/optimizacion-saas/`
- Legacy `/casos/stealth-3d-ai.html` and `/casos/optimizacion-saas.html`
- English equivalents under `/en/case-studies/`
- Technology pages that existed only because a case study declared the
  technology: `/tecnologia/ONNX/`, `/tecnologia/Kubernetes/`,
  `/tecnologia/.NET Core/` and their `/en/technology/` equivalents

## Requirements

- CASE-001: When the site is built, the system shall not publish a case-study
  page, listing or content collection in any locale.
- CASE-002: When any non-redirect page is built, it shall contain no link to
  `/casos/` or `/en/case-studies/`, including the header navigation, the hero
  secondary button, the home page section, technology pages, service pages and
  the thank-you page.
- CASE-003: When the home page is built in either locale, it shall contain no
  case-study section, no case-study wording and no case-study client script.
- CASE-004: When a visitor requests a retired case-study URL (clean, trailing
  slash or legacy `.html`) in either locale, the site shall serve a `noindex`
  redirect document whose refresh target and canonical point to the chosen
  existing page in the same locale.
- CASE-005: When a visitor requests a technology page retired as a consequence
  of CASE-001, the site shall serve a redirect document to the service page
  related to the retired case study, in the same locale.
- CASE-006: When the terminal commands or runtime data files are served in
  either locale, they shall contain no link to a case study.
- CASE-007: When the sitemap is generated, it shall list no case-study URL.
- CASE-008: When `npm run check` runs, the SEO contract (SEO-004, SEO-006,
  SEO-009) and localization contract (LOC-002, LOC-004, LOC-008) shall still
  pass, with zero pending translation segments and zero unused catalog entries.

SEO-007 previously required the primary navigation to link to the case hub.
CASE-002 supersedes that clause; the header keeps the service and blog hubs.

## Redirect map

| Retired URL | Spanish target | English target |
| :--- | :--- | :--- |
| `/casos/` | `/servicios/` | `/en/services/` |
| `/casos/stealth-3d-ai/` | `/servicios/validacion-3d/` | `/en/services/validacion-3d/` |
| `/casos/stealth-3d-ai.html` | `/servicios/validacion-3d/` | `/en/services/validacion-3d/` |
| `/casos/optimizacion-saas/` | `/servicios/optimizacion-rendimiento-apirest-dotnet/` | `/en/services/optimizacion-rendimiento-apirest-dotnet/` |
| `/casos/optimizacion-saas.html` | `/servicios/optimizacion-rendimiento-apirest-dotnet/` | `/en/services/optimizacion-rendimiento-apirest-dotnet/` |
| `/tecnologia/ONNX/` | `/servicios/validacion-3d/` | `/en/services/validacion-3d/` |
| `/tecnologia/Kubernetes/` | `/servicios/optimizacion-rendimiento-apirest-dotnet/` | `/en/services/optimizacion-rendimiento-apirest-dotnet/` |
| `/tecnologia/.NET Core/` | `/servicios/optimizacion-rendimiento-apirest-dotnet/` | `/en/services/optimizacion-rendimiento-apirest-dotnet/` |

English retired URLs keep the hub mapping `casos` → `case-studies` and
`tecnologia` → `technology`.

## Affected content

| File | Change |
| :--- | :--- |
| `src/pages/casos/index.astro`, `src/pages/casos/[...slug].astro` | Deleted |
| `src/content/casos/*.mdx` | Deleted |
| `src/content.config.ts` | `casos` collection removed |
| `src/components/home/CaseStudiesSection.astro`, `src/pages/index.astro` | Section deleted and unmounted |
| `src/components/Header.astro` | "Casos de Estudio" navigation link removed |
| `src/components/home/Hero.astro` | "Ver caso: Validación 3D" replaced by "Ver Servicios" to `/servicios/` |
| `src/components/home/TechStack.astro`, `src/pages/tecnologia/[tech].astro` | Case-study technologies and section removed; intro no longer mentions case studies |
| `src/pages/recursos/gracias.astro` | "Caso de Éxito Destacado" block removed |
| `src/content/servicios/validacion-3d.mdx`, `procesamiento-3d-healthcare.mdx`, `arquitectura-ia-escalable.mdx`, `arquitectura-frontend-alto-rendimiento.mdx` | Case-study links and wording removed |
| `public/assets/data/terminal-commands.json` | `story` link to the case study removed |
| `public/assets/js/app.js`, `case-studies.js`, `terminal.js`; `public/assets/data/case-studies.json` | Dead case-study renderer, data and analytics hook removed |
| `public/assets/css/main.css` | Selectors used only by case-study markup removed |
| `src/utils/seo.ts` | `casos` breadcrumb hub removed |
| `scripts/build-locales.mjs`, `scripts/sync-translations.mjs`, `scripts/localization-build.test.mjs` | `case-studies.json` removed from data lists |
| `scripts/check-seo.mjs` | Header contract no longer requires `/casos/` |
| `astro.config.mjs` | Redirect map above |
| `src/i18n/en-US.json` | New reviewed entries; unused entries removed |

## Non-goals

- The terminal `story`, `experience`, `metrics` and `status` commands still
  describe the confidential 3D collaboration and a SaaS role as experience.
  They are not case-study pages; only the link is removed. Their wording and
  figures (for example "Uptime: 99.97%") are not audited here.
- HTTP-level 301 responses (not available on GitHub Pages; see `plan.md`).
- Historical notes in `MIGRATION_LOG.md` and `IMAGE_MIGRATION_PLAN.md`.

## Acceptance criteria

- `scripts/case-studies.test.mjs` passes against the built `dist/`.
- `npm run check` passes with zero pending translations.

## Session state

- Last updated: 2026-09-16
- Done: CASE-001 to CASE-008 implemented; see `tasks.md` handoff for evidence.
- Verified: contract red against `HEAD`, full `npm run check` green.
- Next: owner review of the redirect targets and wording, commit, production verification.
- Blocked: nothing.

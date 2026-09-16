# Project charter

Status: Draft

## Objective

Publish the professional portfolio of NainDev at https://www.naindev.com: a static, bilingual (Spanish source, American English under `/en/`) site that presents backend architecture services for 3D and AI systems to technical decision makers and leads them to book a call or read a case study.

Sources: `design/README.md` (audience, positioning, primary goal), `specs/003-english-localization/spec.md` (locales).

## Scope

- Static multi-page site built with Astro (`output: 'static'` in `astro.config.mjs`).
- Content collections for blog posts, case studies and services (`src/content.config.ts`).
- Spanish pages plus English pages generated from a reviewed translation catalog (`src/i18n/en-US.json`).
- Technical SEO: metadata, structured data, sitemap, brand icons (specs 001, 002).
- Automated validation in CI before every deployment (`npm run check`).
- Deployment from `main` to GitHub Pages under the custom domain in `CNAME`.
- Design collaboration through `design/**` branches that cannot reach production (spec 004).

## Non-goals

- Server-side runtime, database or hosted backend (LOC-006; `output: 'static'`).
- Runtime or CI translation inference (LOC-006).
- Implementing the redesign in `src/` as part of spec 004.
- Search ranking, traffic or Core Web Vitals guarantees (explicitly excluded in specs 002 and 003).

## Constraints

- Public repository: no secrets, private strategy documents or personal identifiers (`SECURITY_POLICY.md`, `.gitignore`).
- Node.js 24 or later (`package.json` `engines`; both workflows use Node 24).
- Only `main` deploys to production (`deploy.yml`, DES-006).
- Every English page requires a reviewed translation before a release build completes (LOC-002).
- Published content must be verifiable; unverified metrics are not published (DES-011, CLM-001).
- Free and open-source tooling; no new paid services (`design/README.md`).
- Privacy-friendly analytics and a strict Content Security Policy (`src/components/SEO.astro`).

## Success criteria

- `npm run check` passes locally and in both GitHub workflows for the released commit.
- The deployed site matches the local build (`node scripts/check-production.mjs`).
- Every requirement in `10-requirements.md` has an automated test or a documented manual verification in `50-traceability.md`.
- No open question in `11-open-questions.md` concerns a claim that is still published without owner evidence.

Assumption: the success criteria above are derived from existing specs and workflows; the owner has not approved them as a project-level charter.

# Traceability

Every requirement and the test that proves it. A requirement with no passing test is not done.

Type values: `unit` (`node --test`), `contract` (script run against built `dist/` or sources by `npm run check`), `manual` (documented human or browser verification), `none`.

Last result sources:
- `local 2026-09-16`: `node --test scripts/localization.test.mjs scripts/seo.test.mjs` run locally, 13 of 13 passed. Full `npm run check` was not run for this document.
- `CI b725662`: full `npm run check` passed in GitHub runs 34230831513 and 34230831514 (spec 003 handoff). Checks added after that commit have no recorded CI result.

Paths are relative to the repository root.

## Brand icons (spec 001)

| Requirement | Test | Type | Last result |
| :--- | :--- | :--- | :--- |
| BR-001 | `scripts/check-brand-icons.mjs`: 96x96 PNG size and `rel="icon" sizes="96x96"` declaration in `BaseLayout.astro` | contract | CI b725662: pass |
| BR-002 | `scripts/check-brand-icons.mjs`: `favicon.ico` equals `favicon-naindev.ico`, ICO header, frame offsets, sizes exactly 16/32/48/64 | contract | CI b725662: pass |
| BR-003 | `scripts/check-brand-icons.mjs`: 180x180 PNG and `apple-touch-icon` declaration | contract | CI b725662: pass |
| BR-004 | `scripts/check-brand-icons.mjs`: every raster and ICO frame matches pixels rendered from the SVG mark. Partial: no explicit "not the Astro logo" assertion; covered indirectly by the SVG match | contract | CI b725662: pass |
| BR-005 | `scripts/check-brand-icons.mjs`: regex asserts `<Image ... priority />` in `src/components/Header.astro` source (not the rendered HTML) | contract | CI b725662: pass |
| BR-006 | `npm run check` runs `check:brand-icons` | contract | CI b725662: pass |

## Search presentation (spec 002)

| Requirement | Test | Type | Last result |
| :--- | :--- | :--- | :--- |
| SEO-001 | `scripts/check-brand-icons.mjs`: circular containment, at least 15% clear space, centering, minimum mark size | contract | CI b725662: pass |
| SEO-002 | `scripts/check-brand-icons.mjs`: SVG, PNG and ICO frames compared pixel by pixel | contract | CI b725662: pass |
| SEO-003 | `scripts/check-seo.mjs`: `og:site_name` and WebSite name are NainDev; home title names brand and author | contract | CI b725662: pass |
| SEO-004 | `scripts/check-seo.mjs`: one title/description/H1/canonical, canonical equals og:url, sitemap membership matches index policy, unique titles and descriptions, `max-image-preview:large`, noindex preserved | contract | CI b725662: pass |
| SEO-005 | `scripts/seo.test.mjs` "JSON-LD preserves text without allowing a script element to close"; `scripts/check-seo.mjs`: valid JSON-LD, distinct WebPage and BlogPosting, named author, visible `<time>` matching `datePublished` | unit + contract | local 2026-09-16: unit pass; CI b725662: pass |
| SEO-006 | `scripts/seo.test.mjs` "breadcrumbs use real hubs and the displayed title", "breadcrumbs do not invent resource or technology landing pages"; `scripts/check-seo.mjs`: every breadcrumb item resolves to a built page | unit + contract | local 2026-09-16: unit pass; CI b725662: pass |
| SEO-007 | `scripts/check-seo.mjs`: shared navigation text inside supported `data-nosnippet` containers, H1 not excluded, header links to service and blog hubs (case hub removed by spec 007). Manual browser navigation recorded in spec 002 handoff | contract + manual | CI b725662: pass |
| SEO-008 | `scripts/check-seo.mjs`: `id="main-content"` exists on every indexable page | contract | CI b725662: pass |
| SEO-009 | `npm run check` composition in `package.json` (`check:brand-icons`, `check:seo`) | contract | CI b725662: pass |
| SEO-010 | `scripts/check-seo.mjs`: social image URL on site origin and file exists in `dist/` | contract | CI b725662: pass |

## English localization (spec 003)

| Requirement | Test | Type | Last result |
| :--- | :--- | :--- | :--- |
| LOC-001 | `scripts/localization-build.test.mjs` "Release, preview and review CLIs enforce coverage without publishing drafts" (English page generated, deterministic on repeat); `scripts/check-locales.mjs`: every Spanish page has an English page | unit + contract | CI b725662: pass |
| LOC-002 | `scripts/localization.test.mjs` "Unreviewed and changed source text fail closed"; `scripts/localization-build.test.mjs` (missing translation fails the build) | unit | local 2026-09-16: `localization.test.mjs` pass; `localization-build.test.mjs` CI b725662: pass |
| LOC-003 | `scripts/localization.test.mjs` "Extraction retains complete prose and protects inline markup and code", "Translated prose cannot inject markup, change attributes or executable scripts", "Nested attributes and noscript content...", "Inline translate=no content remains immutable", "Mermaid diagram syntax and whitespace are preserved as code", "Data extraction localizes prose technology labels without changing identifiers or endpoints"; `scripts/check-locales.mjs`: protected nodes identical between locales | unit + contract | local 2026-09-16: unit pass; CI b725662: pass |
| LOC-004 | `scripts/check-locales.mjs`: es/en/x-default alternates exist and are reciprocal, two-link language switcher resolves; `scripts/check-seo.mjs`: self canonical and page language; `scripts/localization.test.mjs` "Page identity is localized while the publisher and website identities remain shared" | unit + contract | local 2026-09-16: unit pass; CI b725662: pass |
| LOC-005 | `scripts/localization.test.mjs` "English routes preserve Spanish addresses and fragments", "Project load failure renders a localized recovery link"; `scripts/check-locales.mjs`: interface dictionary present, every `message()` key exists, internal targets exist. Partial: separate terminal history and English interactive text verified only manually (spec 003 handoff, browser section) | unit + contract + manual | local 2026-09-16: unit pass; CI b725662: pass |
| LOC-006 | Not covered by an automated assertion. The build path contains no inference call and CI has no inference credentials; manual evidence in spec 003 handoff | manual | Not covered (automated) |
| LOC-007 | `scripts/localization-build.test.mjs`: review and preview CLIs do not publish drafts and reject stale approval hashes. Partial: "preserve prior accepted translations" during local generation and the watcher are verified only by the manual smoke check in spec 003 handoff | unit + manual | CI b725662: pass |
| LOC-008 | `npm run check` composition: `scripts/check-locales.mjs` (both locales, coverage, alternates, links) and `scripts/check-seo.mjs` (sitemap, assets). Post-release comparison: `scripts/check-production.mjs` (not in CI) | contract + manual | CI b725662: pass |
| LOC-009 | Partial. Rejection of executable markup in translation data: `scripts/localization.test.mjs` "Translated prose cannot inject markup, change attributes or executable scripts". Request payload content of `scripts/translate-local.py`: Not covered (no Python test; manual adapter inspection only) | unit + manual | local 2026-09-16: unit pass |

## Design collaboration (spec 004)

No automated tests exist for DES requirements. Manual verification is defined in `specs/004-design-collaboration/plan.md`, section "Verification", and by review of the brief and of each proposal.

| Requirement | Test | Type | Last result |
| :--- | :--- | :--- | :--- |
| DES-001 | Plan Verification step 1 (`gh api .../rulesets` lists the active ruleset) and step 3 (push to `main` and create `feature/x` as `davidesuarez` are rejected) | manual | Step 1: ruleset id 23551316 recorded active. Step 3: pending |
| DES-002 | Plan Verification step 2 (push `design/access-check` as `davidesuarez` succeeds) and step 4 (owner push to `main` still succeeds) | manual | Pending |
| DES-003 | Review of `design/README.md` against the required topics | manual | Recorded done in spec 004 tasks |
| DES-004 | Review of `design/README.md` for non-public information | manual | Recorded done in spec 004 tasks. Not covered (automated) |
| DES-005 | Review of proposal folder at handoff: opens locally without a build step | manual | Not covered: no proposal delivered yet |
| DES-006 | Plan section "Deployment boundary": `deploy.yml` triggers on `main` only; `github-pages` environment allows `main` only | manual | Recorded in spec 004 handoff. Not covered (automated) |
| DES-007 | Proposal review | manual | Not covered: no proposal delivered yet |
| DES-008 | Proposal review against brand colors | manual | Not covered: no proposal delivered yet |
| DES-009 | Owner approval of final wording before implementation | manual | Not covered: no proposal delivered yet |
| DES-010 | Proposal review for Spanish and English mockups | manual | Not covered: no proposal delivered yet |
| DES-011 | Proposal review for unverified metrics. `scripts/check-claims.mjs` scans `src/` and `dist/` only, not `design/` | manual | Not covered: no proposal delivered yet |
| DES-012 | `git ls-remote origin design/home-redesign` returns the branch; brief links resolve | manual | Pass: branch pushed 2026-09-16 |

## Content integrity (specs 005 and 006)

| Requirement | Test | Type | Last result |
| :--- | :--- | :--- | :--- |
| CLM-001 | `scripts/claims.test.mjs` (matcher cases for both locales); `scripts/check-claims.mjs` `scanBuild()` over `dist/**/*.html` | unit + contract | Pass: local `npm run check` and CI on `c78c854`; production pages checked 2026-09-16 |
| CLM-002 | `scripts/claims.test.mjs` "tracked sources publish no blocked claims"; `scripts/check-claims.mjs` `scanSources()` reports the file name | unit + contract | Same as CLM-001 |
| CLM-003 | `scripts/claims.test.mjs` "matcher flags the unverified impact metrics and badges" and source scan; `scanBuild()` over `dist/` | unit + contract | Pass: local `npm run check` 2026-09-16 (18 tests) |
| CLM-004 | Same matcher test for the OSS badge; "thank-you page shows no Zero Downtime badge" | unit | Pass: local `npm run check` 2026-09-16 |
| CLM-005 | `scripts/claims.test.mjs` "home page keeps the checklist call to action" | unit | Pass: local `npm run check` 2026-09-16 |
| CLM-006 | Source scan includes `public/assets/data/*.json`; "matcher ignores service descriptions of availability goals" guards false positives | unit + contract | Pass: local `npm run check` 2026-09-16 |

## Case study removal (spec 007)

All tests below are in `scripts/case-studies.test.mjs`, run against the built `dist/` by `npm run check:case-studies`. Before the change they failed 6 of 6 against a build of `6edd515`.

| Requirement | Test | Type | Last result |
| :--- | :--- | :--- | :--- |
| CASE-001 | "CASE-001: no case-study page or listing is published in any locale" | contract | Pass: local `npm run check` 2026-09-16 (6 of 6) |
| CASE-002 | "CASE-002 and CASE-003: built pages carry no case-study links or wording"; `scripts/check-seo.mjs`: header must not link to `/casos/` | contract | Pass: local `npm run check` 2026-09-16 |
| CASE-003 | Same wording test; "CASE-003: home pages have no case-study section or client script" | contract | Pass: local `npm run check` 2026-09-16 |
| CASE-004 | "CASE-004 and CASE-005: retired URLs redirect to related pages in both locales" (refresh target, canonical, `noindex`, target is a content page) | contract | Pass: local `npm run check` 2026-09-16. Production: pending |
| CASE-005 | Same redirect test for `/tecnologia/ONNX/`, `/tecnologia/Kubernetes/` and `/tecnologia/.NET Core/` | contract | Pass: local `npm run check` 2026-09-16 |
| CASE-006 | "CASE-006: terminal commands and runtime data contain no case-study link" | contract | Pass: local `npm run check` 2026-09-16 |
| CASE-007 | "CASE-007: the sitemap lists no case-study URL" | contract | Pass: local `npm run check` 2026-09-16 |
| CASE-008 | `npm run check` composition: `check-seo.mjs` (130 pages, 22 redirects), `check-locales.mjs` (65 pairs), build fails on missing translations; 0 pending and 0 unused entries recorded in the spec 007 handoff | contract + manual | Pass: local `npm run check` 2026-09-16 |

## Contact email (spec 008)

| Requirement | Test | Type | Last result |
| :--- | :--- | :--- | :--- |
| MAIL-001 | `scripts/contact-email.test.mjs` "sources and runtime data publish no retired contact address" | unit | Pass: local `npm run check` 2026-09-16 |
| MAIL-002 | `scripts/contact-email.test.mjs` "privacy policy names the public contact address" | unit | Pass: local `npm run check` 2026-09-16 |
| MAIL-003 | Same scan test; fails with the offending file names | unit | Pass: failed before the change on `privacidad.astro` and `checklist-ia.astro` |
| MAIL-004 | Manual review of `design/README.md` | manual | Pass 2026-09-16 |

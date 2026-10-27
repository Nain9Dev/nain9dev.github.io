# Requirements

Status: Draft

Stable functional requirements, written in EARS notation. Feature-level detail lives in `../specs/NNN-*/spec.md`; this file holds the consolidated, product-wide list.

EARS patterns:
- Event-driven: `When <trigger>, the system shall <response>.`
- State-driven: `While <state>, the system shall <response>.`
- Unwanted behaviour: `If <condition>, then the system shall <response>.`
- Ubiquitous: `The system shall <response>.`

IDs keep the prefixes defined in the source specs (`BR-`, `SEO-`, `LOC-`, `DES-`, `CLM-`, `CASE-`, `MAIL-`, `COPY-`) instead of `REQ-###`, so existing references in specs, tests and commits stay valid. Wording below is condensed; the source spec is authoritative.

Status values: `Implemented` (released, evidence recorded in the spec handoff), `Implemented, verification pending`, `Accepted` (process rule with no code artefact yet), `In progress`.

## Brand icons

| ID | Requirement | Source spec | Status |
| :--- | :--- | :--- | :--- |
| BR-001 | When a crawler reads the home page, the site shall expose a square PNG favicon of at least 96x96 px at a stable URL. | specs/001-brand-favicon-indexing | Implemented |
| BR-002 | When a client requests `/favicon.ico` or `/favicon-naindev.ico`, the site shall return matching valid ICO containers with 16, 32, 48 and 64 px NainDev frames. | specs/001-brand-favicon-indexing | Implemented |
| BR-003 | When an Apple client reads the home page, the site shall expose a 180x180 PNG touch icon. | specs/001-brand-favicon-indexing | Implemented |
| BR-004 | When any declared site icon is selected, it shall represent the same NainDev mark and shall not contain the Astro logo. | specs/001-brand-favicon-indexing | Implemented |
| BR-005 | When the above-the-fold header logo is rendered, Astro shall mark it as a priority image. | specs/001-brand-favicon-indexing | Implemented |
| BR-006 | When the project validation command runs, it shall fail if the favicon files or metadata regress. | specs/001-brand-favicon-indexing | Implemented |

## Search presentation

| ID | Requirement | Source spec | Status |
| :--- | :--- | :--- | :--- |
| SEO-001 | When an icon is displayed in a circular mask, the complete mark shall stay inside it, centered, with at least 15% clear space on every side, preserving shapes and colors. | specs/002-search-brand-presentation | Implemented |
| SEO-002 | When assets are regenerated, the SVG, 96 px PNG, 180 px touch icon and 16/32/48/64 px ICO frames shall represent the same mark at their stable URLs. | specs/002-search-brand-presentation | Implemented |
| SEO-003 | When any page is rendered, its Open Graph site name and WebSite name shall be NainDev; the home title shall name both NainDev and the author. | specs/002-search-brand-presentation | Implemented |
| SEO-004 | When an indexable page is built, it shall have one unique title and description, one H1, a canonical URL matching og:url and the sitemap, and large image previews; existing noindex pages shall stay excluded. | specs/002-search-brand-presentation | Implemented |
| SEO-005 | When an article is rendered, a BlogPosting shall refer to a distinct WebPage and the real author, with a visible machine-readable publication date; structured data shall be valid JSON and escape HTML delimiters. | specs/002-search-brand-presentation | Implemented |
| SEO-006 | When breadcrumbs are generated, every linked item shall resolve to an existing canonical page and the current item shall use its human-readable title. | specs/002-search-brand-presentation | Implemented |
| SEO-007 | When Google extracts a snippet, shared header and footer boilerplate shall be excluded with supported `data-nosnippet` containers; main content shall stay eligible; primary navigation shall link to the service and blog hubs (the case hub clause is superseded by CASE-002). | specs/002-search-brand-presentation | Implemented |
| SEO-008 | When the skip link is followed, every indexable page shall provide a main-content target. | specs/002-search-brand-presentation | Implemented |
| SEO-009 | When `npm run check` runs, it shall validate icon framing and the generated site's metadata, structured data, sitemap, internal links and index policy. | specs/002-search-brand-presentation | Implemented |
| SEO-011 | When the home page is built, its title shall read "NainDev \| Aitor Nain · Arquitecto de Software Full Stack" and its description shall mention deterministic conformance, Python and .NET. | specs/013-seo-profile-alignment | Implemented |
| SEO-012 | When any page is rendered, the Person structured data shall carry the job title "Arquitecto de Software Full Stack". | specs/013-seo-profile-alignment | Implemented |
| SEO-013 | When the blog and service hubs are built, their titles shall not read "Arquitectura Backend 3D e IA" and shall keep the NainDev suffix. | specs/013-seo-profile-alignment | Implemented |
| SEO-014 | When any page is rendered, the structured data shall describe NainDev as an `Organization` with the stable identifier `<origin>/#organization`, the name "NainDev", the site URL, an existing logo and `sameAs` links to the company LinkedIn page, GitHub, GitLab and X. | specs/036-organization-structured-data | Implemented |
| SEO-015 | When any page is rendered, the `Person` shall keep only personal profile links (without the company LinkedIn page) and the `Organization` shall name the person as founder. | specs/036-organization-structured-data | Implemented |
| SEO-016 | When any page is rendered, the `WebSite` and every `BlogPosting` shall name the `Organization` as publisher. | specs/036-organization-structured-data | Implemented |
| SEO-017 | When an English page is built, the `Organization` identifier, URL and name shall stay identical to the Spanish ones. | specs/036-organization-structured-data | Implemented |
| SEO-018 | When any page is rendered, the `Organization` `sameAs` shall also list the brand YouTube channel, Instagram and TikTok profiles. | specs/040-organization-brand-profiles | Implemented (not deployed) |
| SEO-019 | When any page is rendered, the `Person` `sameAs` shall not list the brand-only channels (YouTube, Instagram, TikTok). | specs/040-organization-brand-profiles | Implemented (not deployed) |
| SEO-020 | When any page is rendered, the `Organization` `sameAs` shall also list the Google Business Profile share link and the Threads profile. | specs/042-organization-google-threads | Implemented (not deployed) |
| SEO-021 | When any page is rendered, the `Person` `sameAs` shall not list the Google Business Profile or Threads. | specs/042-organization-google-threads | Implemented (not deployed) |
| SEO-022 | When any page is rendered, the `Organization` `sameAs` shall also list the brand Facebook page. | specs/043-organization-facebook-page | Implemented (not deployed) |
| SEO-023 | When any page is rendered, the `Person` `sameAs` shall not list the brand Facebook page. | specs/043-organization-facebook-page | Implemented (not deployed) |
| SEO-010 | When collection content declares a social image, the generated page shall refer to an existing asset; stale references shall use the collection default. | specs/002-search-brand-presentation | Implemented |

## English localization

| ID | Requirement | Source spec | Status |
| :--- | :--- | :--- | :--- |
| LOC-001 | When building the site, the system shall produce separate Spanish and English HTML pages from one Spanish source and a versioned translation catalog. | specs/003-english-localization | Implemented |
| LOC-002 | When source prose changes, the system shall require a matching reviewed translation before completing a release build and shall never silently reuse a stale or unrelated translation. | specs/003-english-localization | Implemented |
| LOC-003 | The system shall preserve markup, executable code, protected literals, resource URLs, form destinations and technical identifiers during translation. | specs/003-english-localization | Implemented |
| LOC-004 | Each translated page shall have a self canonical, reciprocal language alternates, localized metadata/structured data and an equivalent-page switcher. | specs/003-english-localization | Implemented |
| LOC-005 | English navigation and interactive content shall use English text and English internal destinations, with separate terminal history. | specs/003-english-localization | Implemented |
| LOC-006 | English shall be rendered before delivery without runtime inference, browser translation, external translation requests or a new hosted backend. | specs/003-english-localization | Implemented |
| LOC-007 | Local translation generation shall write reviewable proposals only, preserve prior accepted translations and expose failures without approval bypass. | specs/003-english-localization | Implemented |
| LOC-008 | Release validation shall verify both locales, translation coverage, routes, language alternates, sitemap, assets and source integrity. | specs/003-english-localization | Implemented |
| LOC-009 | Translation requests shall include only extracted public prose, locale, protected placeholders and editorial context; generated executable markup shall not be accepted as translation data. | specs/003-english-localization | Implemented |

## Design collaboration

| ID | Requirement | Source spec | Status |
| :--- | :--- | :--- | :--- |
| DES-001 | When a collaborator without the admin role pushes to, creates or deletes any branch outside `design/**`, the repository shall reject the operation. | specs/004-design-collaboration | Implemented, verification pending |
| DES-002 | When a collaborator creates or pushes a `design/**` branch, the repository shall accept it without affecting `main` or the deployed site. | specs/004-design-collaboration | Implemented, verification pending |
| DES-003 | The repository shall provide a design brief at `design/README.md` readable without coding knowledge. | specs/004-design-collaboration | Implemented |
| DES-004 | The brief shall contain only information already public on naindev.com, with no employers, dates, salary, identifiers or partnership terms. | specs/004-design-collaboration | Implemented |
| DES-005 | When a design proposal is ready, the designer shall deliver a self-contained HTML/CSS prototype plus exports under `design/<topic>/` that opens without a build step. | specs/004-design-collaboration | Accepted |
| DES-006 | Production deployment shall remain restricted to `main`; a workflow started from a `design/**` branch shall not deploy to GitHub Pages. | specs/004-design-collaboration | Implemented |
| DES-007 | The first proposal shall cover the home page for mobile and desktop, prioritizing the mobile header menu and navigation. | specs/004-design-collaboration | Accepted |
| DES-008 | Proposals shall keep the NainDev brand and logo colors `#0047AB`, `#00BFFF` and `#FFFFFF`. | specs/004-design-collaboration | Superseded by DES-020 |
| DES-009 | Proposals may restructure sections and rewrite copy; final wording requires owner approval. | specs/004-design-collaboration | Accepted |
| DES-010 | Mockups shall be delivered in Spanish and English. | specs/004-design-collaboration | Accepted |
| DES-011 | Proposals shall not present unverified metrics, including the current "+50M" badge. | specs/004-design-collaboration | Accepted |
| DES-012 | The owner shall provide a ready branch `design/home-redesign` with its folder so the designer can upload through the GitHub web interface. | specs/004-design-collaboration | Implemented |
| DES-013 | The brief shall state that the visual design is authored by David and credited as he chooses, code and functionality remain the owner's, and uploads are public. | specs/004-design-collaboration | Implemented |
| DES-014 | The brief shall state the business goals (custom software services, SEO) and leave message hierarchy and main call to action to the designer. | specs/004-design-collaboration | Implemented |
| DES-015 | The brief shall require keeping the blog, service pages, technology pages and terminal, and exclude case studies. | specs/004-design-collaboration | Implemented |
| DES-016 | The brief shall include SEO rules for the design and a FAQ for a designer without coding knowledge. | specs/004-design-collaboration | Implemented |
| DES-017 | The brief shall list `contact@naindev.com` and WhatsApp only as a chat button without a visible number; the number stays out of the repository until implementation. | specs/004-design-collaboration | Implemented |
| DES-018 | The brief shall describe the Contrast3D x NainDev partnership, allow an optional partners section and Contrast3D credit, and forbid claiming shared clients or joint projects. | specs/004-design-collaboration | Implemented |
| DES-019 | The brief shall state markets, client problems, the free call entry offer, no public prices, part-time remote availability, no testimonials and the kept checklist. | specs/004-design-collaboration | Implemented |
| DES-020 | The brief shall authorize logo and identity redesign keeping the NainDev name, with trademark-ready rules (OEPM) and vector deliverables that work at 16 px. | specs/004-design-collaboration | Implemented |
| DES-021 | The brief shall state the verbal agreement on logo registration, the written rights assignment required before filing (designer keeps credit) and the fallback to the current logo. | specs/004-design-collaboration | Implemented |
| DES-022 | The brief shall authorize the designer and his AI assistant to commit and push to `design/home-redesign` only, with commands and push troubleshooting. | specs/004-design-collaboration | Implemented |

## Content integrity

| ID | Requirement | Source spec | Status |
| :--- | :--- | :--- | :--- |
| CLM-001 | When the site is built, the system shall not publish the unverified claim "+50M" in any locale. | specs/005-remove-unverified-claims | Implemented, verified in production |
| CLM-002 | When a source component or page reintroduces a blocked claim, the project validation command shall fail and name the file. | specs/005-remove-unverified-claims | Implemented |
| CLM-003 | When the site is built, the system shall not publish the impact metrics "40 → 6 min", "99.99% uptime on critical systems", "10+ developers mentored" or "3 architectures migrated" in any locale. | specs/006-remove-unverified-metrics | Implemented, verified in production |
| CLM-004 | When the site is built, the system shall not publish the "Colaborador OSS" hero badge or the thank-you page "Zero Downtime" badge in any locale. | specs/006-remove-unverified-metrics | Implemented, verified in production |
| CLM-005 | When the home page loads, the free checklist call to action shall remain visible and linked. | specs/006-remove-unverified-metrics | Implemented |
| CLM-006 | When a blocked claim returns to sources, runtime data or build output, `npm run check` shall fail and name the file. | specs/006-remove-unverified-metrics | Implemented |

## Case study removal

| ID | Requirement | Source spec | Status |
| :--- | :--- | :--- | :--- |
| CASE-001 | When the site is built, the system shall not publish a case-study page, listing or content collection in any locale. | specs/007-remove-case-studies | Implemented, verified in production |
| CASE-002 | When any non-redirect page is built, it shall contain no link to `/casos/` or `/en/case-studies/` (header, hero, home, technology, service and thank-you pages included). | specs/007-remove-case-studies | Implemented, verified in production |
| CASE-003 | When the home page is built in either locale, it shall contain no case-study section, wording or client script. | specs/007-remove-case-studies | Implemented, verified in production |
| CASE-004 | When a visitor requests a retired case-study URL (clean or legacy `.html`) in either locale, the site shall serve a `noindex` redirect document whose target and canonical point to the mapped existing page in the same locale. | specs/007-remove-case-studies | Implemented, verified in production |
| CASE-005 | When a visitor requests a technology page retired because only a case study declared it, the site shall redirect to the related service page in the same locale. | specs/007-remove-case-studies | Implemented, verified in production |
| CASE-006 | When the terminal commands or runtime data files are served in either locale, they shall contain no case-study link. | specs/007-remove-case-studies | Implemented, verified in production |
| CASE-007 | When the sitemap is generated, it shall list no case-study URL. | specs/007-remove-case-studies | Implemented, verified in production |
| CASE-008 | When `npm run check` runs, the SEO and localization contracts shall still pass with zero pending and zero unused catalog entries. | specs/007-remove-case-studies | Implemented |

Spec 005 is committed as `c78c854`; production confirmation after deployment is still open in its `tasks.md`. Other homepage claims awaiting owner evidence are tracked in `11-open-questions.md`.

## Contact email (spec 008)

| ID | Requirement | Source | Status |
| :--- | :--- | :--- | :--- |
| MAIL-001 | When the site is built, every public contact address in either locale shall be `contact@naindev.com`. | specs/008-unify-contact-email | Implemented |
| MAIL-002 | When the privacy policy is built, the data controller and data subject rights contacts shall be `contact@naindev.com`. | specs/008-unify-contact-email | Implemented |
| MAIL-003 | When a source contains `hola@naindev.com` or `hello@naindev.com`, `npm run check` shall fail and name the file. | specs/008-unify-contact-email | Implemented |
| MAIL-004 | The design brief shall list `contact@naindev.com` as the public email. | specs/008-unify-contact-email | Implemented |

## Honest offer copy (spec 009)

| ID | Requirement | Source | Status |
| :--- | :--- | :--- | :--- |
| COPY-001 | When the site is built, no call to action in either locale shall offer a free audit; the Calendly buttons formerly labelled "Agendar Auditoría Gratuita" shall read "Agendar llamada gratuita" with unchanged URLs and UTM parameters. | specs/009-honest-offer-copy | Implemented |
| COPY-002 | When the home page is built, the hero availability line shall state part-time, remote availability for companies in any country, and no source shall claim immediate availability. | specs/009-honest-offer-copy | Implemented |
| COPY-003 | When the home page is built, the About section shall describe the role as CTO at Contrast3D x NainDev, the collaboration with Contrast3D, shall not use the former "Lead Software Architect" title and shall not mention a stealth startup. | specs/009-honest-offer-copy, specs/010-cto-role | Implemented |
| COPY-004 | When the terminal commands are served in either locale, they shall contain no confidential or NDA project, redacted value or telemetry figure; `metrics` shall state that no public metrics exist yet and `status` shall show part-time remote availability. | specs/009-honest-offer-copy | Implemented |
| COPY-005 | When a service page or blog post describes availability or zero-downtime deployments, it shall present them as design goals without a guaranteed availability percentage. | specs/009-honest-offer-copy | Implemented |
| COPY-006 | When a "99.9x%" availability figure, p95 latency reading, uptime reading or "[REDACTED]" placeholder returns to sources, runtime data or build output, `npm run check` shall fail and name the file. | specs/009-honest-offer-copy | Implemented |
| COPY-007 | When the home page is built, the About section shall describe the collaboration work as a multi-domain, Open Core, deterministic conformance architecture designed to validate products of any sector against explicit, versioned specifications, naming AI-generated 3D assets as its first domain. | specs/011-conformance-chassis-copy | Implemented |
| COPY-008 | When the terminal `story` command is served, it shall describe the same multi-domain conformance approach and name 3D assets as the first domain. | specs/011-conformance-chassis-copy | Implemented |
| COPY-009 | When the About section or the terminal commands are served in either locale, they shall not contain the internal product name or internal profile identifiers. | specs/011-conformance-chassis-copy | Implemented |
| COPY-010 | When the home page is built, the hero shall present deterministic product conformance with 3D as the first domain and shall not claim "escala industrial". | specs/012-profile-coherence | Implemented |
| COPY-011 | When the home page is built, the hero stack line shall list Python, C#, FastAPI, .NET, PostgreSQL, SQL Server, Vue 3 and MCP. | specs/012-profile-coherence | Implemented |
| COPY-012 | When the home page is built, no badge shall present a self-assigned title as market validation. | specs/012-profile-coherence | Implemented |
| COPY-013 | When the tech stack section is built, it shall list the default stack, each technology with an existing icon file. | specs/012-profile-coherence | Implemented |
| COPY-014 | When the terminal `experience` command is served, it shall describe the full-time role as ".NET developer in the insurance sector" with its verified stack, without naming the employer or attributing ASP.NET Core to it; `stack` shall list the default stack by area. | specs/012-profile-coherence | Implemented |
| COPY-015 | When the home page is built, the first service card shall describe deterministic multi-domain conformance with 3D (glTF/GLB) as the first domain, without USD or real-time claims. | specs/014-services-coherence | Implemented |
| COPY-016 | When the home page is built, the critical backend card shall name Python and .NET, and PostgreSQL and SQL Server. | specs/014-services-coherence | Implemented |
| COPY-017 | When any source page or content entry is built, it shall not contain "escala industrial". | specs/014-services-coherence | Implemented |
| COPY-018 | When the 3D validation service page is built, it shall not claim USD support or real-time conversion. | specs/014-services-coherence | Implemented |
| PRJ-001 | When the project catalog is served, it shall list every public project of the owner and the private projects he approved. | specs/012-profile-coherence | Implemented |
| PRJ-002 | When a catalog entry is private, it shall have no links, show that its code is private and contain no product, partner, client or employer names or internal identifiers. | specs/012-profile-coherence | Implemented |
| PRJ-004 | When a public project has a live demo, its catalog entry shall link it and its status shall say the demo is public. | specs/015-catalog-demo-links | Implemented |
| PRJ-003 | When the catalog is built, it shall not contain unverified performance figures. | specs/012-profile-coherence | Implemented |
| PRJ-005 | When the project catalog is served, it shall include an anonymous entry for the enterprise 3D viewer Web Component with status "Privado · En producción", categories `["3d", "data"]`, `private: true`, `featured: true`, with no links and no confidential names. | specs/016-contrast-ecosystem-stack | Implemented |
| PRJ-006 | The collaborative CRM catalog entry shall reflect status "Privado · En producción" and include "TypeScript" in its declared technologies. | specs/016-contrast-ecosystem-stack | Implemented |
| PRJ-007 | The catalog shall maintain unique ids and unique sequential orders across all projects, with the private project count updated to 8. | specs/016-contrast-ecosystem-stack | Implemented |
| COPY-019 | When the terminal `experience` command is served, it shall summarize the owner's CTO responsibility covering the conformance chassis, collaborative web platform and 3D Web Component viewer. | specs/016-contrast-ecosystem-stack | Implemented |
| PRJ-008 | When the project catalog is served, projects shall be ordered in descending hierarchy of technical complexity and maturity (production conformance ecosystem, enterprise .NET and CAD, procedural 3D engines, local AI, and training foundations). | specs/017-catalog-complexity-ordering-and-filters | Implemented |
| PRJ-009 | When the project catalog is loaded, every project shall declare supported strategic categories (`backend`, `data`, `demo`, `3d`, `production`, `dotnet`, `python`). | specs/017-catalog-complexity-ordering-and-filters | Implemented |
| PRJ-010 | When the project section is rendered, the filter toolbar shall expose 6 strategic filter buttons (`all`, `production`, `dotnet`, `python`, `3d`, `demo`) equipped with dynamic count badges. | specs/017-catalog-complexity-ordering-and-filters | Implemented |
| PRJ-024 | When a catalogued public repository publishes a live site on a `naindev.com` subdomain, the catalog shall link it with the demo label before the repository link, give it the status `Demo pública activa` and show its capture at `/assets/images/demos/<id>.webp` (NainLegacyModernizer → `https://modernizer.naindev.com/`). | specs/next-portfolio-coverage | Implemented (#28) |
| PRJ-025 | When a catalogued public repository has no live site, its card shall show a capture of its README as rendered on GitHub, at `/assets/images/repos/<id>.webp`, so every public entry carries a picture. No catalogued entry is in that case since PRJ-026. | specs/next-portfolio-coverage | Implemented (#28) |
| PRJ-026 | When nain-mcp-validator publishes its project page, the catalog shall link `https://mcp.naindev.com/` before the repository link and show a capture of that page at `/assets/images/demos/nain-mcp-validator.webp`. | specs/next-project-sites | Implemented |
| UI-001 | When project filters are applied or resized, the sliding active indicator and card transitions shall adapt smoothly without layout shifts or localization token leakage. | specs/017-catalog-complexity-ordering-and-filters | Implemented |

## Repository security (spec 018)

| ID | Requirement | Source | Status |
| :--- | :--- | :--- | :--- |
| SEC-001 | When private keys, SSL certificates, tokens, or credential files are placed in the workspace (`*.pem`, `*.key`, `*.pfx`, `*.crt`, `*credentials*.json`, `*token*.json`, `auth.json`, `.netrc`), git shall ignore them. | specs/018-gitignore-security-hardening | Implemented |
| SEC-002 | When Python execution artifacts, virtual environments (`__pycache__/`, `.venv/`, `venv/`, `*.pyc`), or test/profiling outputs (`test-results/`, `playwright-report/`, `*.cpuprofile`) are generated, git shall ignore them. | specs/018-gitignore-security-hardening | Implemented |
| SEC-003 | When local AI assistant configurations, agent scratch files (`.cursor/`, `.cursorrules`, `.windsurf/`, `*.scratch.md`), or local model weights (`*.gguf`, `*.bin`, `*.safetensors`, `models/`) are created, git shall ignore them. | specs/018-gitignore-security-hardening | Implemented |
| SEC-004 | When `.gitignore` is maintained, all comments, section dividers, and annotations shall be written in professional English without non-English prose. | specs/018-gitignore-security-hardening | Implemented |

## Repository English standardization (spec 019)

| ID | Requirement | Source | Status |
| :--- | :--- | :--- | :--- |
| ENG-001 | When `README.md` is accessed or audited, it shall be written entirely in professional, concise English without redundancies, repetitions, or emojis, accurately presenting the engineer's active stack (.NET, Python, deterministic conformance, 3D systems). | specs/019-repository-english-standardization | Implemented |
| ENG-002 | When repository metadata (About description, topics) is queried or viewed on GitHub, it shall be in professional English. | specs/019-repository-english-standardization | Implemented |
| ENG-003 | When root documentation files (`SECURITY_POLICY.md`, `PRODUCTION_CHECKLIST.md`, `MIGRATION_LOG.md`, `IMAGE_MIGRATION_PLAN.md`) are audited, they shall be written in professional English and free of emojis. | specs/019-repository-english-standardization | Implemented |
| ENG-004 | When client scripts, Astro layout scripts, and code comments are inspected or executed, all logs, error notices, and comments shall be in professional English. | specs/019-repository-english-standardization | Implemented |

## Low-end device performance (spec 020)

| ID | Requirement | Source | Status |
| :--- | :--- | :--- | :--- |
| PERF-001 | When a page is rendered, each self-hosted font family shall be referenced through exactly one `@font-face` rule with a weight range and one file, and the font directory shall contain no byte-identical duplicates. | specs/020-low-end-device-performance | Implemented |
| PERF-002 | When a page is rendered, the site shall preload only fonts that a stylesheet references. | specs/020-low-end-device-performance | Implemented |
| PERF-003 | When client scripts are built, each source module shall be bundled once by Astro into hashed files under `/_astro/`, with no manual `?v=` cache-busting parameter in sources. | specs/020-low-end-device-performance | Implemented |
| PERF-004 | When stylesheets are built, they shall be bundled and minified by Astro into at most one hashed stylesheet per page under `/_astro/`. | specs/020-low-end-device-performance | Implemented; tightened by CSS-001 (spec 031): styles are now inlined |
| PERF-005 | While the document head is parsed, the site shall not create a WebGL context; the WebGL probe shall run only from the deferred client bundle. | specs/020-low-end-device-performance | Implemented |
| PERF-006 | When the home page is first painted, the hero text shall be visible without waiting for client JavaScript. | specs/020-low-end-device-performance | Implemented |
| PERF-007 | While a decorative animation runs indefinitely, it shall animate only `transform` or `opacity`, and it shall stop in low-performance mode. | specs/020-low-end-device-performance | Implemented |
| PERF-008 | When below-the-fold home sections are off screen, the browser shall be allowed to skip their rendering. | specs/020-low-end-device-performance | Implemented |
| PERF-009 | When the header logo is rendered, the served image width shall not exceed twice its largest rendered width. | specs/020-low-end-device-performance | Implemented |
| PERF-010 | When a hashed static asset is served in production, the response shall allow long-term browser caching. | specs/020-low-end-device-performance | Implemented |

## Deployment without edge purge (spec 022)

| ID | Requirement | Source | Status |
| :--- | :--- | :--- | :--- |
| DEP-001 | When the site is deployed, the workflow shall not call the Cloudflare API nor reference Cloudflare secrets. | specs/022-remove-cloudflare-purge | Implemented |
| DEP-002 | When a deploy publishes new HTML, visitors shall receive it without a manual purge. | specs/022-remove-cloudflare-purge | Implemented |

## Post-paint main-thread work (spec 021)

| ID | Requirement | Source | Status |
| :--- | :--- | :--- | :--- |
| PERF-011 | When the home page is served through Cloudflare, decorative text that looks like an email address shall be excluded from email obfuscation, so no obfuscation script is injected. | specs/021-post-paint-main-thread | Implemented |
| PERF-012 | When a page loads, home-only modules shall not be part of the entry bundle and shall load on demand only where their section exists. | specs/021-post-paint-main-thread | Implemented |
| PERF-013 | When the project filters initialise, they shall not read layout. | specs/021-post-paint-main-thread | Implemented |
| PERF-014 | While in low-performance mode, reveal motion shall need no observers or timers; in other modes it shall not force layout through a timer fallback. | specs/021-post-paint-main-thread | Implemented |
| PERF-015 | When the page has painted, decorative effects and the WebGL probe shall start only when the browser is idle. | specs/021-post-paint-main-thread | Implemented |
| PERF-016 | When the client router swaps to another page, the performance mode decided on first load shall be restored before the new page renders. | specs/021-post-paint-main-thread | Retired 2026-10-13: spec 029 removed the client router, so every navigation runs the head script |

## Copy email button (spec 023)

| ID | Requirement | Source | Status |
| :--- | :--- | :--- | :--- |
| MAIL-005 | When a visitor activates "Copiar email", the system shall copy `contact@naindev.com` and announce success with the existing localized message. | specs/023-copy-email-button | Implemented |
| MAIL-006 | When the home page is served, the address used by the copy button shall not appear as plain text or as a `mailto:` link. | specs/023-copy-email-button | Implemented |

## CI workflow hardening (spec 024)

| ID | Requirement | Source | Status |
| :--- | :--- | :--- | :--- |
| CI-001 | When a workflow references an action, it shall pin a full commit SHA followed by a version comment. | specs/024-ci-workflow-hardening | Implemented |
| CI-002 | When a workflow runs, it shall grant only `contents: read` at workflow level; Pages write and OIDC permissions only to the deploy job. | specs/024-ci-workflow-hardening | Implemented |
| CI-003 | When a workflow checks out the repository, it shall not persist credentials. | specs/024-ci-workflow-hardening | Implemented |
| CI-004 | When a workflow installs dependencies, it shall use `npm ci` only. | specs/024-ci-workflow-hardening | Implemented |

## Placeholder forms removed (spec 025)

| ID | Requirement | Source | Status |
| :--- | :--- | :--- | :--- |
| LEAD-001 | When any page is rendered, it shall contain no MailerLite form, script or placeholder endpoint, and the CSP shall not allow MailerLite hosts. | specs/025-remove-placeholder-forms | Implemented |
| LEAD-002 | When a visitor wants the checklist, the page shall offer a `mailto:contact@naindev.com` link with a prefilled subject as its only call to action. | specs/025-remove-placeholder-forms | Implemented |
| LEAD-003 | When the checklist page is served through Cloudflare, the email link shall be excluded from email obfuscation. | specs/025-remove-placeholder-forms | Implemented |

## Social preview image weight (spec 026)

| ID | Requirement | Source | Status |
| :--- | :--- | :--- | :--- |
| SOC-001 | When a page declares the default social image, the file shall be a 1200×630 JPEG of at most 200 KB with matching declared dimensions. | specs/026-social-image-weight | Implemented |
| SOC-002 | When sources reference the default social image, they shall all use the new file, and the 1.5 MB PNG shall not be published. | specs/026-social-image-weight | Implemented |

## Single validation run on main (spec 027)

| ID | Requirement | Source | Status |
| :--- | :--- | :--- | :--- |
| CI-005 | When a commit is pushed to `main`, `npm run check` shall run once, inside the deploy workflow; `static-site-check.yml` shall run only for pull requests. | specs/027-single-ci-run-on-main | Implemented |

## Font subsetting (spec 028)

| ID | Requirement | Source | Status |
| :--- | :--- | :--- | :--- |
| FONT-001 | When fonts are served, Inter shall weigh at most 34 KB and Outfit at most 30 KB, keeping weights 300 to 800, kerning and default ligatures. | specs/028-font-subsetting | Implemented |
| FONT-002 | When any page is built, every visible text character outside code, emoji and pictographic symbols shall be inside the declared `unicode-range`. | specs/028-font-subsetting | Implemented |

## Instant navigation (spec 029)

| ID | Requirement | Source | Status |
| :--- | :--- | :--- | :--- |
| NAV-001 | When any page is built, it shall load no client router script and its scripts shall not depend on `astro:*` lifecycle events. | specs/029-instant-navigation | Implemented (ADR-0003 Proposed) |
| NAV-002 | While the visitor has no reduced-motion preference, same-origin navigations shall use a cross-document view transition, keeping the header in place. | specs/029-instant-navigation | Implemented (ADR-0003 Proposed) |
| NAV-003 | When a visitor hovers or presses a same-origin page link, the browser shall be allowed to prerender it, excluding `mailto:`, files, `target="_blank"` and `data-no-prerender` links. | specs/029-instant-navigation | Implemented (ADR-0003 Proposed) |
| NAV-004 | When a page initialises its scripts, it shall do so once per document load, and terminal, privacy banner, contact tracking and catalog shall keep working. | specs/029-instant-navigation | Implemented (ADR-0003 Proposed) |

## Lightweight hero scene (spec 030)

| ID | Requirement | Source | Status |
| :--- | :--- | :--- | :--- |
| HERO-001 | When the hero scene is drawn, the wireframe shall match `THREE.IcosahedronGeometry(2.2, 1)` in wireframe, `#3B82F6` at 0.25 opacity with normal blending. | specs/030-lightweight-hero-scene | Implemented |
| HERO-002 | When the hero scene is drawn, 350 points between radius 2.4 and 7.6 shall be drawn in `#60A5FA` at 0.45 opacity with additive blending and attenuated size 0.025. | specs/030-lightweight-hero-scene | Implemented |
| HERO-003 | While the scene runs, camera, rotations, parallax, pausing, low-frame-rate fallback and `low-power` context shall behave as before. | specs/030-lightweight-hero-scene | Implemented |
| HERO-004 | When the site is built, no Three.js file shall be published and the scene module shall weigh at most 8 KiB. | specs/030-lightweight-hero-scene | Implemented |

## Inline styles (spec 031)

| ID | Requirement | Source | Status |
| :--- | :--- | :--- | :--- |
| CSS-001 | When a page is built, its styles shall be inlined in the document head and the page shall link no external stylesheet. | specs/031-inline-styles | Implemented |
| CSS-002 | When the home page is served, its compressed HTML shall stay at or below 25 KiB. | specs/031-inline-styles | Implemented |

## Field Web Vitals and performance budget (spec 032)

| ID | Requirement | Source | Status |
| :--- | :--- | :--- | :--- |
| RUM-001 | When a page view is sampled (25 %), the site shall load the reporting module when idle and observe LCP, INP and CLS. | specs/032-field-and-ci-performance | Implemented (ADR-0004 Proposed) |
| RUM-002 | When a sampled page is first hidden, the site shall send exactly one Plausible event `Web Vitals` with `interactive: false`, ratings, bucketed values and device class. | specs/032-field-and-ci-performance | Implemented (ADR-0004 Proposed) |
| RUM-003 | When a page view is not sampled, the site shall download no reporting code. | specs/032-field-and-ci-performance | Implemented (ADR-0004 Proposed) |
| LHCI-001 | When the site is deployed or a pull request is checked, Lighthouse shall run three times per budget page and fail when a median breaks score ≥ 0.95, LCP ≤ 2.5 s, TBT ≤ 200 ms, CLS ≤ 0.1 or transfer ≤ 250 KiB. | specs/032-field-and-ci-performance | Implemented (ADR-0005 Proposed) |

## WCAG 2.2 AA (spec 033)

| ID | Requirement | Source | Status |
| :--- | :--- | :--- | :--- |
| A11Y-001 | When any built page is checked with axe-core (WCAG 2.0–2.2 A/AA) at desktop and mobile widths, it shall report no violations other than documented decorative-text exceptions. | specs/033-accessibility-wcag22 | Implemented (one documented exception) |
| A11Y-002 | When code examples are shown, every token shall reach 4.5:1 against the code background. | specs/033-accessibility-wcag22 | Implemented |
| A11Y-003 | When a keyboard user tabs through the home page, every control shall show a visible focus indicator not hidden by the sticky header, and the skip link shall move focus to the main content. | specs/033-accessibility-wcag22 | Implemented |
| A11Y-004 | While the visitor prefers reduced motion, reveals, hero scene, pulse and page transitions shall not animate. | specs/033-accessibility-wcag22 | Implemented |
| A11Y-005 | While the terminal types, focus shall neither drop nor move on its own, Tab shall always leave the terminal, and screen readers shall get the text once. | specs/033-accessibility-wcag22 | Implemented |

## Pages source (spec 034)

| ID | Requirement | Source | Status |
| :--- | :--- | :--- | :--- |
| DEP-003 | When a commit is pushed, only `deploy.yml` shall publish the site; a failed build shall leave the previous deployment online. | specs/034-pages-source-from-actions | Implemented (repository setting) |

## Intermittent long tasks (spec 035)

| ID | Requirement | Source | Status |
| :--- | :--- | :--- | :--- |
| PERF-017 | When deferred work runs, each module shall start in its own idle slot, so a timed-out idle callback runs one module only. | specs/035-intermittent-long-tasks | Implemented |
| PERF-018 | When a page is rendered, it shall declare no SVG favicon; the 96 px PNG, ICO and 180 px touch icon remain declared, and the SVG file stays published at its stable URL (SEO-002). | specs/035-intermittent-long-tasks | Implemented |
| LHCI-002 | When a budget measurement breaks a limit, the gate shall repeat the whole measurement in a new Chrome process, up to three attempts, and fail only when every attempt breaks a limit; limits, runs and the median are unchanged. | specs/037-budget-gate-attempts (ADR-0006, Proposed) | Implemented |
| LHCI-003 | When the gate finishes, it shall print the Chrome version and the outcome of each attempt. | specs/037-budget-gate-attempts | Implemented |

## Ecosystem suite navigation bar (spec 038)

| ID | Requirement | Source | Status |
| :--- | :--- | :--- | :--- |
| ECO-001 | When `<nain-ecosystem-bar>` is mounted, the component shall attach a Shadow DOM with closed encapsulation to isolate layout and styles from the host application. | specs/038-ecosystem-suite-bar | Implemented |
| ECO-002 | When rendered, the bar shall display the canonical NainDev brand link (`https://www.naindev.com/`), the current project label when specified, a categorized quick-navigation dropdown for all public portfolio demos, and a link to the platform status page (`https://status.naindev.com/`). | specs/038-ecosystem-suite-bar | Implemented |
| ECO-003 | The ecosystem bar distribution (`public/assets/js/ecosystem-bar*.js` and `public/assets/data/ecosystem.v1.json`) shall weigh at most 15 KB gzip in total; the entry script `ecosystem-bar.js` shall stay under 20 KB raw and at most 5 KB gzip, with no static imports or external runtime dependencies. Amended by spec 041 (was: 15 KB uncompressed, single file). | specs/038-ecosystem-suite-bar, specs/041-ecosystem-bar-split | Implemented |
| ECO-004 | When the user triggers the collapse/expand toggle, the bar shall toggle between a full horizontal top bar and a minimal floating corner pill to prevent obstructing full-screen viewports. | specs/038-ecosystem-suite-bar | Implemented |
| ECO-005 | When keyboard navigation is used (Tab, Escape, Enter), the menu shall conform to WCAG 2.2 AA accessibility with visible focus indicators, `aria-expanded` and role attributes, and close on Escape keypress. | specs/038-ecosystem-suite-bar | Implemented |
| ECO-006 | When a page loads the ecosystem bar entry script, the architecture panel module shall not be requested until the user opens the panel. | specs/041-ecosystem-bar-split | Implemented (not deployed) |
| ECO-007 | The project catalog and architecture profiles shall live in `public/assets/data/ecosystem.v1.json` with `schemaVersion: 1`, and the menu shall be rendered from it. | specs/041-ecosystem-bar-split | Implemented (not deployed) |
| ECO-008 | When the ecosystem data cannot be loaded or has another `schemaVersion`, the bar shall keep the brand and status links, without menu and panel, and shall not throw. | specs/041-ecosystem-bar-split | Implemented (not deployed) |
| ECO-009 | When the entry script is loaded from any origin, it shall resolve the panel and data files from its own script URL, falling back to `https://www.naindev.com/assets/`; loading the data shall not be reported as host traffic. | specs/041-ecosystem-bar-split | Implemented (not deployed) |
| ECO-010 | Every catalog item and profile in the ecosystem data shall have the fields the bar renders, HTTPS URLs and unique names. | specs/041-ecosystem-bar-split | Implemented (not deployed) |
| ECO-022 | Each open-ecosystem tile shall show a capture (640x360 WebP under 30 KB with a 400x225 variant under 10 KB, lazy-loaded with explicit dimensions): of the live site when the repository publishes one on a `naindev.com` subdomain (`brandbook`, `status`), otherwise of its README on GitHub. | specs/next-portfolio-coverage | Implemented (#28) |
| ECO-023 | When a repository publishes a live site, its tile shall link that site and keep a secondary link to the repository on GitHub; otherwise the tile shall link GitHub. Every link opens in a new tab with `rel="noopener noreferrer"`. | specs/next-portfolio-coverage | Implemented (#28) |
| ECO-025 | When `engineering-handbook`, `template-dotnet-clean-arch`, `template-fastapi-vue-clean-arch` and `.github` publish a project page on a `naindev.com` subdomain (`handbook`, `template-dotnet`, `template-fastapi`, `standards`), their tiles shall link it, show a capture of it under `/assets/images/demos/` and keep the GitHub chip. | specs/next-project-sites | Implemented |
| ECO-024 | The suite bar catalog (`public/assets/data/ecosystem.v1.json`) shall list the NainLegacyModernizer demo in the backend category, so every live demo is reachable from the bar on every subdomain. | specs/next-portfolio-coverage | Implemented (#28) |

## Status hub integration (spec 039)

| ID | Requirement | Source | Status |
| :--- | :--- | :--- | :--- |
| STAT-001 | When the global footer is rendered, it shall expose a direct link to `https://status.naindev.com/`. | specs/039-status-hub-integration | Implemented |
| STAT-002 | When the status indicator is rendered, it shall display an operational status dot (`#22c55e`) and human-readable label ("Sistemas Operativos"). | specs/039-status-hub-integration | Implemented |
| STAT-003 | When the status link is clicked, it shall open in a new browsing context with secure `target="_blank"` and `rel="noopener noreferrer"`. | specs/039-status-hub-integration | Implemented |
| STAT-004 | The status element shall satisfy WCAG 2.2 AA accessibility with semantic anchor text, accessible contrast, and `aria-hidden="true"` on the visual indicator dot. | specs/039-status-hub-integration | Implemented |
| STAT-005 | The status integration shall introduce zero runtime scripts or initial client-side network calls, preserving the 100% Lighthouse performance budget. | specs/039-status-hub-integration | Implemented |

## Visual polish (spec 045)

| ID | Requirement | Source | Status |
| :--- | :--- | :--- | :--- |
| VP-001 | When any page is rendered, every colour, font family, font size, spacing step, radius, shadow, easing and duration used by `src/styles/*.css` shall come from a custom property declared once in a `:root` block at the top of `main.css`, and the brand values (`#0047AB`, `#002B66`, `#EDF1F6`, `#80FF00`, `#FF001F`, `#1D1D1B`) shall be the tokens' source. | specs/045-visual-polish | Implemented |
| VP-002 | When any page is rendered, headings shall follow a single fluid modular scale (`clamp()` with a viewport term) and `h1` shall be at least 1.4 times the size of `h2` at every viewport width, within the existing guards (`h1` max 4.8 rem, `.hero h1` max 4.6 rem). | specs/045-visual-polish | Implemented |
| VP-003 | When the home page is rendered, each section shall use one of three spacing tiers, and the sum of the three secondary strips (proof, trust badges, live demos) shall take less vertical space than one main section. | specs/045-visual-polish | Implemented (#24, carried to `main` by #26) |
| VP-004 | When a card is rendered, it shall use the shared card tokens (surface, border, radius, shadow, hover lift), and no card family shall declare its own radius or shadow value. | specs/045-visual-polish | Implemented |
| VP-005 | While a visitor has no reduced-motion preference, the hero shall enter in the choreographed order of the inventory, and the text shall still be present in the HTML at first paint (PERF-006). | specs/045-visual-polish | Implemented |
| VP-006 | While a visitor prefers reduced motion, no element shall animate position, scale, clip or opacity for longer than one frame, including the terminal typewriter, and the page transition shall not run. | specs/045-visual-polish | Implemented |
| VP-007 | When a keyboard user focuses any control, a focus indicator of at least 3 px in a colour with at least 3:1 contrast against both the control and its surroundings shall be visible and not covered by the sticky header (A11Y-003 kept). | specs/045-visual-polish | Implemented |
| VP-008 | When an interactive element has a hover state, the same state shall be reachable with `:focus-visible`, and no information shall be conveyed by hover alone. | specs/045-visual-polish | Implemented |
| VP-009 | When the header is rendered below 42 rem, the primary links shall be reachable without horizontal scrolling and the call to action shall remain reachable from the header (as a compact button or inside a disclosure menu that is keyboard and screen-reader operable). | specs/045-visual-polish | Implemented |
| VP-010 | When any page is built, its visible text, metadata, canonical URL, structured data, links, routes, sitemap, `public/assets/data/ecosystem.v1.json` and `public/assets/js/ecosystem-bar*.js` shall be byte-identical to the previous build, except for the font file names and the inline stylesheet. | specs/045-visual-polish | Implemented; verified through the translation catalog (only the listed strings were added), no scripted HTML diff |
| VP-011 | When the home page is built, its inline stylesheet shall keep `gzip(index.html)` at or below 25 KiB (CSS-002) by removing the CSS of retired effects and dead selectors in the same change that adds new rules. | specs/045-visual-polish | Superseded by VS-008 (ADR-0013 raised CSS-002 to 30 KiB) |
| VP-012 | When the production build is audited with Lighthouse in mobile emulation, `/`, `/en/` and `/servicios/` shall score at least 0.95 in performance and 1.0 in accessibility, and the existing budget (LCP 2.5 s, TBT 200 ms, CLS 0.1, 250 KiB) shall hold; the desktop audit shall score at least 0.98 in performance. | specs/045-visual-polish | Implemented |
| VP-013 | When the built pages are checked with axe-core (WCAG 2.0–2.2 A and AA) at desktop and mobile widths, they shall report no violations other than the exception documented in spec 033. | specs/045-visual-polish | Implemented |
| VP-014 | When the build runs, no runtime dependency shall be added; any new development dependency shall be recorded in an ADR in state `Proposed` before it is installed. | specs/045-visual-polish | Implemented |
| VP-015 | When a display font is replaced, the site shall keep exactly two self-hosted variable font files with weights 300–800 and the shared `unicode-range` (PERF-001, FONT-001, FONT-002), with the size limits of `scripts/fonts.test.mjs` updated for the new file. | specs/045-visual-polish | Implemented |
| VP-016 | When a pull request of phase 2 is opened, it shall carry before and after captures at 1440 px and 390 px, the Lighthouse mobile and desktop scores, and the `npm run check` result in its description, and it shall not be merged without the owner's explicit approval. | specs/045-visual-polish | Implemented (process; PRs #13 to #22) |

## Visual storytelling (spec 046)

| ID | Requirement | Source | Status |
| :--- | :--- | :--- | :--- |
| VS-001 | When a home section carries an explanatory paragraph next to its heading, the paragraph shall be rendered inside a `<details>` element whose `<summary>` is a 32 px icon button with an accessible name, so the text is in the document, reachable by keyboard and screen readers, and shown only on request. | specs/046-visual-storytelling | Implemented |
| VS-002 | When the hero renders, the capability panel shall read as a pipeline diagram: three nodes joined by a rail along which a pulse travels (transform only, stopped under reduced motion and in low-performance mode); the node detail lines and the hint stay in the HTML, visually hidden. | specs/046-visual-storytelling | Implemented |
| VS-003 | When the live-demo strip renders, each demo shall show its capture as the tile with the title over it; host and technologies stay in the HTML, visually hidden; on phones the strip scrolls horizontally with snap points. | specs/046-visual-storytelling | Implemented |
| VS-004 | When the stack renders, each category shall read as a layer band with its label and compact badges, stacked top to bottom, every badge keeping its visible name. | specs/046-visual-storytelling | Implemented |
| VS-005 | When the method renders on wide screens, the four steps shall sit on a horizontal rail that draws itself as it enters the viewport (scroll-driven, no JavaScript), each step keeping its number, title and one line. | specs/046-visual-storytelling | Implemented |
| VS-006 | When the contact section renders, the primary call to action shall be the dominant element; its explanatory paragraph follows VS-001. | specs/046-visual-storytelling | Implemented |
| VS-007 | When any page is built, its visible and hidden text, links, routes, metadata and structured data shall be identical to the previous build except for the new accessible names introduced by this spec, which are listed in `tasks.md` and translated in `src/i18n/en-US.json`. | specs/046-visual-storytelling | Implemented |
| VS-008 | When the home is built, the Lighthouse budget (spec 032) shall hold; the inline document budget CSS-002 is revised by ADR-0013 and measured on every pull request. | specs/046-visual-storytelling | Implemented |
| VS-009 | axe-core reports no violation on the eleven page types at 1440 and 390 px; nothing conveys information by hover alone; every disclosure works with keyboard and screen reader. | specs/046-visual-storytelling | Implemented |
| VS-010 | When a service card renders, its bullet list shall sit behind the quiet toggle (VS-001) while the icon, the title and the one-line description stay visible; when a project card has a capture, its summary shall sit inside the detail disclosure next to the proof, so the capture, the title and the technology chips carry the card. Cards without a capture keep their summary visible. | specs/046-visual-storytelling | Implemented |

## Inner pages, visual first (spec 047)

| ID | Requirement | Source | Status |
| :--- | :--- | :--- | :--- |
| IP-001 | When a service renders on the hub or on its own page, it shall lead with a decorative glyph resolved from the `icon` field of its frontmatter; every published service shall resolve to a glyph (named values and the three emoji values in use). | specs/047-inner-pages | Implemented |
| IP-002 | When the services hub renders, the introduction shall sit behind the quiet toggle (VS-001) and each card shall show glyph, title, one-line description and the "Ver detalles" action, without a forced card height. | specs/047-inner-pages | Implemented |
| IP-003 | When a service page renders, a header shall carry the glyph and the title; body paragraphs, list items and quotes shall keep a 68 ch measure; second-level headings shall carry the green rule; the page file shall have no inline style. | specs/047-inner-pages | Implemented |
| IP-004 | When the blog index renders, each card shall open with a cover band whose number is generated by CSS and silent for assistive technology, the description shall sit behind the quiet toggle, and the "Leer artículo" action shall stay. | specs/047-inner-pages | Implemented |
| IP-005 | When an article renders, the page file shall have no inline style; the byline reads as a label, body blocks keep a 68 ch measure, and the share row keeps its three buttons. | specs/047-inner-pages | Implemented |
| IP-006 | axe reports no violation on the four page types at 1440 and 390 px; the reduced-motion probe stays clean; Lighthouse desktop accessibility 1.00 on `/servicios/`, `/blog/` and one page of each. | specs/047-inner-pages | Implemented |
| IP-007 | When a technology page renders, the heading shall lead with the technology's stack mark when the stack lists it (by name or by family), eyebrow and title shall share one column, and the intro line shall sit behind the quiet toggle. | specs/047-inner-pages | Implemented |
| IP-008 | When a project card has no capture, it shall open with a numbered cover band drawn by CSS from the card's index, silent for assistive technology; the small index stays in the markup, visually hidden. | specs/047-inner-pages | Implemented |
| IP-009 | When the About section renders, the profile links shall come before the disclosed copy. | specs/047-inner-pages | Implemented |

## Themes (spec 048)

| ID | Requirement | Source | Status |
| :--- | :--- | :--- | :--- |
| TH-001 | When the document carries `data-theme="light"`, or the system prefers light and no choice was made, the tokens shall switch to the brandbook paper values (`#EDF1F6` paper, `#002B66` ink, `#0047AB` cobalt, green ink `#2E6B00`, red ink `#C4001A`, brand black for solid shadows), every text token reaching 4.5:1 on paper and on white. | specs/048-themes | Implemented |
| TH-002 | While no choice and no light preference exist, the dark palette shall apply; the terminal shall keep its dark skin in both themes. | specs/048-themes | Implemented |
| TH-003 | When the visitor presses the header toggle, the theme shall switch, the choice shall persist in `localStorage` and apply before first paint on the next load; the toggle is a `button` with an accessible name and `aria-pressed` meaning light, shown only once the head script ran, and on phones inside the folded menu. | specs/048-themes | Implemented |
| TH-004 | One new accessible name ("Modo claro" / "Light mode"); no other text, link, route or metadata changes. | specs/048-themes | Implemented |
| TH-005 | axe reports no violation in either theme on the key pages at 1440 and 390 px; the Lighthouse budget holds. | specs/048-themes | Implemented |

## Micro-interactions (specs/next-micro-interactions)

| ID | Requirement | Source | Status |
| :--- | :--- | :--- | :--- |
| MI-001 | Where reduced motion is not requested, social pills lift 2 px on hover and focus, the theme toggle icon turns 18 degrees, and the theme toggle, filter buttons, social pills and quiet toggles scale to 0.96 while pressed; under reduced motion none of these movements runs. | specs/next-micro-interactions | Implemented |
| MI-002 | When the language switcher is hovered or focused, its link tints the background and raises the text to full ink. | specs/next-micro-interactions | Implemented |
| MI-003 | The micro-interaction rules read colours from the tokens and do not use `transition: all`. | specs/next-micro-interactions | Implemented |
| MI-004 | axe reports no violation in either theme and the Lighthouse budget holds. | specs/next-micro-interactions | Implemented |


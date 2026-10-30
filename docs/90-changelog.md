# Changelog

Relevant changes, newest first. The project has no version tags; entries are grouped by date and feature, summarized from `git log`. Commits before 2026-09-01 used a non-conventional message format and are summarized by theme.

## [Unreleased]

### Fixed

- The footer "Escribirme un mensaje" now links `/contacto/` (it linked the home section) and the contact page is the one that carries the copy button for the footer's visitors; DF-024 adds the page: free call, copy-email button and LinkedIn, in both languages, no WhatsApp.
- The footer column Contacto printed the public address and linked it with `mailto:`, which MAIL-006 forbids on the home; it now links the contact section ("Escribirme un mensaje"), where the copy button lives. The MAIL-006 guard covers the footer, header, hero and products band.

### Added

- Next-design-fusion DF-026: the hero no longer carries the capability panel ("Cómo conecto el backend") or the scroll cue, about 30 CSS rules and one animation less; VS-002 is superseded. The field and the blue band now fill the right of the hero.
- Next-design-fusion DF-022: the header mark draws itself once at load and section titles are uncovered by a mask once as their head comes into view, only without a reduced-motion preference and not on low-performance devices; no loop, nothing hidden at rest.
- Next-design-fusion DF-021: the footer shows the brand and four short columns (Servicios, Contenido, Tecnología, Contacto) with one legal line, in both languages; the specialty chips, the emoji and the long legal sentence are gone.
- Next-design-fusion DF-020: the hero is a full-bleed deep blue band in both themes, with the band's text, link and stroke colours, surfaces taken from the band for the system panel and the receipts, the brand green as the primary button, and the stroke field painted above the band.
- Next-design-fusion DF-018: the top bar has three links (Servicios, Proyectos, Blog), each a stroke icon and one word, with the current section marked; Arquitectura Frontend, Cómo trabajo and Sobre mí move to a footer navigation, in both languages.
- Next-design-fusion DF-019: the language switch shows the short codes ES and EN in the mono face, keeping 44 px targets and the full language name as the accessible name; built by `scripts/build-locales.mjs` on every page of both languages.
- Next-design-fusion DF-017: `/servicios/` and `/en/services/` show the designer's agenda diagram after the heading, as thirteen round-capped strokes in the stroke colour that draw in once without a reduced-motion preference and never loop; phones skip it. The home is unchanged.
- Next-projects-route step 3b (NPR-003, NPR-004, NPR-006): the seven 3D projects carry `bridge: true` and leave `/proyectos/` and the client catalog, where one row "Productos 3D: DSE y Contrast Viewer" stands for them; Nain3D and ParametriCAD stay as selected work and every 3D URL stays in the sitemap; the hero summary and the first service card point to DSE, and the Nain3D page says it is the original demo of the work now published as DSE (texts approved by the owner on 2026-10-29). COPY-009 and the confidential-name guard are amended because DSE is now public.
- Next-design-fusion T07d: the header shows the isotype with the vector wordmark in the theme's logo colour from 48 rem up, the isotype alone on phones; the text name is removed and the guard compares the header paths with `design/brand/wordmark-green.svg`.
- Next-projects-route step 3a (NPR-005 to NPR-007): a "Software propio con web propia" band after the featured projects promotes DSE (link to `datumstatutum.com`) and Contrast Viewer (link off until `viewer.contrast3d.com` exists, B-022), names Contrast Hub only as private software, and credits Contrast3D for design and CGI; the texts were approved by the owner on 2026-10-29. A guard checks that no page links `contrast3dhub.com` and that the band keeps the product copy rules. The home document is 27 931 B gzip.
- Next-projects-route step 2 (NPR-001): the home shows the six featured software projects (a `featuredOrder` in `projects.json`: CRM, Policy Operations API, .NET modernization harness, NainOrder, notification microservice, driving-school invoicing) under "Proyectos destacados", with no filter bar, and links to `/proyectos/`; the catalog component and the client renderer take a `selection` mode. The home document drops from 28 824 to 27 531 B gzip.
- Next-projects-route step 1 (NPR-002): `/proyectos/` and `/en/projects/` show the whole filterable catalog; its markup is now one component (`ProjectCatalog.astro`) shared with the home, the sitemap lists both pages and the guard `scripts/projects-route.test.mjs` checks them after the build. The home output is unchanged (28 824 B gzip).
- Next-design-fusion layer 4b: the hero reads title, free-call button, summary and availability, also on phones; the three offer tiles are removed because the services section carries the same three offers (HERO-023 rewritten); the home document drops 236 B gzip.
- Brand kit: `design/brand/` keeps the designer's logo, wordmark, LinkedIn banner and demo captures as delivered, with a README on contents, colours and rules, and a vector wordmark rebuilt from the delivered rasters in green, blue and white; a guard checks the kit and that none of it is published.
- Next-hero-field: the hero's WebGL icosahedron and point cloud are replaced by a 2D canvas field of round-capped strokes in the theme's stroke colour (green on dark, brand blue on paper), empty in the text column, denser toward the right, pushed away by a fine pointer and tinted red by a press; it loads from the idle queue as a 4.5 KB chunk, pauses off screen, breathes at about 20 fps and degrades to the static hero on slow frames. HERO-001 to HERO-004 are superseded by HERO-005 to HERO-009.
- Next-design-fusion: the designer's isotype is the site mark (inline SVG in the header, regenerated icons and touch icon, old raster logo removed; #44), the default social image `og-cover-v5.jpg` (1200×630 JPEG, 58 KB) shows it in place of the old horizontal logo under a new name so link-preview caches refresh, and layers 1 and 3 add the role tokens and a theme-aware browser bar (#42) and put the footer and the terminal on the deep blue band (#43).
- Spec 050: one work page per selected project under `/trabajo/<id>/` and `/en/work/<id>/` from a `work` content collection (problem, inline SVG architecture diagram translated by the localization build, decisions, what the demo lets a visitor verify, stack, previous and next navigation), `SoftwareSourceCode` structured data, the home cases linking their pages, and the `/trabajo/` hub as a `noindex` redirect to the home section; the four texts were approved by the owner (#37). The inner-page rules leave `main.css` for `inner-pages.css` and the pages, not the layout, import the stylesheets (`site.css` on the home, `inner.css` elsewhere, `work.css` on the work pages), which takes the home document from 30 030 to 28 140 B gzip (#37). The Nain3D catalog entry drops the OpenCASCADE and Khronos claims (#38). ADR-0016 and ADR-0017 (Proposed).
- Spec 049: a "Trabajo seleccionado" section after the hero tells four projects with a public demo as problem, approach and result beside a large capture (story lines approved by the owner, no figures or claims); the home reads in a narrative order of ten sections, the stack is a one-line strip inside the services, the catalog renders compact rows, the terminal is folded inside the about section, and the proof strip and the checklist box leave the home while their sentences and page stay on the site (#35). ADR-0015 (Proposed).
- Project pages: nain-mcp-validator, engineering-handbook, both full-stack templates and the organisation `.github` repository now have a static page on their own subdomain; the catalog and the open-ecosystem tiles link them and show captures of them in place of the README captures (`specs/next-project-sites`).
- Micro-interactions: press scale, social pill lift, theme toggle icon turn and language switcher hover tint, all CSS and all movement under `prefers-reduced-motion: no-preference` (`specs/next-micro-interactions`).
- Spec 048: light theme from the brandbook paper palette, applied by the system preference or chosen from a header toggle (persisted, applied before first paint); the terminal keeps its dark skin; solid shadows take a `--color-shadow` role. ADR-0014 (Proposed).
- Spec 048: light theme from the brandbook paper palette, applied by the system preference or chosen from a header toggle (persisted, applied before first paint); the terminal keeps its dark skin; solid shadows take a `--color-shadow` role. ADR-0014 (Proposed).
- Portfolio coverage: every public repository of the account now has a link and a capture on the site; NainLegacyModernizer links its live demo, `brandbook` and `status` tiles link their sites, and the five repositories without a site show a capture of their README (#28).
- Social preview image `og-cover-v4.jpg` (1200×630 JPEG, 74 KB) in the spec 045 style: cobalt surface, grid, the hero title, the horizontal logo and the capability panel; replaces the generic illustration of spec 026.
- Spec 047: services hub and pages lead with a glyph resolved from the service frontmatter; blog cards open with a numbered cover band; technology pages head with the stack mark; project cards without a capture get a cover band (#21, #22).
- Spec 046: explanatory text on the home sits behind an icon-only `<details>` toggle (text kept in the HTML); the hero capability panel reads as a pipeline with a travelling pulse; the live-demo strip shows the fourteen captures (400 px variants on phones); stack as layer bands, method as a scroll-drawn rail; service lists and captured project summaries behind the toggle (#18 to #20). ADR-0013 (Approved) raises the home document tripwire to 30 KiB gzip.
- Spec 043: the `Organization` structured data also lists the brand Facebook page in `sameAs`; the `Person` does not.
- Spec 042: the `Organization` structured data also lists the Google Business Profile share link and the Threads profile in `sameAs`; the `Person` does not.
- Spec 040: the `Organization` structured data now lists the brand YouTube, Instagram and TikTok profiles in `sameAs`; the `Person` does not.

### Changed

- Spec 045 (ADR-0012, Approved): design tokens from the brand palette on the dark surface, Urbanist as display font with a metrics-matched fallback, one fluid type scale, one card system with solid-shadow lifts, choreographed hero entrance, phone disclosure menu, CSS scroll progress, pointer-lit grid instead of particles, page transitions with the header kept in place, deep-blue footer band, compact privacy notice, terminal in one step under reduced motion (#13 to #17).
- Spec 041 phase B: the ecosystem bar is split into a core script (`ecosystem-bar.js`, 5.0 KB gzip), an architecture panel loaded on first open (`ecosystem-bar-panel.js`) and a versioned data file (`public/assets/data/ecosystem.v1.json`); without the data the bar keeps the brand and status links. Telemetry values are now escaped before rendering.
- Spec 041 phase A: ECO-003 now budgets the ecosystem bar by gzip transfer size (15 KB, was 15 KB raw); the 42 KB raw script (10.8 KB gzip) failed `npm run check` and blocked the deploys since 2026-10-16. ADR-0007 (Proposed).

### Fixed

- Spec 037: the Lighthouse gate no longer fails deploys on a rare browser-internal 66–72 ms task that hits most runs of one Chrome process: a failing measurement is repeated in a new process, up to three attempts, with unchanged limits (ADR-0006, Proposed); the Chrome version and each attempt are logged.
- Spec 035: intermittent TBT 250–400 ms on GitHub runners: deferred modules now start one per idle slot (`runQueueWhenIdle`) instead of in one task, and the SVG favicon is no longer declared because Chrome parses it on the main thread (about 47 ms at 6x CPU); the SVG file stays published.
- Spec 034: incident 2026-10-13 (home page 404 for about 13 minutes): GitHub Pages also published the raw repository on every push; the Pages source is now GitHub Actions only.

### Changed

- Spec 036: NainDev is now an `Organization` in the structured data (company LinkedIn, GitHub, GitLab and X in `sameAs`); the person keeps personal profiles and gains GitLab; the website and articles are published by the organization.
- Spec 033: WCAG 2.2 AA fixes: accessible code highlighting theme, no keyboard trap or focus theft in the terminal, visible terminal focus, working skip link; one decorative-text exception documented.
- Spec 032: 25 % of page views send one `Web Vitals` event (LCP, INP, CLS) to Plausible (ADR-0004, Proposed); deploys and pull requests fail when the Lighthouse budget breaks (`npm run check:budget`, ADR-0005, Proposed).
- Spec 031: page styles are inlined (`build.inlineStylesheets: 'always'`), removing the only render-blocking request; the home page HTML grows from 9.4 to 17.4 KiB compressed.
- Spec 030: the hero scene is drawn with a 7 KiB WebGL module instead of Three.js (657 KiB), pixel-identical to the previous scene.
- Spec 029: Astro's client router is replaced by native cross-document view transitions and Speculation Rules prerendering on hover (ADR-0003, Proposed); 16 KiB less JavaScript per page and no SPA lifecycle code.
- Spec 028: Inter and Outfit subset to the characters the site uses and to the OpenType features it needs (80.5 KB → 63.4 KB, pixel-identical); arrows on the blog and privacy pages now render in the site font.
- Spec 027: `static-site-check.yml` runs only on pull requests; pushes to `main` are validated once, by the deploy workflow.
- Spec 026: the default social preview image is a 46 KB 1200×630 JPEG (`og-cover-v3.jpg`) instead of a 1.5 MB PNG.
- Spec 025: the placeholder MailerLite newsletter and checklist forms are removed; the checklist is requested by email to `contact@naindev.com`, and the CSP no longer allows MailerLite.
- Spec 024: GitHub Actions pinned to commit SHAs, Pages write and OIDC permissions limited to the deploy job, checkout without persisted credentials and `npm ci` without the `npm install` fallback.
- Spec 023: "Copiar email" copies `contact@naindev.com` instead of the Calendly button label.
- Spec 021: home-only modules load on demand, decorative effects and the WebGL probe start when idle, project filters and reveal motion no longer force layout, the terminal prompt is excluded from Cloudflare email obfuscation, and the performance mode survives client-side navigation. Local Lighthouse mobile 99 → 100, TBT 51 ms → 0 ms (154 ms → 0 ms with CPU ×6).
- Spec 022: the deploy workflow no longer calls the Cloudflare purge API, which had always failed silently; Cloudflare caches only hashed `/_astro/` files.
- Spec 020: low-end device performance. One variable font file per family instead of twelve URLs for two files; client scripts, styles and fonts bundled and hashed by Astro (ADR-0002, Proposed); WebGL probe moved out of the document head; hero visible without JavaScript; compositor-only availability pulse; `content-visibility` on off-screen home sections; header logo served at its rendered size. Adds `scripts/performance.test.mjs` and `scripts/performance-build.test.mjs` to `npm run check`.

- Spec 015: the NainOrder catalog entry links its live API demo, matching the GitHub profile.
- Spec 014: the home services section presents multi-domain conformance and a Python and .NET critical backend; "escala industrial", USD support, real-time conversion and "thousands of validations per hour" are removed from the 3D service page and blog copy.
- Spec 013: home title and description, Person job title and blog and service hub titles follow the full stack architect profile instead of "Arquitectura Backend, 3D e IA".
- Spec 012: the hero presents multi-domain conformance and the current stack, the trophy badge is replaced by factual traits, the tech stack section and terminal match the GitHub and LinkedIn profiles, and the project catalog lists every public project plus seven anonymized private ones, without unverified performance figures. Adds CC0 Simple Icons for Vue, PostgreSQL, Tailwind CSS, Astro, Pydantic, GitHub Actions and MCP.
- Spec 011: the About section and the terminal story describe the collaboration work as a multi-domain deterministic conformance architecture whose first domain is 3D assets, without naming the product or its internal profiles.
- Spec 010: the About section names the role as CTO at Contrast3D x NainDev instead of Lead Software Architect.
- Spec 009: calls to action offer a free call instead of a free audit; the hero states part-time, remote availability; the About section names the Contrast3D x NainDev collaboration; the terminal drops the confidential project, redacted values and telemetry figures; service pages describe availability as a design goal. The claim guard now blocks "99.9x%" figures, p95 latency and uptime readings and "[REDACTED]" placeholders.

### Added

- Spec 008: single public contact address `contact@naindev.com` in the privacy policy, checklist fallback and design brief, replacing `hola@` and `hello@`.

- Backup branch `naindev/legacy` at `77317aa`, the published site before case study removal and redesign.

- Lifecycle documentation under `docs/` and feature template `specs/000-template-feature/` (ADR-0001, approved 2026-09-16).
- Design branch `design/home-redesign` prepared for the designer, with a proposal template and a GitHub web upload flow in the brief.

### Removed

- Spec 007: case studies in both locales (collection, `/casos/` pages, home section, header link, hero button, technology and service page references, thank-you block, terminal link, client renderer and data). Retired URLs, including legacy `.html` addresses and three technology pages that only case studies generated, now redirect to the related service page; `npm run check` gains a case-study contract.
- Spec 006: home page impact metrics, the "Colaborador OSS" hero badge and the thank-you page "Zero Downtime" badge, all unverified; claim guard extended to runtime data files.
- Spec 005: removed the unverified "+50M" claim from both locales and added a claim guard to `npm run check` (`c78c854`).

## 2026-09-16 - Design collaboration (spec 004)

### Added

- Design brief `design/README.md` for an external designer, with audience, brand constraints, workspace layout and branch rules (`946468c`).
- Redesign goals and brand constraints from the owner interview, DES-007 to DES-011 (`c408a01`).
- Repository ruleset `protect-non-design-branches` restricting non-admin pushes outside `design/**` (GitHub setting, not a commit; access check from the designer's account still pending).

## 2026-09-08 - English localization (spec 003)

### Added

- Reviewed American English pages under `/en/`, generated at build time from Spanish HTML and a content-addressed catalog; local draft generation, review and watcher workflow; localization runbook (`b725662`).

### Fixed

- Production verification accounts for CDN transforms such as Cloudflare email obfuscation (`71dbced`).

## 2026-09-07 - Search brand presentation (spec 002)

### Fixed

- Favicon safe area for circular masks, consistent brand metadata, article/page entities, real breadcrumbs, snippet exclusions, hub navigation and main-content landmarks (`d2d6833`).

### Added

- Deployment and full production verification records (`60ed035`, `cecf7d0`).

## 2026-09-01 - Brand favicon indexing (spec 001)

### Fixed

- Replaced the Astro favicon with NainDev PNG/ICO assets and a cache-safe declared ICO URL (`79f0e5a`, `fcaa27f`).

### Added

- Favicon deployment verification record (`8652f59`).

## 2026-08-29 - SEO, validation and hardening

### Fixed

- Search indexing and site validation, broken technology links, MailerLite styles in the CSP (`94d72a6`, `2ffe960`, `17853f7`).

### Changed

- Breadcrumbs, dynamic Open Graph images, personal-brand structured data, `astro:assets`, prefetch, 404 page, social proof and checklist content; dependency updates from `npm audit fix` (`cc25fa1` to `08e77fb`).

## 2026-08-23 to 2026-08-25 - Astro migration and B2B repositioning

### Changed

- Full migration to Astro with dynamic routes and MDX collections (`d23e539`); Astro promoted to the repository root (`4094fae`).
- B2B repositioning toward high-performance frontend and backend architecture; README rewrite; SEO content cluster and lead-magnet CRO (`4d749be`, `462040c`, `a16fb46`, `c814ebf`).
- Interactive demos moved to their own repositories (`5581b3a`, `ec76b68`).

### Removed

- Business strategy files and AI assistant configuration from tracking; `SECURITY_POLICY.md` added (`b236d70`, `e0a41b2`).
- 3D validation cards from the public catalog (`6509cde`).

### Fixed

- Static validation workflow (`04f46d0`).

## 2026-08-01 to 2026-08-20 - Portfolio rebuild

### Added

- Portfolio foundation and validation, 3D hero, tech stack, case studies, impact metrics, interactive terminal, project catalog, blog and first CI/CD (`546ddb3` to `5cf19d1`).

## Before 2026-08

### Added

- Initial template site, content, multilingual switcher, custom domain `CNAME`, early project pages (`140d81d` to `f719700`).

# Requirements

Status: Draft

Stable functional requirements, written in EARS notation. Feature-level detail lives in `../specs/NNN-*/spec.md`; this file holds the consolidated, product-wide list.

EARS patterns:
- Event-driven: `When <trigger>, the system shall <response>.`
- State-driven: `While <state>, the system shall <response>.`
- Unwanted behaviour: `If <condition>, then the system shall <response>.`
- Ubiquitous: `The system shall <response>.`

IDs keep the prefixes defined in the source specs (`BR-`, `SEO-`, `LOC-`, `DES-`, `CLM-`) instead of `REQ-###`, so existing references in specs, tests and commits stay valid. Wording below is condensed; the source spec is authoritative.

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
| SEO-007 | When Google extracts a snippet, shared header and footer boilerplate shall be excluded with supported `data-nosnippet` containers; main content shall stay eligible; primary navigation shall link to service/case hubs. | specs/002-search-brand-presentation | Implemented |
| SEO-008 | When the skip link is followed, every indexable page shall provide a main-content target. | specs/002-search-brand-presentation | Implemented |
| SEO-009 | When `npm run check` runs, it shall validate icon framing and the generated site's metadata, structured data, sitemap, internal links and index policy. | specs/002-search-brand-presentation | Implemented |
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
| DES-008 | Proposals shall keep the NainDev brand and logo colors `#0047AB`, `#00BFFF` and `#FFFFFF`. | specs/004-design-collaboration | Accepted |
| DES-009 | Proposals may restructure sections and rewrite copy; final wording requires owner approval. | specs/004-design-collaboration | Accepted |
| DES-010 | Mockups shall be delivered in Spanish and English. | specs/004-design-collaboration | Accepted |
| DES-011 | Proposals shall not present unverified metrics, including the current "+50M" badge. | specs/004-design-collaboration | Accepted |
| DES-012 | The owner shall provide a ready branch `design/home-redesign` with its folder so the designer can upload through the GitHub web interface. | specs/004-design-collaboration | Implemented |

## Content integrity

| ID | Requirement | Source spec | Status |
| :--- | :--- | :--- | :--- |
| CLM-001 | When the site is built, the system shall not publish the unverified claim "+50M" in any locale. | specs/005-remove-unverified-claims | Implemented, verified in production |
| CLM-002 | When a source component or page reintroduces a blocked claim, the project validation command shall fail and name the file. | specs/005-remove-unverified-claims | Implemented |
| CLM-003 | When the site is built, the system shall not publish the impact metrics "40 → 6 min", "99.99% uptime on critical systems", "10+ developers mentored" or "3 architectures migrated" in any locale. | specs/006-remove-unverified-metrics | Implemented, production check pending |
| CLM-004 | When the site is built, the system shall not publish the "Colaborador OSS" hero badge or the thank-you page "Zero Downtime" badge in any locale. | specs/006-remove-unverified-metrics | Implemented, production check pending |
| CLM-005 | When the home page loads, the free checklist call to action shall remain visible and linked. | specs/006-remove-unverified-metrics | Implemented |
| CLM-006 | When a blocked claim returns to sources, runtime data or build output, `npm run check` shall fail and name the file. | specs/006-remove-unverified-metrics | Implemented |

Spec 005 is committed as `c78c854`; production confirmation after deployment is still open in its `tasks.md`. Other homepage claims awaiting owner evidence are tracked in `11-open-questions.md`.

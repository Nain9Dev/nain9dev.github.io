# Changelog

Relevant changes, newest first. The project has no version tags; entries are grouped by date and feature, summarized from `git log`. Commits before 2026-09-01 used a non-conventional message format and are summarized by theme.

## [Unreleased]

### Added

- Lifecycle documentation under `docs/` and feature template `specs/000-template-feature/` (ADR-0001, approved 2026-09-16).
- Design branch `design/home-redesign` prepared for the designer, with a proposal template and a GitHub web upload flow in the brief.

### Removed

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

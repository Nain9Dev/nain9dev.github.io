# Search and AI discovery

Status: In progress

## Objective

Help every search engine and AI answer engine find, understand and attribute the site to Aitor Nain and NainDev, without changing the visual design. The audit of 2026-11-09 found the on-page basics already in place (canonical, hreflang, Open Graph, JSON-LD, sitemap). What was missing: a machine-readable site summary for AI systems, language alternates and dates in the sitemap, an explicit crawler policy, and richer expertise data on the `Person` entity.

## Requirements

- DISC-001: When a crawler requests `/llms.txt`, the site shall return a plain-text Markdown document that starts with an H1 `NainDev`, a one-line summary in a blockquote, and sections listing the home, services, work pages, projects and blog posts with absolute URLs and a short description each.
- DISC-002: Every `https://www.naindev.com/` link in `llms.txt` shall resolve to a published page that is listed in the sitemap, and no link shall point to a noindex page.
- DISC-003: When the sitemap is built, every URL entry shall carry `xhtml:link` alternates for `es`, `en` and `x-default`, and each alternate shall itself be a sitemap URL.
- DISC-004: When the sitemap lists a blog post, its entry shall carry `lastmod` equal to the post publication date (`YYYY-MM-DD`); pages without a known modification date shall carry no `lastmod`.
- DISC-005: When a crawler requests `/robots.txt`, the file shall allow the general crawlers and name the search and AI crawlers (OpenAI, Anthropic, Perplexity, Google-Extended, Applebot-Extended) with an explicit `Allow: /`, and shall keep advertising the sitemap index.
- DISC-006: When any page is rendered, the `Person` entity shall list `knowsAbout` with the technical fields stated on the site, and a `description` equal to the site description.
- DISC-007: The build shall fail `npm run check:seo` if any of DISC-001 to DISC-006 regresses.

## Edge cases

- Spanish is the source language; English pages are generated from reviewed catalog entries. This change adds no new translatable Spanish string: `knowsAbout` is not a translated schema key and `Person.description` reuses the existing home description.
- `lastmod` is emitted only where the date is known and true. No build date is used, because a date that changes on every deploy teaches crawlers to ignore the field.
- The apex domain `naindev.com` redirects to `www`; it carries no files of its own.

## Out of scope

- New copy, titles or descriptions (they would need reviewed English entries); a follow-up can trim the three descriptions above 160 characters and lengthen the short contact titles.
- The project demo sites on subdomains (separate repositories) and the Search Console and Bing Webmaster steps.

## Session state

- Last updated: 2026-11-09
- Done: audit of 68 indexable URLs (all have one title, description, canonical, H1 and hreflang).
- Next: tests, then implementation.
- Blocked: nothing.

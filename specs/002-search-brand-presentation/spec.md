# Search Brand Presentation

## Scope

Improve the existing site's search presentation and technical SEO. Preserve the
NainDev mark, service content, canonical hostname, public URLs, and index policy.
The initial scope covered local implementation and verification. On 2026-09-07,
the owner subsequently authorized commit, push, and deployment of the reviewed
result. Account changes and Search Console submissions remain separate actions.

## Verified baseline (2026-09-07)

- Production serves the same PNG, ICO, and SVG icon bytes as this checkout.
- The SVG viewBox tightly encloses the mark; its corners are clipped by a circle.
- WebSite.name is NainDev, but og:site_name is Aitor Nain.
- The existing build passes and produces 71 pages plus five redirect documents.
- The sitemap contains 33 unique URLs; indexable pages have unique titles and
  descriptions, one H1, and no broken internal page links in the static audit.
- Article structured data uses the same ID for BlogPosting and mainEntityOfPage.
- Automatic breadcrumbs invent non-existent /recursos/ and /tecnologia/ parents.

## Requirements

- SEO-001: When an icon is displayed in a circular mask, the complete NainDev mark
  shall remain inside the mask, centered with at least 15 percent clear space on
  every side, while preserving its original shapes and colors.
- SEO-002: When assets are regenerated, the SVG, 96px PNG, 180px touch icon, and
  16/32/48/64px ICO frames shall represent the same mark at their stable URLs.
- SEO-003: When any page is rendered, its Open Graph site name and WebSite name
  shall be NainDev; the home title shall name both NainDev and Aitor Nain.
- SEO-004: When an indexable page is built, it shall have one unique title and
  description, one H1, a canonical URL matching og:url and the sitemap, and
  permission for large image previews. Existing noindex pages shall stay excluded.
- SEO-005: When an article is rendered, a BlogPosting shall refer to a distinct
  WebPage and the real author, and the publication date shall be visible and
  machine-readable. Structured data shall be valid JSON and escape HTML delimiters.
- SEO-006: When breadcrumbs are generated, every linked item shall resolve to an
  existing canonical page and the current item shall use its human-readable title.
- SEO-007: When Google extracts a snippet, shared header and footer boilerplate
  shall be excluded using supported data-nosnippet containers. Main content shall
  remain eligible for snippets; primary navigation shall link to service/case hubs.
- SEO-008: When the skip link is followed, every indexable page shall provide a
  main-content target. Existing page content and navigation behavior shall remain.
- SEO-009: When npm run check runs, it shall validate icon framing and the generated
  site's metadata, structured data, sitemap, internal links, and index policy.
- SEO-010: When collection content declares a social image, the generated page
  shall refer to an existing asset; stale references shall use the existing brand
  cover through the collection default without changing article/service body text.

## Dependencies and external actions

- [A] Use the installed Node/Astro toolchain. Declare the already installed sharp
  and parse5 packages as development dependencies for reproducible asset generation
  and standards-based HTML validation; no runtime service or paid resource is needed.
- [M] Review and authorize a separate commit/push/deployment before production changes.
- [M] After publication, verify public asset hashes and inspect/request the home URL
  in Search Console. An accepted crawl request is not proof of a refreshed result.
- [H] Supply verified case-study evidence and business priorities for future content
  changes. No metrics, testimonials, credentials, or service claims are invented here.

## Reference material

Consulted on 2026-09-07:

- https://developers.google.com/search/docs/appearance/favicon-in-search
- https://developers.google.com/search/docs/appearance/site-names
- https://developers.google.com/search/docs/appearance/snippet
- https://developers.google.com/search/docs/appearance/structured-data/article
- https://docs.astro.build/en/basics/astro-components/
- https://docs.astro.build/en/guides/routing/
- https://docs.astro.build/en/guides/content-collections/

The icon safe area is a project acceptance criterion, not a Google padding rule.
Google controls search-result selection and refresh timing; rankings and Core Web
Vitals improvements are not acceptance claims for this local change.

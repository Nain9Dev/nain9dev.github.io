# Verification and Publication Handoff

Verified on 2026-09-07. This document records a local change, not a live release.

## Requirement coverage

| Requirements | Evidence |
| --- | --- |
| SEO-001, SEO-002 | check-brand-icons.mjs decodes alpha bounds, checks circular containment/centering, validates ICO offsets and sizes, and compares each raster with the SVG. |
| SEO-003, SEO-004 | check-seo.mjs parses every generated document, compares brand/canonical/social metadata and sitemap membership, and checks unique indexable titles/descriptions. |
| SEO-005, SEO-006 | Three unit tests plus generated JSON-LD checks verify serialization, real breadcrumb routes, distinct page/article identities, and visible publication dates. |
| SEO-007, SEO-008 | Generated checks cover supported data-nosnippet containers, snippet eligibility of the H1, hub links and main-content targets; actual navigation was checked in the browser. |
| SEO-009, SEO-010 | npm run check includes the icon/SEO contracts; every emitted social image resolves to an existing build asset. |

## Local commands

```sh
npm run generate:brand-icons
npm run check
git diff --check
```

The generator is only needed when changing the SVG. Both tools added as direct
development dependencies (sharp and parse5) were already installed transitively;
their versions were retained and no runtime service was added.

## Publication sequence (separate authorization required)

1. Review the diff and authorize an explicit commit/push/deployment scope.
2. Run the repository checks and inspect the deployment workflow for that commit.
3. Confirm HTTP 200 and matching local/public hashes for /favicon-96x96.png,
   /favicon-naindev.ico, /favicon.ico, /apple-touch-icon.png and the SVG. Preserve
   these stable URLs; investigate caching only if the downloaded bytes differ.
4. Confirm the public home title, NainDev site name, icon declarations and robots
   policy. Check an article's cover and date, and sitemap membership.
5. Inspect the public home URL in Search Console; request recrawling once if the
   deployed change is fetchable. Record request acceptance separately from a later
   refreshed favicon or selected site name.
6. Read current Pages, Performance and Core Web Vitals reports before deciding
   further content or performance priorities. No ranking or timing promise follows
   from this implementation.

## Authoritative references

Consulted on 2026-09-07:

- [Google favicon requirements](https://developers.google.com/search/docs/appearance/favicon-in-search)
- [Google site names](https://developers.google.com/search/docs/appearance/site-names)
- [Google snippet controls](https://developers.google.com/search/docs/appearance/snippet)
- [Google article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Google robots directives](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)

The 18.18% margin is a tested design choice for this mark, not a Google requirement.

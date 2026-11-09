# Plan: search and AI discovery

## Design

- `src/utils/llms.ts`: pure `buildLlmsTxt(input)`; unit-tested without Astro.
- `src/pages/llms.txt.ts`: static endpoint that reads the `servicios`, `blog` and `work` collections and `projects.json`, then calls `buildLlmsTxt`. Output lands in `dist/llms.txt` before `build-locales.mjs` runs, which does not touch it.
- `scripts/lib/sitemap.mjs`: pure `buildSitemap(entries)` with `xhtml:link` alternates and optional `lastmod`; `build-locales.mjs` replaces its inline string with it and reads each blog post `article:published_time` as `lastmod`.
- `public/robots.txt`: explicit crawler groups, then the sitemap line.
- `src/components/SEO.astro`: `Person.knowsAbout` and `Person.description`.
- `scripts/check-seo.mjs`: build-level checks for DISC-001 to DISC-005; `scripts/seo-discovery.test.mjs`: unit tests, wired into `check:seo`.

## Risks

- The Cloudflare zone in front of GitHub Pages may block AI user agents regardless of `robots.txt`; verified with live requests after deploy.
- `knowsAbout` must not contradict `scripts/check-claims.mjs`; it lists only technologies already on the site.

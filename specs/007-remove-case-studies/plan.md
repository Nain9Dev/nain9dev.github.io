# Remove Case Studies Plan

Status: Implemented

## Steps

1. Map every tracked reference to `casos`, `case-studies`, `CaseStudies`,
   `stealth-3d-ai` and `optimizacion-saas` (git-ignored `src/content/marketing`
   excluded). Matches for "casos de uso" (use cases) and the shared
   `.case-study-card` / `.case-study-list` classes are not case studies and stay.
2. Add `scripts/case-studies.test.mjs`, a contract over the built `dist/`, and
   run it as `npm run check:case-studies` right after the locale contract.
   Observe it fail against a build of `HEAD`.
3. Delete the collection, pages, home section, client renderer and data file.
   Remove links and wording from the header, hero, technology pages, service
   pages, thank-you page and terminal data.
4. Declare the redirect map from `spec.md` in `astro.config.mjs`. English
   redirect documents are produced by `scripts/build-locales.mjs`, which already
   rewrites refresh targets and canonicals with `englishPath()`. The hub mapping
   `casos` → `case-studies` stays in `scripts/lib/localization.mjs` so the
   English retired URLs keep their previous addresses.
5. Remove CSS selectors that no remaining markup uses. `.case-study-card` and
   `.case-study-list` are kept: privacy, checklist, thank-you and technology
   pages use them.
6. Run `npm run translations:prepare`, add reviewed English entries for the new
   segments, remove catalog entries no longer referenced by
   `.astro/translations/source.json`, keeping the existing key order.
7. Run `npm run check`.

## Key decisions and assumptions

- **Redirect targets** (assumption, owner may change): each retired page points
  to the existing service closest in subject.
  - `stealth-3d-ai` (3D validation backend, C# .NET, ONNX) →
    `/servicios/validacion-3d/`.
  - `optimizacion-saas` (SaaS API performance, Redis, SQL Server, .NET Core) →
    `/servicios/optimizacion-rendimiento-apirest-dotnet/`.
  - The listing `/casos/` → the service hub `/servicios/`.
- **Retired technology pages** (assumption): `ONNX`, `Kubernetes` and
  `.NET Core` pages were generated only from case-study `techStack` values.
  They are `noindex` and excluded from the sitemap, but the home tech stack
  linked `ONNX`, so they redirect to the service related to the case study that
  declared them instead of returning 404.
- **Hero secondary button**: "Ver caso: Validación 3D" becomes "Ver Servicios"
  linking to `/servicios/`, reusing the wording of the home services section.
- **Frontend service button**: "Ver Casos de Éxito" (already linking to
  `/#projects`) becomes "Ver Proyectos"; the destination is unchanged.
- **Technology page intro**: "Servicios y casos de estudio reales donde he
  implementado {tech} en producción." becomes "Servicios relacionados con
  {tech}.", which drops the case-study mention and makes no production claim.
- **Terminal `story` command**: only the case-study link is removed.
- **Trailing slash** on new redirect targets matches the canonical URLs, so
  GitHub Pages does not add a second hop.

## Known limit: no HTTP 301 on GitHub Pages

GitHub Pages serves static files and cannot answer with an HTTP 301 or 308 for
an arbitrary path. Astro's static `redirects` therefore emit an HTML document
per retired URL. Verified in the build output of this change:

```html
<!doctype html><title>Redirecting to: /servicios/validacion-3d/</title>
<meta http-equiv="refresh" content="0;url=/servicios/validacion-3d/">
<meta name="robots" content="noindex">
<link rel="canonical" href="https://www.naindev.com/servicios/validacion-3d/">
<body><a href="/servicios/validacion-3d/">Redirecting from <code>/casos/stealth-3d-ai/</code> to <code>/servicios/validacion-3d/</code></a></body>
```

The English copy produced by `build-locales.mjs` has the same structure with
`/en/services/...` as refresh target, canonical and link. Consequences:

- The response status is 200, not 301. Google treats an instant meta refresh
  plus a canonical as a redirect signal, but consolidation is slower and less
  certain than with a server redirect.
- The document `<title>` and body text are Astro's English boilerplate and still
  show Spanish paths on the English copy. They are `noindex` and shown only
  for an instant; this predates the change.
- A legacy `/casos/stealth-3d-ai.html` request resolves through GitHub Pages to
  the directory `casos/stealth-3d-ai.html/index.html`, as before this change.
- A real 301 would require an edge rule (for example Cloudflare, B-004), which
  is out of scope and would need an owner decision.

## Test strategy

`scripts/case-studies.test.mjs` (node:test, reads `dist/`):

- CASE-001: no non-redirect HTML under `/casos/` or `/en/case-studies/`.
- CASE-002, CASE-003: no non-redirect page has an `href` to a case-study route,
  and its body text (excluding code) has no "caso(s) de estudio/éxito",
  "case study/studies" or "success story" wording.
- CASE-003: both home pages lack the section id and grid; `app.js` does not
  import the renderer; `case-studies.js` is not published.
- CASE-004, CASE-005: every retired URL in both locales is a refresh document
  whose target and canonical equal the mapped page, stays `noindex`, and the
  target is a real content page.
- CASE-006: Spanish and English runtime JSON under `assets/data` has no
  case-study link and `case-studies.json` is not published.
- CASE-007: `sitemap-0.xml` has no case-study URL.
- CASE-008: the existing SEO and localization contracts in `npm run check`;
  `check-seo.mjs` now also fails if the header links to `/casos/`.

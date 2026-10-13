# ADR-0002: Bundle client scripts and styles with Astro

Status: Proposed
Date: 2026-10-13

## Context

Client scripts live in `public/assets/js/` and stylesheets in `public/assets/css/`. Astro copies them verbatim, so they are not minified, not content-hashed and not deduplicated. Cache busting relies on a manual `?v=NNN` suffix that has drifted: on 2026-10-13 production loaded `locale.js` and `site-interactions.js` twice each, once with and once without `?v=019`, creating two module instances. The home page needs three sequential request rounds before every module is known. GitHub Pages also ignores `public/_headers`, so the `immutable` caching it declares is never applied (spec 020).

## Decision

Move client modules to `src/scripts/`, all stylesheets (including the locale switcher styles that `scripts/build-locales.mjs` used to inject by URL) to `src/styles/` and the self-hosted fonts to `src/assets/fonts/`, and load them through processed Astro `<script>` blocks and frontmatter imports. Astro and Vite then bundle, minify and hash them under `/_astro/`. The manual `?v=` convention is retired.

Exceptions:

- `three.module.min.js` moves to `src/vendor/` and is imported with `?url`: Vite emits it byte-for-byte (keeping its MIT notice) under a hashed name, and the 3D hero loads it with a runtime dynamic import only on capable desktops.
- JSON data under `public/assets/data/` stays public because the locale build rewrites it per language. The catalog fetch uses `cache: 'no-cache'` so the data is revalidated instead of versioned by hand.

## Consequences

- One hashed module per page instead of about twenty requests; shared imports exist once.
- Hashed filenames allow a one-year cache once B-016 (Cloudflare Cache Rule) is in place.
- Contributors edit scripts in `src/scripts/`; tests import from there. Specs that mention `public/assets/js/` describe history and are not rewritten.
- The designer's branch (`design/home-redesign`) works on standalone HTML and is not affected.

## Alternatives considered

- **Keep public assets and fix specifiers by hand**: removes the duplicate modules but keeps the waterfall, the unminified files and the manual versioning that caused the drift.
- **Add `three` as an npm dependency**: would hash it as well, but adds a dependency and a version to track for a file loaded only on capable desktops.
- **Bundle the vendored Three.js as a lazy chunk**: the minifier strips its license comment.

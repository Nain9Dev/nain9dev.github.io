# Brand Favicon Indexing Specification

## Scope

Provide one consistent NainDev brand mark for browser tabs, Google Search, and Apple touch surfaces. Improve the above-the-fold header logo loading signal without changing its visual design.

## Requirements

- BR-001: When a crawler reads the home page, the site shall expose a square PNG favicon of at least 96 by 96 pixels at a stable URL.
- BR-002: When a client requests either the conventional `/favicon.ico` fallback or the declared stable `/favicon-naindev.ico` resource, the site shall return matching valid ICO containers whose embedded sizes include 16, 32, 48, and 64 pixels and use the NainDev mark.
- BR-003: When an Apple client reads the home page, the site shall expose a 180 by 180 PNG touch icon.
- BR-004: When any declared site icon is selected, it shall represent the same NainDev mark and shall not contain the Astro logo.
- BR-005: When the above-the-fold header logo is rendered, Astro shall mark it as a priority image.
- BR-006: When the project validation command runs, it shall fail if the favicon files or metadata regress.

## Acceptance Criteria

- `npm run check` completes successfully.
- The favicon contract test validates PNG dimensions, ICO structure and declared icon paths.
- The production URLs return HTTP 200 with matching file signatures and dimensions.
- A cold browser load shows the NainDev mark in the tab and header.
- Google Search Console live inspection can fetch the corrected home page before indexing is requested.

## External Actions

- `[A]` Publish the verified commit to `main` and observe GitHub Pages deployment.
- `[H]` Use the already authenticated Google Search Console session only to inspect the public home page and request indexing.

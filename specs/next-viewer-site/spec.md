# Specification: A public website for Contrast Viewer

Status: Draft, written from `specs/next-projects-route` (D5, D8) and a read-only survey of the product repositories on 2026-10-29. The site is built outside this repository; this spec records what it must be so the work can start as soon as the address exists.

## Objective

Contrast Viewer (a web component that shows 3D models) has no public marketing page: its demo host is gated by design and must stay that way. The owners decided that the product gets its own static site on `viewer.contrast3d.com`, so that naindev.com, Contrast3D and DSE can link to it, without exposing the app host, its access links or any customer material.

## Facts the survey reported (to verify before building)

- DSE already has a static, bilingual site built by a dependency-free Python generator (`web/`, pages for index, how it works, profiles, sample report, pilots, 404) and a strict CSP in `_headers`. It is the template to clone.
- The viewer's demo host answers 403 because the application itself checks a signed per-company link; only the bundle path is public. Adding a public path there was rejected in the viewer's own decision records.
- The viewer is proprietary software owned in equal shares by Contrast3D and NainDev. The package is private.
- Public material that exists: six demo thumbnails (`demo/parts-demo-thumbs/*.webp`), render-only visual-test screenshots, a benchmark document, the README and the integration notes. The demo car model has no recorded provenance. The model rules allow only CC0 or CC-BY assets with credit.
- The demo catalogue names real clients; the integration notes and decision records contain internal hostnames. None of that may be copied.

## Functional requirements (EARS)

- **VS-001 (address and hosting)**: When the site is published, it shall answer 200 at `https://viewer.contrast3d.com/` as a static site on Cloudflare Pages, in a first-level subdomain of the Contrast3D zone, and no route of the app host shall change.
- **VS-002 (pages)**: The site shall have a home (what it is, who it is for, a still or short capture, how to ask for access), a page on how it works for integrators (the web component, what it shows, the supported formats stated only as measured), a page of capabilities with captures, and a contact page; each in English and Spanish, English at the root.
- **VS-003 (public material only)**: Every image, text and model on the site shall come from the list of public material approved by the owners; no client name, internal hostname, port, key name, token or access link shall appear in the source, the build or the history of the site repository.
- **VS-004 (models)**: When a model is shown, its licence shall be CC0 or CC-BY and its credit shall be on the page; a model of unknown provenance shall not be shown.
- **VS-005 (copy rules)**: The copy shall not say "certified", "AI-powered" or any unmeasured performance claim, and shall state no price; availability shall say that access is by agreement.
- **VS-006 (links)**: The site shall link to DSE, to Contrast3D and to NainDev, and shall not link the gated app host or any Contrast Hub host; naindev.com, DSE and Contrast3D shall link to it once it answers 200.
- **VS-007 (search)**: The site shall be indexable from its first public version (robots, sitemap, canonical, hreflang, structured data for the product), because the owners want it promoted.
- **VS-008 (quality gates)**: The build shall run the same gates as the DSE site (copy check, accessibility check, structure check) and a check that fails on any forbidden string of VS-003.
- **VS-009 (licence of the site)**: The site source shall carry the licence the owners choose for marketing material; the viewer's own licence shall not be implied to be open.

## Out of scope

- The viewer application, its access model and its release process.
- Any demo that runs the viewer on the public site (a later decision; it would need a model that passes VS-004 and a host that is not the gated one).
- Contrast Hub.

## Acceptance criteria

- The site builds from a clean checkout and passes its gates; the forbidden-string check is green.
- `curl -I https://viewer.contrast3d.com/` answers 200, and `https://viewer.contrast3dhub.com/` still answers 403.
- naindev.com shows the Contrast Viewer link (`viewerSiteLive` set to true in `ProductsBand.astro`).

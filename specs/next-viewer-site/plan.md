# Plan: A public website for Contrast Viewer

## Approach

Clone, do not invent: the DSE site generator is the template (static pages from templates, bilingual, strict CSP, three quality gates). The viewer site is a new small repository in the product organization, so that the viewer's repository stays free of marketing content and the site can be published without touching the product's deploy.

1. **Material list** (owner action). Go through the six thumbnails, the benchmark document, the README and the integration notes, and mark what may be public. Anything with a client name, a hostname or an unknown model provenance is excluded.
2. **Repository and pipeline**. New repository from the DSE web template; Cloudflare Pages project on the Contrast3D zone; the forbidden-string check (VS-003) in CI from day one.
3. **Content**. Four pages in English and Spanish, written from the approved material, with the copy rules of VS-005.
4. **Go-live**. DNS record and Pages domain; then naindev.com sets `viewerSiteLive`, DSE and Contrast3D add their links.

## Risks

- A leak through history: the repository starts empty and only approved files are added, so nothing sensitive can be in its history.
- Drift between the two sites: the shared template is copied once; later changes to the DSE generator are not mirrored automatically (a decision for the owners if the sites multiply).
- Unknown model provenance: no model is shown until one with a CC0 or CC-BY credit is chosen; captures from the visual tests are render-only and need a check of the model they show.

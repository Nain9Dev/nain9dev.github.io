# Open questions

Unresolved ambiguities. An open question blocks the requirement it references.

## Published claims awaiting owner evidence

Each claim below is published today in Spanish and, through the catalog, in English. None has supporting evidence in this repository. Resolution options: the owner supplies evidence (claim stays), rewords it, or removes it (add its pattern to `scripts/check-claims.mjs` under a new `CLM-` requirement).

| ID | Question | Location | Blocks | Owner | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| OQ-001 | Is the metric "40 → 6 min" (data synchronization time reduction) verified, and for which engagement? | `src/components/home/ImpactMetrics.astro`, `public/assets/data/impact-metrics.json` | Any copy or design change reusing this metric (DES-009, DES-011) | Aitor | Resolved 2026-09-16: owner has no evidence today; removed (spec 006, CLM-003/CLM-004) |
| OQ-002 | Is "99.99%" uptime on critical systems verified, and over which period and system? | `src/components/home/ImpactMetrics.astro`, `public/assets/data/impact-metrics.json` | Any copy or design change reusing this metric (DES-009, DES-011) | Aitor | Resolved 2026-09-16: owner has no evidence today; removed (spec 006, CLM-003/CLM-004) |
| OQ-003 | Is "10+" developers mentored verified? | `src/components/home/ImpactMetrics.astro`, `public/assets/data/impact-metrics.json` | Any copy or design change reusing this metric (DES-009, DES-011) | Aitor | Resolved 2026-09-16: owner has no evidence today; removed (spec 006, CLM-003/CLM-004) |
| OQ-004 | Is "3" architectures migrated verified? | `src/components/home/ImpactMetrics.astro`, `public/assets/data/impact-metrics.json` | Any copy or design change reusing this metric (DES-009, DES-011) | Aitor | Resolved 2026-09-16: owner has no evidence today; removed (spec 006, CLM-003/CLM-004) |
| OQ-005 | Which open-source project backs the hero badge "Colaborador OSS" (3D geometric validation), and can it be linked publicly? | `src/components/home/Hero.astro` | Any copy or design change reusing this badge (DES-009, DES-011) | Aitor | Resolved 2026-09-16: owner has no evidence today; removed (spec 006, CLM-003/CLM-004) |
| OQ-006 | Is the "Zero Downtime" badge on the lead-magnet thank-you page a verified claim? The same phrase also appears in the 99.99% card description. | `src/pages/recursos/gracias.astro`, `src/components/home/ImpactMetrics.astro`, `public/assets/data/impact-metrics.json` | Any copy or design change reusing this badge (DES-009, DES-011) | Aitor | Resolved 2026-09-16: owner has no evidence today; removed (spec 006, CLM-003/CLM-004) |

## Process

| ID | Question | Location | Blocks | Owner | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| OQ-007 | `AGENTS.md` and the local agent instruction files are git-ignored (`.gitignore`, `SECURITY_POLICY.md` section 2.2), but the spec template checklist refers to `AGENTS.md` as the canonical constitution. Should the constitution stay local-only, or should a public, non-sensitive version be committed? | `.gitignore`, `specs/000-template-feature/checklist.md` | ADR-0001 approval | Aitor | Resolved 2026-09-16: stays local-only and git-ignored |

## Content wording

| ID | Question | Location | Blocks | Owner | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| OQ-008 | Service pages and blog posts state availability outcomes such as "Disponibilidad 99.99%" (`backend-critico-logistica.mdx`) and "Zero Downtime" as benefits. Are they design goals or achieved results, and do they need rewording? | `src/content/servicios/*.mdx`, `src/content/blog/*.mdx` | Content integrity review | Aitor | Resolved 2026-09-16: design goals, not achieved results; reworded without guaranteed figures (spec 009, COPY-005/COPY-006) |
| OQ-009 | Privacy policy section 7 (CRM Backups app, crm.naindev.com) lists the owner's personal address as the specific data contact. Should it become `contact@naindev.com`? Check first whether the Google OAuth consent screen or app verification references the current address. | `src/pages/privacidad.astro` | MAIL-001 scope for section 7 | Aitor | Resolved 2026-09-16: kept; Google app verification requires the current address. Section 7 is outside MAIL-001 |
| OQ-010 | Two blog posts present client results with figures: `arquitectura-agentes-ia-csharp.mdx` ("Resultados y Métricas en Producción": timeouts "del 8% al 0.01%", "en clientes reales") and `validacion-3d-backend-csharp.mdx` ("Resultados del Mundo Real": "40 minutos" to "menos de 6 minutos", "Resiliencia al 100%", "un cliente del sector industrial"). Are they verified, and should they stay, be reworded or be removed? | `src/content/blog/arquitectura-agentes-ia-csharp.mdx`, `src/content/blog/validacion-3d-backend-csharp.mdx` | Content integrity review | Aitor | Open |
| OQ-011 | The checklist page shows a testimonial attributed to a "CT0 de una Startup SaaS B2B" and promises cutting API cost "hasta un 80%". Are they verified, and should they stay, be reworded or be removed? The "+200 Arquitectos" heading was removed with the form in spec 025. | `src/pages/recursos/checklist-ia.astro` | Content integrity review | Aitor | Open |
| OQ-012 | The privacy policy still lists MailerLite and lead-magnet subscription forms as data processing, although spec 025 removed both forms. Should those clauses be removed or kept for future use? | `src/pages/privacidad.astro` | Legal accuracy of the privacy policy | Aitor | Open |

## Visual polish (spec 045)

| ID | Question | Location | Blocks | Owner | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| OQ-013 | The designer's prototype in `design/home-redesign` implements the paper brandbook (Urbanist, cobalt, paper, solid shadows). Is it still the planned delivery to port? If yes, the visual polish becomes a port (direction A) instead of a dark-surface redesign (direction B). | `design/home-redesign/`, `specs/045-visual-polish/spec.md` | Direction choice (T00b) | Aitor | Resolved 2026-10-21: direction B chosen; the prototype is not ported by spec 045 (ADR-0012) |
| OQ-014 | The phase 2 brief names a "footer with the four contacts", but the footer has no contact links today and the spec freezes content and links. Which four channels, and is a public `wa.me` link approved (B-014 keeps the number out of the repository)? | `src/components/Footer.astro` | VP-010, PR 4 | Aitor | Resolved 2026-10-21: PR 4 restyles the footer only; new contact channels need their own spec |
| OQ-015 | Replacing Outfit with Urbanist needs the full variable font (OFL) subset to weights 300–800; the designer's copy covers 300–600 only. Who provides the file, and where does the licence text live? | `src/assets/fonts/`, `specs/028-font-subsetting` | VP-015, PR 1 | Aitor | Resolved 2026-10-21: the owner authorized downloading `Urbanist[wght].ttf` and `OFL.txt` from github.com/google/fonts (ofl/urbanist); the subset is generated with `pyftsubset` and the licence file ships next to the font |
| OQ-016 | The local `npm run build` produced no `dist/en/`, so the English pages could not be captured or audited. Is the localized build expected locally, or only in CI? | `scripts/build-locales.mjs` | VP-012 on `/en/` | Aitor | Resolved 2026-10-21: the catalog update had added five live-demo segments without translation; the reviewed entries were added to `src/i18n/en-US.json` and the bilingual build passes locally |
| OQ-017 | Everything 3D in this portfolio (Nain3D, ParametriCAD, the products band, the 3D selected-work cases) is planned to move out: link straight to DSE and/or Contrast Viewer, and possibly relocate the Nain3D and ParametriCAD showcases into the DSE or the Viewer portfolio. Which of the two is the better home, and when does it start? Both already have a public commercial site (DSE: `datumstatutum.com`, answering 200 on 2026-10-30; Viewer: `viewer.contrast3dhub.com`, answering 200 on 2026-10-30). Contrast Hub stays 100% private. | `ProductsBand.astro`, `SelectedWork.astro`, `public/assets/data/projects.json` | DF-029 follow-up, B-022 | Aitor | Open (recorded 2026-10-30; needs a study of which site fits each project) |
| OQ-018 | B-022 expects the Viewer site on `viewer.contrast3d.com`, which does not answer. The live commercial site is `viewer.contrast3dhub.com`. May the products band link it, given the rule that no page of this site links a Contrast Hub host? | `ProductsBand.astro` (`viewerSiteLive`), `docs/41-blockers.md` | NPR-005 to NPR-007 | Aitor | Open (recorded 2026-10-30) |

Note: the impact metrics exist twice, as static markup in `ImpactMetrics.astro` and as JSON loaded by `public/assets/js/impact-metrics.js`; any resolution must update both.

Out of scope for this list: `src/data/testimonials.json` and `ProofStrip.astro` were not audited for this document. Case-study metrics formerly in `src/content/casos/` are moot: the case studies were removed from the site by spec 007 (2026-09-16).

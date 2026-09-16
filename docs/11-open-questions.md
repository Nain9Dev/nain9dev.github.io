# Open questions

Unresolved ambiguities. An open question blocks the requirement it references.

## Published claims awaiting owner evidence

Each claim below is published today in Spanish and, through the catalog, in English. None has supporting evidence in this repository. Resolution options: the owner supplies evidence (claim stays), rewords it, or removes it (add its pattern to `scripts/check-claims.mjs` under a new `CLM-` requirement).

| ID | Question | Location | Blocks | Owner | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| OQ-001 | Is the metric "40 → 6 min" (data synchronization time reduction) verified, and for which engagement? | `src/components/home/ImpactMetrics.astro`, `public/assets/data/impact-metrics.json` | Any copy or design change reusing this metric (DES-009, DES-011) | Aitor | Open |
| OQ-002 | Is "99.99%" uptime on critical systems verified, and over which period and system? | `src/components/home/ImpactMetrics.astro`, `public/assets/data/impact-metrics.json` | Any copy or design change reusing this metric (DES-009, DES-011) | Aitor | Open |
| OQ-003 | Is "10+" developers mentored verified? | `src/components/home/ImpactMetrics.astro`, `public/assets/data/impact-metrics.json` | Any copy or design change reusing this metric (DES-009, DES-011) | Aitor | Open |
| OQ-004 | Is "3" architectures migrated verified? | `src/components/home/ImpactMetrics.astro`, `public/assets/data/impact-metrics.json` | Any copy or design change reusing this metric (DES-009, DES-011) | Aitor | Open |
| OQ-005 | Which open-source project backs the hero badge "Colaborador OSS" (3D geometric validation), and can it be linked publicly? | `src/components/home/Hero.astro` | Any copy or design change reusing this badge (DES-009, DES-011) | Aitor | Open |
| OQ-006 | Is the "Zero Downtime" badge on the lead-magnet thank-you page a verified claim? The same phrase also appears in the 99.99% card description. | `src/pages/recursos/gracias.astro`, `src/components/home/ImpactMetrics.astro`, `public/assets/data/impact-metrics.json` | Any copy or design change reusing this badge (DES-009, DES-011) | Aitor | Open |

## Process

| ID | Question | Location | Blocks | Owner | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| OQ-007 | `AGENTS.md` and the local agent instruction files are git-ignored (`.gitignore`, `SECURITY_POLICY.md` section 2.2), but the spec template checklist refers to `AGENTS.md` as the canonical constitution. Should the constitution stay local-only, or should a public, non-sensitive version be committed? | `.gitignore`, `specs/000-template-feature/checklist.md` | ADR-0001 approval | Aitor | Open |

Note: the impact metrics exist twice, as static markup in `ImpactMetrics.astro` and as JSON loaded by `public/assets/js/impact-metrics.js`; any resolution must update both.

Out of scope for this list: case-study metrics in `src/content/casos/`, `src/data/testimonials.json` and `ProofStrip.astro` were not audited for this document.

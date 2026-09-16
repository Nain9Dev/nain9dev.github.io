# Remove Unverified Metrics

## Scope

On 2026-09-16 the owner stated that none of the home page impact metrics can be
demonstrated today and asked to remove them until evidence exists. The owner
also asked to remove the "Colaborador OSS" hero badge. Resolves open questions
OQ-001 to OQ-006.

## Requirements

- CLM-003: When the site is built, the system shall not publish the impact
  metrics "40 → 6 min", "99.99% uptime on critical systems", "10+ developers
  mentored" or "3 architectures migrated" in any locale.
- CLM-004: When the site is built, the system shall not publish the hero badge
  "Colaborador OSS" / "OSS Contributor" or the thank-you page badge
  "Zero Downtime" in any locale.
- CLM-005: When the home page loads, the free checklist call to action formerly
  inside the metrics section shall remain visible and linked.
- CLM-006: When a blocked claim returns to sources, runtime data or build output,
  `npm run check` shall fail and name the file (extends CLM-002).

## Affected content

| File | Change |
| :--- | :--- |
| `src/components/home/ImpactMetrics.astro` | Remove heading and metric cards; keep checklist CTA |
| `public/assets/data/impact-metrics.json` | Empty list, so the runtime renderer keeps the static markup |
| `src/components/home/Hero.astro` | Remove "Colaborador OSS" badge |
| `src/pages/recursos/gracias.astro` | Remove "Zero Downtime" badge and its now empty badge row |
| `src/i18n/en-US.json` | Remove catalog entries no longer used by any source |

## Non-goals

- Service pages that describe availability or zero-downtime deployments as
  design goals (`src/content/servicios/*`, blog posts). Tracked as OQ-008.
- Re-adding metrics. A future metric needs evidence and a new requirement.

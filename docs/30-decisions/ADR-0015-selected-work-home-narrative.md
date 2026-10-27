# ADR-0015: Selected work before the catalog; the home as a narrative, not an inventory

Status: Proposed
Date: 2026-10-27

## Context

After specs 045 to 048 the site has a coherent visual system (deep-blue precision, brand palette, Urbanist display, one card system, two themes). The structure of the home did not change in that work by decision of the owner (2026-10-22, "no home section restructuring"), which kept the blast radius of the visual pull requests small. The home still has fourteen sections and shows twenty-two projects as equal cards; the interactive terminal fills a screen before the services; three generic proof sentences and a lead-magnet box sit between the offer and the work.

Reference portfolios of senior engineers and consultants that convert a technical buyer share one structure: an offer in the first screen, then three or four pieces of work told as problem, approach and result with a large visual, then how the person works, then contact. Inventory views (every project, every badge) come later or on another page. Editorial sources reviewed on 2026-10-27 agree on fewer projects with sharper stories, trust elements near the call to action and a short, fast page; none of them measures conversion, so this is a design judgement, not a proven effect.

The owner chose, on 2026-10-27, to prioritize a selected-work section over a new hero visual, a plain trim, or a strip of verifiable receipts, and to reorder and compact the rest of the home.

## Decision

- The home tells a story in ten sections: hero, selected work (four featured projects with a public demo, a capture and a three-line story), services with the stack as a strip, live demos, a compact catalog, the open ecosystem, method, about (with the terminal folded inside) next to the partnership, contact.
- The 2026-10-22 restructuring freeze is lifted for this spec only. The copy freeze stays: no existing sentence is rewritten; sentences are folded, moved or, for the checklist box, removed from the home while they stay on their own page.
- The only new copy is the story lines (drafted from the published `summary` and `proof` fields, no figures, approved by the owner in the pull request) and four labels.
- No dedicated case pages yet; routes, metadata and structured data stay as they are.

## Consequences

- The first scroll after the hero shows work, not a terminal; the home is roughly half as long on phones.
- Seven guard tests encode the old order and must change in the same pull request; the new guard encodes the new order.
- The LCP candidate may move from the hero text to the first capture; it is measured on every pull request (SW-008).
- The terminal keeps working but is discovered by fewer visitors; the owner accepted this trade.
- A later spec can add case pages under `/trabajo/<id>/` reusing the `story` data without touching the home again.

## Alternatives considered

- **Add the section only, change nothing else**: the home stays fourteen sections long with the terminal before the services; the new section competes with the demo strip right below it.
- **A new hero visual first**: more spectacle in the first screen, but no story to retain the visitor after it; kept as a candidate.
- **Verifiable receipts strip (CI, Lighthouse, axe of the site itself)**: honest and on brand, but it proves craft, not outcomes for a client; kept as a candidate after the selected work exists.
- **Case pages now**: new routes, more copy to approve, and the English build to extend; deferred until the owner wants long-form write-ups.

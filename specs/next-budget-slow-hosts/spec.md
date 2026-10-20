# Budget gate on slow CI hosts

Status: In progress

## Objective

Owner decision of 2026-10-20: stop deploys and pull requests from failing on the Chrome-internal long task when the CI host is slow (ADR-0011, Proposed; follows specs 035 and 037).

## Requirements

- LHCI-004: When every attempt of the budget measurement ran on a host with `benchmarkIndex` below 3300, the gate shall treat the outcome as inconclusive if every broken limit in every attempt is `tbt` or `performance`.
- LHCI-005: When the outcome is inconclusive, the gate shall print a `::warning::` annotation with the host indexes, say so in the log and exit successfully.
- LHCI-006: A broken `lcp`, `cls` or `bytes` limit, or any attempt on a host at 3300 or above, shall keep failing the gate.

## Out of scope

- The limits, the number of runs and attempts, and the median (ADR-0005, ADR-0006).

## Session state

- Last updated: 2026-10-20
- Done: ADR-0011 drafted (Proposed), tests first, helper and runner changed.
- Next: `npm run check`, pull request, owner approves ADR-0011.
- Blocked: owner moves ADR-0011 to Approved.

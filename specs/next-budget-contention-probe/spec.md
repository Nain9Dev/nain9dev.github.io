# Budget gate: record CPU contention

Status: Approved (owner approved stage 1 on 2026-10-27)

## Objective

Collect evidence about why the Lighthouse budget gate fails on contended GitHub runners, without changing what passes or fails. See ADR-0011.

## Requirements

- BUD-001: Before each measurement attempt, the gate shall run a CPU probe (a fixed task in 1 thread and in 4 worker threads) and compute `parallelRatio` (throughput with 4 threads divided by 4 times the throughput with 1 thread).
- BUD-002: Each attempt's log line and the report in `.astro/budget/` shall include the host benchmark index, the slowdown used and `parallelRatio`.
- BUD-003: The probe shall take no more than 3 seconds and shall not change the limits, the number of runs, the number of attempts, the median or the pass rule.
- BUD-004: If the probe fails, the gate shall log the failure and continue as before.
- BUD-005: The deploy workflow log shall make the values searchable (one line per attempt, fixed prefix `budget-host`).

## Out of scope

- Any rule that uses `parallelRatio` (stage 2, needs data and approval), changing limits, changing the site.

## Session state

- Last updated: 2026-10-20
- Done: ADR-0011 (`Proposed`), this spec.
- Next: owner approval; then tests for the probe helper (`scripts/lib/cpu-probe.mjs`), wiring in `scripts/check-budget.mjs`, a note in the workflow docs.
- Blocked: owner approval of stage 1.

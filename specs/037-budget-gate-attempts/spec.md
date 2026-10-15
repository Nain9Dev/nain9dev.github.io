# Specification: Budget gate attempts

Status: Implemented

## Objective

The Lighthouse budget gate (spec 032, ADR-0005) failed 3 of the 8 most recent deploys of `main` without a relevant code change (runs 38435151219, 38436371274, 38761927993; the rerun of the last one failed too, on a different page). Every failure came from TBT, while the same build scored TBT 0 on most samples.

## Diagnosis (2026-10-15)

Facts from the deploy logs (`gh run view <id> --log`):

- A bad sample always shows one long task attributed to `BaseLayout.astro_astro_type_script_index_0_lang.*.js` at a constant simulated time (about 1.22 s) plus a 53–83 ms task in the document; a good sample shows TBT 0. There is no middle ground, so the cause is one discrete event, not slow code.
- The task is a fixed real cost: its simulated duration divided by the CPU slowdown is 66–72 ms on every host (284 ms at 4x, 322 ms at 4.5x, 384 ms at 5.1x, 429 ms at 6.1x, 598 ms at 8.9x), and the main-thread breakdown puts most of it in "Other" (373 ms of 4x), not in script evaluation (54–92 ms) or layout (about 80 ms).
- The share of bad samples depends on the run, not on the code: 0/5 to 5/5 per page for the same build (for example run 38436371274, `/en/`: 5 of 5). A median of five cannot absorb a state that affects most samples of a process.
- On a local desktop the same build shows no task longer than 12 ms after first contentful paint in 12 `/en/` loads and none attributed to the entry bundle (`/` shows a 60–70 ms Plausible `script.js` evaluation in 2 of 12 loads, which includes a forced layout of the document). All deferred entry-bundle work already runs one module per idle slot (spec 035).
- A local `npm run check:budget` (benchmarkIndex 2871, 6.4x) reproduced the pattern on `/` only: TBT 263, 168, 155, 0 and 392 ms (median 168 ms, pass), with the long task attributed to Plausible's `script.js` (and once to the entry bundle) and a main-thread breakdown dominated by "Style & Layout" (583–1,144 ms simulated). So the discrete event is a document-wide layout flushed inside whichever deferred script runs when layout is dirty; the attributed URL is incidental. `/en/` and `/servicios/` scored TBT 0 in all ten runs.
- Spec 035 T04 traced the same pattern to Chrome-internal page-content extraction (`AIPageContentAgent::ContentBuilder::Build`), which forces a document-wide layout and is outside the site's control.

Conclusion: the budget is not broken by the site; the gate measures a rare browser-internal event that correlates within one Chrome process. The remedy is in the measurement, not in the limits.

## Functional requirements (EARS)

- **LHCI-002**: When a budget measurement breaks a limit, the gate shall repeat the whole measurement, with a new Chrome process and a new host calibration, up to three attempts in total, and shall fail only when every attempt breaks a limit. Limits, runs per page and the median statistic are unchanged.
- **LHCI-003**: When the gate finishes, it shall print the Chrome version and the outcome of each attempt, so intermittent failures stay traceable.

## Edge cases and error handling

- A real regression breaks the limits in every attempt and still fails the gate; the cost is at most two extra measurements (about one minute each) on failing builds only.
- A regression that breaks the limits in fewer than one of three attempts can pass. That trade-off is recorded in ADR-0006 (Proposed).

## Out of scope

- Changing any limit (ADR-0005), the number of runs or the page set.
- Disabling Chrome features in the runner: no flag could be verified for the Chrome used in CI.

## Acceptance criteria

- Tests for LHCI-002 and LHCI-003 fail before the change and pass after it.
- `npm run check` passes.

## Session state

- Last updated: 2026-10-15, implementation session
- Done: diagnosis; `settleAttempts` and `ATTEMPTS` in `scripts/lib/performance-budget.mjs`; runner restructured to one Chrome per attempt; tests; ADR-0006 (Proposed); requirements, traceability, changelog.
- Next: owner reviews ADR-0006; after approval, rerun the deploy of 28f6551. Follow-up (not done): find why the home page has dirty layout when deferred scripts run (a forced document layout of 60–70 ms real); fixing it would remove the cause instead of retrying around it.
- Blocked: —

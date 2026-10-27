# ADR-0011: Measure CI CPU contention before changing the performance gate

Status: Approved
Date: 2026-10-20
Approved-By: Owner

## Context

The deploy gate (ADR-0005, ADR-0006) fails a build when the median TBT of five Lighthouse runs exceeds 200 ms in every one of three attempts. Between 2026-10-13 and 2026-10-20 it blocked a growing share of deploys with no relevant change (4 of the last 8 on 2026-10-18; again on 2026-10-20), always with the same signature: TBT of about 235-390 ms on `/`, `/en/` or `/servicios/`, one long task that is a full-document layout, and the same entry-bundle hash as passing builds.

Diagnosis on 2026-10-18 (specs 035 follow-up, session report): the failing runs came from hosts whose calibration index was about 2000-2480; passing runs from 3350-4131. The calibration (`TARGET_BENCHMARK_INDEX`, `cpuSlowdownFor`) measures one thread. With the process limited to 2 cores locally and a fixed 5.5x slowdown, TBT reproduced (median about 250 ms; 0 ms with 16 cores). Under Lighthouse's simulated throttling the observed layout time is multiplied by the slowdown, so a runner with contended cores turns a 25 ms layout into 80-430 ms. Site-side changes did not help: deferring Plausible only moved the task, removing the static project index did not change the median, and `content-visibility: auto` is already applied to every home section.

## Decision

Change the gate in two stages and only the first now:

1. **Observe (no semantic change).** Before each attempt, run a short multi-thread probe (a fixed CPU-bound task run in 1 and in 4 worker threads) and record `parallelRatio`, next to the host index, in the attempt log line and in `.astro/budget/`. Limits, runs, attempts, the median and the pass rule stay as they are.
2. **Act, only with data.** After at least ten deploys of recorded measurements, propose a rule in an amendment to this ADR, for example: an attempt whose `parallelRatio` is below a threshold taken from the data is marked inconclusive and repeated on a new Chrome process instead of counting as a failure, and a build whose every attempt is inconclusive fails with a clear message (retry the workflow) instead of a performance failure. The owner approves the rule before it ships.

## Consequences

- No regression can slip through in stage 1: nothing about pass or fail changes.
- A few seconds of extra CI time per attempt.
- Stage 2 will be based on measured hosts instead of a guess, and can be validated by replaying the logged values against past deploys.
- Until stage 2, a false failure still needs a manual rerun of the workflow.

## Alternatives considered

- **Raise the TBT limit or the run count**: hides real regressions on every build or does not fix a state that affects most runs of one process (as ADR-0006 already found).
- **Skip attempts on low-index hosts**: the single-thread index does not predict the failures reliably (a 2360 host passed), and it can let a real regression through if all attempts land on slow hosts.
- **Disable Chrome page-content extraction**: no flag verified for the CI Chrome; the 2026-10-18 traces do not show it.
- **Change the site (defer analytics, more `content-visibility`)**: measured on 2026-10-18 and no effect on the median.
- **Run the budget on a self-hosted runner with fixed CPU**: possible later (the owner already runs self-hosted runners), but it moves the build off GitHub-hosted runners and needs its own decision.

## Open decisions for the owner

- Approve stage 1 (observation only).
- Whether a self-hosted runner for the budget job is acceptable as a later alternative.

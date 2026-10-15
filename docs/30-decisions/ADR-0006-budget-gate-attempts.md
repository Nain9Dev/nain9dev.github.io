# ADR-0006: Repeat the budget measurement before failing a deploy

Status: Approved (owner, 2026-10-15)
Date: 2026-10-15

## Context

ADR-0005 fails a deploy when the median of five Lighthouse runs breaks a limit. Between 2026-10-13 and 2026-10-15, 3 of 8 deploys of `main` failed on TBT without a relevant change (spec 037). Bad samples are all-or-nothing: one long task of 66–72 ms real time (mostly "Other", not script or layout) that appears in 0 to 5 of five runs of the same build and does not appear locally. The median of five cannot absorb a state that affects most runs of one Chrome process.

## Decision

- Keep every limit, the five runs per page and the median (ADR-0005 unchanged).
- Run the whole measurement up to three times, each with a new Chrome process and a new host calibration, and fail only when all three attempts break a limit. Log the Chrome version and each attempt's outcome.

## Consequences

- A flaky false failure needs three consecutive bad attempts; real regressions still fail every attempt.
- A regression that appears in fewer than one of three attempts can pass; field Web Vitals (ADR-0004) remain the check for those.
- Failing builds cost up to two extra minutes of CI.

## Alternatives considered

- **More runs or a different statistic**: bad samples cluster per process, so neither fixes a process where most runs are bad; a lower quartile or the minimum would loosen the limit silently.
- **Raising the TBT limit**: hides real regressions on every build.
- **Disabling Chrome page-content extraction in the runner**: no flag verified for the CI Chrome; revisit if failures persist.
- **Rerunning the workflow by hand**: what happened so far; costs attention and a deploy each time.

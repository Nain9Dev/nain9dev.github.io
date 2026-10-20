# ADR-0011: Treat TBT-only failures on slow CI hosts as inconclusive

Status: Proposed
Date: 2026-10-20

## Context

ADR-0006 repeats the Lighthouse budget measurement up to three times before failing a deploy. On 2026-10-20 that was not enough: the deploys of `main` for the pull requests that fixed the blog lead forms and restyled secondary pages failed, and so did four runs of an open pull request, always on `/`, `/en/` or `/servicios/` with the same signature (spec 035, spec 037): one long task of about 1.2 s simulated time attributed to the entry bundle, a few hundred milliseconds, present or absent in whole Chrome processes.

The runs execute on GitHub-hosted `ubuntu-latest` machines, so the host varies from run to run. The host calibration (`benchmarkIndex`) of the failing attempts was 2173 to 3086; the passing runs measured 3352 or more (and 1028 in one case where the slowdown was low). The same build passes on a fast host and fails on a slow one. Spec 037 traced the event to Chrome's internal page-content extraction, which forces a document-wide layout outside the site's control. A site-side mitigation (content-visibility on blocks the sections rule did not match) did not remove the failures in CI.

Consequence: deploys of unrelated changes are blocked, production lags behind `main`, and every pull request needs manual reruns.

## Decision

- Keep every limit, the five runs per page, the median and the three attempts (ADR-0005, ADR-0006 unchanged).
- When all attempts failed, ran on hosts with `benchmarkIndex` below 3300 and broke only TBT-derived limits (`tbt`, `performance`), report the result as **inconclusive**: print a `::warning::` annotation with the host indexes and exit successfully.
- LCP, CLS and total byte weight stay hard failures on every host. A failure on any attempt whose host is at 3300 or above stays a failure.

## Consequences

- Deploys stop depending on which GitHub host is drawn.
- A real TBT regression that lands only while all three attempts hit slow hosts passes with a visible warning instead of failing; local `npm run check:budget` and field Web Vitals (ADR-0004) remain the checks for it.
- The threshold 3300 comes from six runs of evidence and should be revisited if GitHub changes its runners.

## Alternatives considered

- **Rerunning by hand**: what happened; costs attention and a deploy each time.
- **Raising the TBT limit**: hides real regressions on every host.
- **A fourth or fifth attempt**: failures correlate with the host, so more attempts on the same kind of host do not help and cost minutes.
- **Disabling Chrome page-content extraction in the runner**: no flag verified for the CI Chrome (ADR-0006); revisit.
- **Self-hosted fast runner**: costs maintenance and breaks the zero-cost rule for this site.

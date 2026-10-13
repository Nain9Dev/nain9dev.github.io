# ADR-0005: Lighthouse performance budget in CI

Status: Proposed
Date: 2026-10-13

## Context

The structural guards from specs 020 to 031 prevent known regressions (duplicate fonts, render-blocking CSS, eager modules) but not new ones such as a heavy image or a slow script. The owner asked on 2026-10-13 for a budget that fails the build, with "strict" thresholds.

## Decision

- Add `lighthouse` (13.5.0) and `chrome-launcher` (1.2.2, the version Lighthouse resolves) as development dependencies pinned exactly, and a small runner `scripts/check-budget.mjs` (`npm run check:budget`).
- The runner serves the built `dist/` on loopback with gzip (as GitHub Pages and Cloudflare do), runs Lighthouse five times with its default mobile emulation on the Spanish home, the English home and the services hub, and takes the median of each metric (`scripts/lib/performance-budget.mjs`).
- Calibrate the CPU slowdown to the host, as Lighthouse documents (docs/throttling.md): a warm-up run reads the host benchmarkIndex and the slowdown is benchmarkIndex / 450, clamped to 1x–10x, so every machine emulates the same mid-tier mobile instead of applying a fixed 4x. The first CI run with a fixed 4x on a GitHub runner failed TBT on every page (243–323 ms) while the same build passed locally.
- Fail when a median breaks: performance score below 0.95, LCP above 2.5 s, TBT above 200 ms, CLS above 0.1, or total transfer above 250 KiB.
- Run it in `deploy.yml` after `npm run check` and before the artifact upload, and in `static-site-check.yml` for pull requests. Reports stay on the runner (`.astro/budget/`); nothing is uploaded.

## Consequences

- A deploy that breaks the budget does not publish.
- GitHub runners vary in speed; medians of five runs and a 0.95 floor (local builds score 100) leave margin for noise. If false failures appear, adjust the thresholds through this ADR.
- CI time grows by about a minute.

## Alternatives considered

- **Lighthouse CI (`@lhci/cli` 0.15.1)**: tried first; its dependency tree added more than fifteen high-severity advisories (`puppeteer-core`, `proxy-agent`, `tmp`, `js-yaml` and others) on 2026-10-13, while `lighthouse` 13.5.0 alone audits clean. Rejected for supply-chain risk.
- **Report only**: easy to ignore.
- **Lighthouse against production after deploy**: measures Cloudflare and network, but runs after publishing, so it cannot block.

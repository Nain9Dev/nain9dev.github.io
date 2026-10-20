// Performance budget for built pages (spec 032, ADR-0005). Pure helpers, used by check-budget.mjs and tests.

// Five runs: GitHub runners show isolated long tasks; the median of five absorbs up to two outliers.
export const RUNS = 5;
export const PAGES =['/', '/en/', '/servicios/'];

// Thresholds apply to the median of the runs for each page, measured with Lighthouse's default mobile emulation.
export const BUDGET = {
  performance: { min: 0.95, read: (lhr) => lhr.categories.performance.score },
  lcp: { max: 2500, read: (lhr) => lhr.audits['largest-contentful-paint'].numericValue },
  tbt: { max: 200, read: (lhr) => lhr.audits['total-blocking-time'].numericValue },
  cls: { max: 0.1, read: (lhr) => lhr.audits['cumulative-layout-shift'].numericValue },
  bytes: { max: 256000, read: (lhr) => lhr.audits['total-byte-weight'].numericValue }
};

// Lighthouse's default 4x CPU slowdown assumes a high-end desktop (benchmarkIndex 1500–2000) and lands in the
// mid-tier mobile bracket (docs/throttling.md). Calibrating against the host's benchmarkIndex keeps that target on
// any machine: the slowdown is the host index divided by the target index, clamped to Lighthouse's documented range.
export const TARGET_BENCHMARK_INDEX = 450;

export function cpuSlowdownFor(benchmarkIndex) {
  const multiplier = benchmarkIndex / TARGET_BENCHMARK_INDEX;
  return Math.round(Math.min(10, Math.max(1, multiplier)) * 10) / 10;
}

export function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

// A rare browser-internal long task hits most runs of one Chrome process (spec 037), so a failing measurement is
// repeated in a new process; the gate fails only when every attempt breaks a limit (ADR-0006).
export const ATTEMPTS = 3;

// Hosts below this benchmarkIndex show the Chrome-internal long task in most runs, whatever the build (spec 035,
// spec 037, ADR-0011): GitHub-hosted VMs measured 2100-3100 when the gate failed and 3350 or more when it passed.
export const SLOW_HOST_INDEX = 3300;

// Only the metrics derived from main-thread time are affected by that long task.
export const TIME_ONLY_METRICS = ['tbt', 'performance'];

// attemptRows: the evaluate() rows of each attempt made so far. hostIndexes: the benchmarkIndex of each attempt's host.
// Reports the first clean attempt, or the least broken one. When every attempt ran on a slow host and broke only
// time-based limits, the outcome is inconclusive (ADR-0011): LCP, CLS and size limits stay hard failures.
export function settleAttempts(attemptRows, hostIndexes = []) {
  const outcomes = attemptRows.map((rows, index) => ({ attempt: index + 1, failures: rows.filter((row) => row.failed).length }));
  const best = outcomes.reduce((a, b) => (b.failures < a.failures ? b : a));
  const passed = best.failures === 0;
  const inconclusive = !passed
    && hostIndexes.length === attemptRows.length
    && hostIndexes.every((index) => index < SLOW_HOST_INDEX)
    && attemptRows.every((rows) => rows.filter((row) => row.failed).every((row) => TIME_ONLY_METRICS.includes(row.metric)));
  return { passed, inconclusive, rows: attemptRows[best.attempt - 1], outcomes };
}

// Returns one row per page and metric, with the median and whether it breaks the budget.
export function evaluate(resultsByPage) {
  const rows = [];
  for (const [page, reports] of Object.entries(resultsByPage)) {
    for (const [metric, rule] of Object.entries(BUDGET)) {
      const value = median(reports.map(rule.read));
      const failed = rule.min !== undefined ? value < rule.min : value > rule.max;
      rows.push({ page, metric, value, limit: rule.min ?? rule.max, failed });
    }
  }
  return rows;
}

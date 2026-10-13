// Performance budget for built pages (spec 032, ADR-0005). Pure helpers, used by check-budget.mjs and tests.

export const RUNS = 3;
export const PAGES = ['/', '/en/', '/servicios/'];

// Thresholds apply to the median of the runs for each page, measured with Lighthouse's default mobile emulation.
export const BUDGET = {
  performance: { min: 0.95, read: (lhr) => lhr.categories.performance.score },
  lcp: { max: 2500, read: (lhr) => lhr.audits['largest-contentful-paint'].numericValue },
  tbt: { max: 200, read: (lhr) => lhr.audits['total-blocking-time'].numericValue },
  cls: { max: 0.1, read: (lhr) => lhr.audits['cumulative-layout-shift'].numericValue },
  bytes: { max: 256000, read: (lhr) => lhr.audits['total-byte-weight'].numericValue }
};

export function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
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

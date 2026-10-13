// Field Web Vitals for sampled page views, sent to Plausible as one event (spec 032, ADR-0004).
import { onCLS, onINP, onLCP } from 'web-vitals';

const bucket = (value, size, digits = 0) => {
  const start = Math.floor(value / size) * size;
  return `${start.toFixed(digits)}-${(start + size).toFixed(digits)}`;
};

// Plausible properties are strings: ratings plus coarse buckets keep the breakdown readable.
export function buildVitalsProps(metrics, viewportWidth) {
  const { LCP, INP, CLS } = metrics;
  return {
    lcp: LCP?.rating ?? 'none',
    inp: INP?.rating ?? 'none',
    cls: CLS?.rating ?? 'none',
    lcp_ms: LCP ? bucket(LCP.value, 250) : 'none',
    inp_ms: INP ? bucket(INP.value, 50) : 'none',
    cls_value: CLS ? bucket(CLS.value, 0.05, 2) : 'none',
    device: viewportWidth < 768 ? 'mobile' : 'desktop'
  };
}

export function createReporter({ send, width }) {
  const metrics = {};
  let sent = false;
  return {
    record(metric) {
      metrics[metric.name] = metric;
    },
    flush() {
      if (sent) return;
      sent = true;
      // interactive: false keeps this event out of bounce rate and visit duration.
      send('Web Vitals', { props: buildVitalsProps(metrics, width()), interactive: false });
    }
  };
}

export function startWebVitalsReport() {
  const reporter = createReporter({
    send: (name, options) => window.plausible && window.plausible(name, options),
    width: () => window.innerWidth
  });
  onLCP(reporter.record);
  onINP(reporter.record);
  onCLS(reporter.record);
  // Registered after web-vitals' own listeners, so the final values are recorded before the flush.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') reporter.flush();
  });
}

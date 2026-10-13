// Share of page views that report field Web Vitals to Plausible (ADR-0004).
export const SAMPLE_RATE = 0.25;

export function isSampled(random = Math.random) {
  return random() < SAMPLE_RATE;
}

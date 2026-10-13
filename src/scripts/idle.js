// Runs work after the browser has painted and is idle; falls back to a short timer.
export function runWhenIdle(callback, timeout = 1500) {
  if (typeof window.requestIdleCallback === 'function') {
    const handle = window.requestIdleCallback(callback, { timeout });
    return () => window.cancelIdleCallback(handle);
  }
  const handle = setTimeout(callback, 200);
  return () => clearTimeout(handle);
}

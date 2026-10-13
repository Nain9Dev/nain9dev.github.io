// Runs work after the browser has painted and is idle; falls back to a short timer.
export function runWhenIdle(callback, timeout = 1500) {
  if (typeof window.requestIdleCallback === 'function') {
    const handle = window.requestIdleCallback(callback, { timeout });
    return () => window.cancelIdleCallback(handle);
  }
  const handle = setTimeout(callback, 200);
  return () => clearTimeout(handle);
}

// Runs one task per idle slot, yielding to the main thread in between, so deferred work never
// forms a single long task even when a slow device forces the idle timeout (PERF-017).
export function runQueueWhenIdle(tasks, timeout = 1500) {
  const queue = [...tasks];
  let cancel = () => {};
  const next = () => {
    if (!queue.length) return;
    cancel = runWhenIdle(() => {
      queue.shift()();
      next();
    }, timeout);
  };
  next();
  return () => {
    queue.length = 0;
    cancel();
  };
}

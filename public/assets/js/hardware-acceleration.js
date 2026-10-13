let cachedResult = null;

export function resetHardwareAccelerationCache() {
  cachedResult = null;
}

function updatePerformanceClasses(isHighPerformance) {
  if (typeof document !== 'undefined' && document.documentElement) {
    if (isHighPerformance) {
      document.documentElement.classList.remove('low-performance');
      document.documentElement.classList.add('high-performance');
    } else {
      document.documentElement.classList.remove('high-performance');
      document.documentElement.classList.add('low-performance');
    }
  }
}

export function hasHardwareAcceleration() {
  if (cachedResult !== null) {
    return cachedResult;
  }

  if (typeof window === 'undefined') {
    cachedResult = false;
    return false;
  }

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cachedResult = false;
    updatePerformanceClasses(false);
    return false;
  }

  if (navigator.connection && navigator.connection.saveData) {
    cachedResult = false;
    updatePerformanceClasses(false);
    return false;
  }

  if (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency < 4) {
    cachedResult = false;
    updatePerformanceClasses(false);
    return false;
  }

  if (typeof navigator.deviceMemory === 'number' && navigator.deviceMemory < 4) {
    cachedResult = false;
    updatePerformanceClasses(false);
    return false;
  }

  try {
    const canvas = document.createElement('canvas');
    const attributes = {
      failIfMajorPerformanceCaveat: true,
      powerPreference: 'high-performance'
    };

    const gl = canvas.getContext('webgl2', attributes)
            || canvas.getContext('webgl', attributes)
            || canvas.getContext('experimental-webgl', attributes);

    if (!gl) {
      cachedResult = false;
      updatePerformanceClasses(false);
      return false;
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const unmaskedRenderer = debugInfo
      ? String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '').toLowerCase()
      : '';
    const standardRenderer = String(gl.getParameter(gl.RENDERER) || '').toLowerCase();
    const vendorString = String(gl.getParameter(gl.VENDOR) || '').toLowerCase();

    const softwareKeywords = [
      'swiftshader',
      'software',
      'llvmpipe',
      'softpipe',
      'virtualbox',
      'vmware',
      'basic render',
      'warp',
      'mesa',
      'gdi generic',
      'cpu'
    ];

    const isSoftware = softwareKeywords.some((keyword) =>
      unmaskedRenderer.includes(keyword) ||
      standardRenderer.includes(keyword) ||
      vendorString.includes(keyword)
    );

    if (isSoftware) {
      const loseContext = gl.getExtension('WEBGL_lose_context');
      if (loseContext) loseContext.loseContext();
      cachedResult = false;
      updatePerformanceClasses(false);
      return false;
    }

    // Benchmark a minimal clear/finish cycle to catch emulated/throttled drivers
    const t0 = performance.now();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.finish();
    const clearDuration = performance.now() - t0;

    const loseContext = gl.getExtension('WEBGL_lose_context');
    if (loseContext) {
      loseContext.loseContext();
    }

    if (clearDuration > 15) {
      cachedResult = false;
      updatePerformanceClasses(false);
      return false;
    }

    cachedResult = true;
    updatePerformanceClasses(true);
    return true;
  } catch {
    cachedResult = false;
    updatePerformanceClasses(false);
    return false;
  }
}

if (typeof navigator !== 'undefined' && typeof navigator.getBattery === 'function') {
  navigator.getBattery().then((battery) => {
    function evaluateBattery() {
      if (!battery.charging && battery.level <= 0.20) {
        updatePerformanceClasses(false);
      }
    }
    evaluateBattery();
    battery.addEventListener('levelchange', evaluateBattery);
    battery.addEventListener('chargingchange', evaluateBattery);
  }).catch(() => {});
}


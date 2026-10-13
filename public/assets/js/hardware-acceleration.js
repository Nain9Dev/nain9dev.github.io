let cachedResult = null;

export function resetHardwareAccelerationCache() {
  cachedResult = null;
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
    return false;
  }

  if (navigator.connection && navigator.connection.saveData) {
    cachedResult = false;
    return false;
  }

  if (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency < 4) {
    cachedResult = false;
    return false;
  }

  if (typeof navigator.deviceMemory === 'number' && navigator.deviceMemory < 4) {
    cachedResult = false;
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
      return false;
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '').toLowerCase();
      const softwareKeywords = [
        'swiftshader',
        'software',
        'llvmpipe',
        'softpipe',
        'virtualbox',
        'vmware',
        'basic render'
      ];
      const isSoftware = softwareKeywords.some((keyword) => renderer.includes(keyword));
      if (isSoftware) {
        const loseContext = gl.getExtension('WEBGL_lose_context');
        if (loseContext) loseContext.loseContext();
        cachedResult = false;
        return false;
      }
    }

    const loseContext = gl.getExtension('WEBGL_lose_context');
    if (loseContext) {
      loseContext.loseContext();
    }

    cachedResult = true;
    return true;
  } catch {
    cachedResult = false;
    return false;
  }
}

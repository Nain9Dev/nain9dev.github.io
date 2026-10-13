import test from 'node:test';
import assert from 'node:assert/strict';
import {
  hasHardwareAcceleration,
  resetHardwareAccelerationCache
} from '../public/assets/js/hardware-acceleration.js';

const originalNavigatorDesc = Object.getOwnPropertyDescriptor(globalThis, 'navigator');

function setMockNavigator(mock) {
  Object.defineProperty(globalThis, 'navigator', {
    value: mock,
    configurable: true,
    writable: true
  });
}

function restoreNavigator() {
  if (originalNavigatorDesc) {
    Object.defineProperty(globalThis, 'navigator', originalNavigatorDesc);
  } else {
    delete globalThis.navigator;
  }
}

test('returns false in non-browser environment when window is undefined', () => {
  resetHardwareAccelerationCache();
  delete globalThis.window;
  assert.equal(hasHardwareAcceleration(), false);
});

test('returns false when prefers-reduced-motion is enabled', () => {
  resetHardwareAccelerationCache();
  globalThis.window = {
    matchMedia: (query) => ({
      matches: query.includes('prefers-reduced-motion: reduce')
    })
  };
  setMockNavigator({ hardwareConcurrency: 8, deviceMemory: 8 });

  assert.equal(hasHardwareAcceleration(), false);

  delete globalThis.window;
  restoreNavigator();
  resetHardwareAccelerationCache();
});

test('returns false when Save-Data is active', () => {
  resetHardwareAccelerationCache();
  globalThis.window = {
    matchMedia: () => ({ matches: false })
  };
  setMockNavigator({
    hardwareConcurrency: 8,
    deviceMemory: 8,
    connection: { saveData: true }
  });

  assert.equal(hasHardwareAcceleration(), false);

  delete globalThis.window;
  restoreNavigator();
  resetHardwareAccelerationCache();
});

test('returns false when hardwareConcurrency is lower than 4', () => {
  resetHardwareAccelerationCache();
  globalThis.window = {
    matchMedia: () => ({ matches: false })
  };
  setMockNavigator({
    hardwareConcurrency: 2,
    deviceMemory: 8
  });

  assert.equal(hasHardwareAcceleration(), false);

  delete globalThis.window;
  restoreNavigator();
  resetHardwareAccelerationCache();
});

test('returns false when deviceMemory is lower than 4 GB', () => {
  resetHardwareAccelerationCache();
  globalThis.window = {
    matchMedia: () => ({ matches: false })
  };
  setMockNavigator({
    hardwareConcurrency: 8,
    deviceMemory: 2
  });

  assert.equal(hasHardwareAcceleration(), false);

  delete globalThis.window;
  restoreNavigator();
  resetHardwareAccelerationCache();
});

test('returns false when WebGL context creation fails with failIfMajorPerformanceCaveat', () => {
  resetHardwareAccelerationCache();
  globalThis.window = {
    matchMedia: () => ({ matches: false })
  };
  setMockNavigator({
    hardwareConcurrency: 8,
    deviceMemory: 8
  });
  globalThis.document = {
    createElement: () => ({
      getContext: () => null
    })
  };

  assert.equal(hasHardwareAcceleration(), false);

  delete globalThis.window;
  restoreNavigator();
  delete globalThis.document;
  resetHardwareAccelerationCache();
});

test('returns false when WebGL renderer is a software rasterizer (SwiftShader)', () => {
  resetHardwareAccelerationCache();
  globalThis.window = {
    matchMedia: () => ({ matches: false })
  };
  setMockNavigator({
    hardwareConcurrency: 8,
    deviceMemory: 8
  });

  let loseContextCalled = false;
  const mockGl = {
    getExtension: (ext) => {
      if (ext === 'WEBGL_debug_renderer_info') return { UNMASKED_RENDERER_WEBGL: 37446 };
      if (ext === 'WEBGL_lose_context') return { loseContext: () => { loseContextCalled = true; } };
      return null;
    },
    getParameter: () => 'Google SwiftShader'
  };

  globalThis.document = {
    createElement: () => ({
      getContext: () => mockGl
    })
  };

  assert.equal(hasHardwareAcceleration(), false);
  assert.equal(loseContextCalled, true);

  delete globalThis.window;
  restoreNavigator();
  delete globalThis.document;
  resetHardwareAccelerationCache();
});

test('returns true when hardware acceleration and native GPU renderer are active', () => {
  resetHardwareAccelerationCache();
  globalThis.window = {
    matchMedia: () => ({ matches: false })
  };
  setMockNavigator({
    hardwareConcurrency: 8,
    deviceMemory: 8
  });

  let loseContextCalled = false;
  const mockGl = {
    getExtension: (ext) => {
      if (ext === 'WEBGL_debug_renderer_info') return { UNMASKED_RENDERER_WEBGL: 37446 };
      if (ext === 'WEBGL_lose_context') return { loseContext: () => { loseContextCalled = true; } };
      return null;
    },
    getParameter: () => 'NVIDIA GeForce RTX 4070'
  };

  globalThis.document = {
    createElement: () => ({
      getContext: (type, options) => {
        if (options && options.failIfMajorPerformanceCaveat) {
          return mockGl;
        }
        return null;
      }
    })
  };

  assert.equal(hasHardwareAcceleration(), true);
  assert.equal(loseContextCalled, true);

  delete globalThis.window;
  restoreNavigator();
  delete globalThis.document;
  resetHardwareAccelerationCache();
});

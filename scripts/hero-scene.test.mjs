// Guards for specs/030-lightweight-hero-scene.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const close = (a, b, eps = 1e-6) => Math.abs(a - b) <= eps;

test('HERO-001: icosahedron geometry matches IcosahedronGeometry(2.2, 1) in wireframe', async () => {
  const { icosahedronTriangles, wireframeSegments } = await import('../src/scripts/hero-scene.js');
  const triangles = icosahedronTriangles(2.2, 1);
  assert.equal(triangles.length, 80 * 3 * 3, '80 triangles of 3 xyz vertices');
  for (let i = 0; i < triangles.length; i += 3) {
    assert.ok(close(Math.hypot(triangles[i], triangles[i + 1], triangles[i + 2]), 2.2), 'vertex off the sphere');
  }
  const unique = new Set();
  for (let i = 0; i < triangles.length; i += 3) unique.add(triangles.slice(i, i + 3).map((v) => v.toFixed(6)).join(','));
  assert.equal(unique.size, 42);
  // Three's first vertex of the first face (0, 11, 5) subdivided: v[0][1] of face a=(-1,t,0), b=(-t,0,1), c=(0,1,t).
  const t = (1 + Math.sqrt(5)) / 2;
  const mid = [(-1 + -t) / 2, (t + 0) / 2, (0 + 1) / 2];
  const len = Math.hypot(...mid);
  assert.ok(close(triangles[0], mid[0] / len * 2.2) && close(triangles[1], mid[1] / len * 2.2) && close(triangles[2], mid[2] / len * 2.2));
  const segments = wireframeSegments(triangles);
  assert.equal(segments.length, 80 * 3 * 2 * 3, 'every triangle edge, as Three draws non-indexed wireframes');
});

test('HERO-002: point cloud distribution and attenuated size', async () => {
  const { particlePositions, pointSize } = await import('../src/scripts/hero-scene.js');
  const positions = particlePositions(350);
  assert.equal(positions.length, 350 * 3);
  for (let i = 0; i < positions.length; i += 3) {
    const r = Math.hypot(positions[i], positions[i + 1], positions[i + 2]);
    assert.ok(r >= 2.4 - 1e-9 && r <= 7.6 + 1e-9, `radius ${r}`);
  }
  // THREE.PointsMaterial: gl_PointSize = size * pixelRatio * (cssHeight / 2) / -viewZ
  assert.ok(close(pointSize({ size: 0.025, pixelRatio: 1.5, cssHeight: 800 }), 0.025 * 1.5 * 400));
});

test('HERO-003: projection and view matrices follow the previous camera', async () => {
  const { perspective, lookAt, multiply, eulerXYZ } = await import('../src/scripts/hero-scene.js');
  const p = perspective(75, 2, 0.1, 1000);
  const f = 1 / Math.tan((75 * Math.PI) / 360);
  assert.ok(close(p[0], f / 2) && close(p[5], f) && close(p[11], -1) && close(p[14], (2 * 1000 * 0.1) / (0.1 - 1000)));
  const view = lookAt([0, 0, 5], [0, 0, 0]);
  assert.ok(close(view[14], -5) && close(view[0], 1) && close(view[5], 1) && close(view[10], 1));
  const identity = eulerXYZ(0, 0, 0);
  assert.deepEqual([...multiply(identity, view)].map((v) => +v.toFixed(9)), [...view].map((v) => +v.toFixed(9)));
  // Rx(pi/2) maps +Y to +Z (column-major).
  const rx = eulerXYZ(Math.PI / 2, 0, 0);
  assert.ok(close(rx[6], 1) && close(rx[9], -1));
});

test('HERO-004: no Three.js is shipped and the scene stays small', async () => {
  assert.equal(existsSync('src/vendor/three.module.min.js'), false);
  for (const file of ['src/scripts/app.js', 'src/scripts/hero-scene.js']) {
    assert.doesNotMatch(await readFile(file, 'utf8'), /three\.module|from ['"]three['"]/, file);
  }
  if (existsSync('dist/_astro')) {
    const files = await readdir('dist/_astro');
    assert.ok(!files.some((f) => f.startsWith('three')), 'a Three.js file is still published');
    const scene = files.find((f) => f.startsWith('hero-scene.') && f.endsWith('.js'));
    assert.ok(scene, 'hero-scene chunk missing from the build');
    assert.ok((await stat(join('dist/_astro', scene))).size <= 8 * 1024, 'hero-scene chunk over 8 KiB');
  }
});

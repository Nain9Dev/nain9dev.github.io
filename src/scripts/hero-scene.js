// Hero scene drawn with raw WebGL (spec 030). It reproduces the former Three.js scene:
// a wireframe IcosahedronGeometry(2.2, 1) and an additive point cloud, seen by a 75° camera.
import { hasHardwareAcceleration } from './hardware-acceleration.js';

const T = (1 + Math.sqrt(5)) / 2;
const ICOSAHEDRON_VERTICES = [-1, T, 0, 1, T, 0, -1, -T, 0, 1, -T, 0, 0, -1, T, 0, 1, T, 0, -1, -T, 0, 1, -T, T, 0, -1, T, 0, 1, -T, 0, -1, -T, 0, 1];
const ICOSAHEDRON_FACES = [0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11, 1, 5, 9, 5, 11, 4, 11, 10, 2, 10, 7, 6, 7, 1, 8, 3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9, 4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1];

const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

// Same subdivision order as THREE.PolyhedronGeometry, so the wireframe matches edge for edge.
export function icosahedronTriangles(radius, detail) {
  const corner = (index) => ICOSAHEDRON_VERTICES.slice(index * 3, index * 3 + 3);
  const cols = detail + 1;
  const out = [];
  for (let f = 0; f < ICOSAHEDRON_FACES.length; f += 3) {
    const a = corner(ICOSAHEDRON_FACES[f]);
    const b = corner(ICOSAHEDRON_FACES[f + 1]);
    const c = corner(ICOSAHEDRON_FACES[f + 2]);
    const v = [];
    for (let i = 0; i <= cols; i++) {
      v[i] = [];
      const aj = lerp(a, c, i / cols);
      const bj = lerp(b, c, i / cols);
      const rows = cols - i;
      for (let j = 0; j <= rows; j++) v[i][j] = j === 0 && i === cols ? aj : lerp(aj, bj, j / rows);
    }
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < 2 * (cols - i) - 1; j++) {
        const k = Math.floor(j / 2);
        const triangle = j % 2 === 0 ? [v[i][k + 1], v[i + 1][k], v[i][k]] : [v[i][k + 1], v[i + 1][k + 1], v[i + 1][k]];
        for (const p of triangle) {
          const length = Math.hypot(p[0], p[1], p[2]);
          out.push((p[0] / length) * radius, (p[1] / length) * radius, (p[2] / length) * radius);
        }
      }
    }
  }
  return out;
}

// Three draws a non-indexed wireframe as the three edges of every triangle, shared edges included.
export function wireframeSegments(triangles) {
  const out = [];
  for (let i = 0; i < triangles.length; i += 9) {
    const [a, b, c] = [triangles.slice(i, i + 3), triangles.slice(i + 3, i + 6), triangles.slice(i + 6, i + 9)];
    out.push(...a, ...b, ...b, ...c, ...c, ...a);
  }
  return out;
}

export function particlePositions(count, random = Math.random) {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const radius = 2.4 + random() * 5.2;
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(random() * 2 - 1);
    out[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    out[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    out[i * 3 + 2] = radius * Math.cos(phi);
  }
  return out;
}

// THREE.PointsMaterial with size attenuation: size * pixelRatio * (cssHeight / 2), divided by -viewZ in the shader.
export const pointSize = ({ size, pixelRatio, cssHeight }) => size * pixelRatio * (cssHeight * 0.5);

// Column-major 4×4 matrices in double precision, converted to Float32Array only when uploaded (as Three.js does).
export function perspective(fovDegrees, aspect, near, far) {
  const f = 1 / Math.tan((fovDegrees * Math.PI) / 360);
  return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, (2 * far * near) / (near - far), 0];
}

export function lookAt(eye, target) {
  let z = [eye[0] - target[0], eye[1] - target[1], eye[2] - target[2]];
  const zl = Math.hypot(...z);
  z = z.map((v) => v / zl);
  let x = [z[2], 0, -z[0]]; // up (0, 1, 0) × z
  const xl = Math.hypot(...x);
  x = x.map((v) => v / xl);
  const y = [z[1] * x[2] - z[2] * x[1], z[2] * x[0] - z[0] * x[2], z[0] * x[1] - z[1] * x[0]];
  const dot = (a) => a[0] * eye[0] + a[1] * eye[1] + a[2] * eye[2];
  return [x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x), -dot(y), -dot(z), 1];
}

export function multiply(a, b) {
  const out = new Array(16);
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      let sum = 0;
      for (let k = 0; k < 4; k++) sum += a[k * 4 + row] * b[col * 4 + k];
      out[col * 4 + row] = sum;
    }
  }
  return out;
}

// THREE.Euler order 'XYZ': R = Rx · Ry · Rz.
export function eulerXYZ(x, y, z) {
  const [a, b] = [Math.cos(x), Math.sin(x)];
  const [c, d] = [Math.cos(y), Math.sin(y)];
  const [e, f] = [Math.cos(z), Math.sin(z)];
  return [
    c * e, a * f + b * e * d, b * f - a * e * d, 0,
    -c * f, a * e - b * f * d, b * e + a * f * d, 0,
    d, -b * c, a * c, 0,
    0, 0, 0, 1
  ];
}

const LINE_VERTEX = 'attribute vec3 position;uniform mat4 modelView;uniform mat4 projection;void main(){gl_Position=projection*(modelView*vec4(position,1.0));}';
const POINT_VERTEX = 'attribute vec3 position;uniform mat4 modelView;uniform mat4 projection;uniform float size;void main(){vec4 mv=modelView*vec4(position,1.0);gl_Position=projection*mv;gl_PointSize=size/-mv.z;}';
const FRAGMENT = 'precision highp float;uniform vec4 color;void main(){gl_FragColor=color;}';

const hexColor = (hex, alpha) => [((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255, alpha];

function program(gl, vertexSource) {
  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    return shader;
  };
  const p = gl.createProgram();
  gl.attachShader(p, compile(gl.VERTEX_SHADER, vertexSource));
  gl.attachShader(p, compile(gl.FRAGMENT_SHADER, FRAGMENT));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  return p;
}

// Creates the renderer; `render(state)` draws one frame for the given camera and rotations.
export function createHeroRenderer(gl, particles) {
  const lineProgram = program(gl, LINE_VERTEX);
  const pointProgram = program(gl, POINT_VERTEX);
  const buffer = (data) => {
    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return b;
  };
  const lines = new Float32Array(wireframeSegments(icosahedronTriangles(2.2, 1)));
  const lineBuffer = buffer(lines);
  const pointBuffer = buffer(particles);
  const draw = (prog, buf, mode, count, uniforms) => {
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    const location = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0);
    for (const [name, value] of Object.entries(uniforms)) {
      const at = gl.getUniformLocation(prog, name);
      if (value.length === 16) gl.uniformMatrix4fv(at, false, value);
      else if (value.length === 4) gl.uniform4fv(at, value);
      else gl.uniform1f(at, value);
    }
    gl.drawArrays(mode, 0, count);
  };

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.enable(gl.BLEND);
  gl.clearColor(0, 0, 0, 0);

  return {
    render({ width, height, pixelRatio, camera, mesh, points }) {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      const projection = perspective(75, width / height, 0.1, 1000);
      const view = lookAt([camera.x, camera.y, 5], [0, 0, 0]);
      // Normal blending for the wireframe, additive for the points, as the former materials.
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      draw(lineProgram, lineBuffer, gl.LINES, lines.length / 3, {
        modelView: new Float32Array(multiply(view, eulerXYZ(mesh.x, mesh.y, 0))),
        projection: new Float32Array(projection),
        color: hexColor(0x3b82f6, 0.25)
      });
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      draw(pointProgram, pointBuffer, gl.POINTS, particles.length / 3, {
        modelView: new Float32Array(multiply(view, eulerXYZ(points.x, points.y, points.z))),
        projection: new Float32Array(projection),
        size: pointSize({ size: 0.025, pixelRatio, cssHeight: height }),
        color: hexColor(0x60a5fa, 0.45)
      });
    }
  };
}

let stop = null;

export function cleanupHeroScene() {
  if (stop) stop();
  stop = null;
}

export function initializeHeroScene() {
  const canvas = document.getElementById('hero-3d-canvas');
  const hero = document.querySelector('.hero');
  if (!canvas || !hero) return;

  const hide = () => { canvas.style.display = 'none'; };
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return hide();
  if (window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches) return hide();
  if (!hasHardwareAcceleration()) return hide();

  const options = { alpha: true, antialias: true, powerPreference: 'low-power', failIfMajorPerformanceCaveat: true };
  const gl = canvas.getContext('webgl', options);
  if (!gl) return hide();

  let renderer;
  try {
    renderer = createHeroRenderer(gl, particlePositions(350));
  } catch (error) {
    console.warn('[HeroScene] Unable to create the WebGL scene. Falling back to static hero.', error);
    return hide();
  }

  let width = hero.clientWidth;
  let height = hero.clientHeight;
  const pixelRatio = Math.min(window.devicePixelRatio, 1.5);
  const resize = () => {
    width = hero.clientWidth;
    height = hero.clientHeight;
    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  };
  resize();

  const state = { camera: { x: 0, y: 0 }, mesh: { x: 0, y: 0 }, points: { x: 0, y: 0, z: 0 } };
  let mouseX = 0;
  let mouseY = 0;
  let scrollY = window.scrollY;
  const halfX = window.innerWidth / 2;
  const halfY = window.innerHeight / 2;
  const onMouseMove = (event) => {
    mouseX = (event.clientX - halfX) * 0.001;
    mouseY = (event.clientY - halfY) * 0.001;
  };
  const onScroll = () => { scrollY = window.scrollY; };

  let frame = null;
  let running = false;
  let clockStart = 0;
  let lastFrame = 0;
  let checkedFrames = 0;
  let slowFrames = 0;

  const degrade = () => {
    console.warn('[HeroScene] Low framerate detected during execution. Degraded to lightweight mode.');
    cleanupHeroScene();
    hide();
    document.documentElement.classList.remove('high-performance');
    document.documentElement.classList.add('low-performance');
  };

  const animate = () => {
    if (!running) return;
    const now = performance.now();
    if (lastFrame > 0 && checkedFrames < 60) {
      checkedFrames++;
      if (now - lastFrame > 50 && ++slowFrames >= 5) return degrade();
    }
    lastFrame = now;
    frame = requestAnimationFrame(animate);

    const elapsed = (now - clockStart) / 1000;
    state.mesh.y += 0.001;
    state.mesh.x += 0.0005;
    state.mesh.y += 0.05 * (mouseX - state.mesh.y);
    state.mesh.x += 0.05 * (mouseY - state.mesh.x);
    state.points.y = elapsed * 0.04;
    state.points.x = Math.sin(elapsed * 0.15) * 0.05;
    state.points.z = elapsed * 0.02;
    state.camera.x += (mouseX * 2 - state.camera.x) * 0.02;
    state.camera.y += (-mouseY * 2 - scrollY * 0.0015 - state.camera.y) * 0.02;

    renderer.render({ width, height, pixelRatio, ...state });
    canvas.classList.remove('canvas-placeholder');
  };

  const start = () => {
    if (running) return;
    running = true;
    clockStart = performance.now();
    animate();
  };
  const pause = () => {
    running = false;
    if (frame) cancelAnimationFrame(frame);
    frame = null;
  };

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) start();
    else pause();
  }, { rootMargin: '100px' });
  const onVisibility = () => {
    if (document.hidden) return pause();
    const rect = hero.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) start();
  };
  const onContextLost = (event) => {
    event.preventDefault();
    console.warn('[HeroScene] WebGL context lost. Gracefully disabling 3D hero.');
    cleanupHeroScene();
    hide();
  };

  hero.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  canvas.addEventListener('webglcontextlost', onContextLost, { once: true });
  observer.observe(hero);

  stop = () => {
    pause();
    observer.disconnect();
    hero.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', resize);
    document.removeEventListener('visibilitychange', onVisibility);
  };
}

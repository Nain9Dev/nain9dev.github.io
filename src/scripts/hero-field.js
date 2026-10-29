// hero-field.js: the hero's living surface (specs/next-hero-field, HERO-005 to HERO-009).
// A staggered grid of short round-capped strokes, denser toward the right, drawn on a 2D canvas with no library.
// A fine pointer pushes the strokes away and a press sends a red ripple. It runs only while the hero is visible.

const ANGLE = (-52 * Math.PI) / 180;
const LENGTH = 30;
const BUCKETS = 11;
const REACH = 210;
const MIN_SCALE = 0.18;
const START = 0.55;

export function hash(i, j) {
  const n = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

export function fieldCells(width, height, step = 26) {
  const cells = [];
  for (let j = 0; j * step < height + step; j += 1) {
    for (let i = 0; i * step < width + step; i += 1) {
      cells.push({ x: i * step + (j % 2 ? step / 2 : 0), y: j * step, h: hash(i, j), s: 1, v: 0 });
    }
  }
  return cells;
}

// Share of cells that carry a stroke: none in the text column, full at the right edge.
export function strokeDensity(x, width, wave = 0) {
  return Math.min(1, Math.max(0, (x / width - START) * 2.25 + wave));
}

export const strokeOpacity = (density) => 0.26 + density * 0.74;
export const opacityBucket = (opacity) => Math.round(opacity * (BUCKETS - 1));

export function parseColor(value) {
  const text = String(value).trim();
  const hex = text.match(/^#([0-9a-f]{6})$/i);
  if (hex) return [0, 2, 4].map((at) => parseInt(hex[1].slice(at, at + 2), 16));
  const rgb = text.match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  return [128, 255, 0];
}

let stop = null;

export function cleanupHeroField() {
  if (stop) stop();
  stop = null;
}

export function initializeHeroField() {
  const canvas = document.getElementById('hero-field');
  const hero = document.querySelector('.hero');
  if (!canvas || !hero) return;

  const hide = () => { canvas.style.display = 'none'; };
  if (document.documentElement.classList.contains('low-performance')) return hide();
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return hide();

  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const dx = Math.cos(ANGLE);
  const dy = Math.sin(ANGLE);
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
  let stroke = [128, 255, 0];
  let hot = [255, 0, 31];
  const readColors = () => {
    const css = getComputedStyle(canvas);
    stroke = parseColor(css.getPropertyValue('--color-stroke'));
    hot = parseColor(css.getPropertyValue('--color-red'));
  };

  let width = 0;
  let height = 0;
  let cells = [];
  const build = () => {
    width = hero.clientWidth;
    height = hero.clientHeight;
    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    cells = fieldCells(width, height);
  };

  let time = 0;
  let pointerX = -9999;
  let pointerY = -9999;
  let touched = false;
  let moving = 0;
  const ripples = [];
  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.lineCap = 'round';
    ctx.lineWidth = 4;
    const halfX = (dx * LENGTH) / 2;
    const halfY = (dy * LENGTH) / 2;
    const paths = Array.from({ length: BUCKETS }, () => []);
    const warm = [];
    let settling = 0;
    for (const cell of cells) {
      const wave = 0.17 * Math.sin(cell.x * 0.0055 + cell.y * 0.004 + time * 0.55);
      const density = strokeDensity(cell.x, width, wave);
      if (cell.h > density) continue;
      let push = 0;
      let heat = 0;
      if (touched) {
        const ox = cell.x - pointerX;
        const oy = cell.y - pointerY;
        const distance = Math.hypot(ox, oy);
        if (distance < REACH) {
          const u = 1 - distance / REACH;
          push = u * u * (3 - 2 * u);
        }
        for (const ripple of ripples) {
          const gap = Math.abs(Math.hypot(cell.x - ripple.x, cell.y - ripple.y) - ripple.r);
          if (gap < 52) {
            const value = (1 - gap / 52) * ripple.a;
            if (value > push) push = value;
            heat = Math.max(heat, value * 1.9);
          }
        }
      }
      if (push > 0 || cell.s !== 1 || cell.v !== 0) {
        const target = 1 - (1 - MIN_SCALE) * push;
        cell.v += (target - cell.s) * (target < cell.s ? 0.34 : 0.13);
        cell.v *= 0.74;
        cell.s = Math.min(1.06, Math.max(MIN_SCALE * 0.9, cell.s + cell.v));
        if (Math.abs(cell.s - 1) < 0.002 && Math.abs(cell.v) < 0.002) { cell.s = 1; cell.v = 0; }
        if (cell.s < 0.92) settling += 1;
      }
      const base = strokeOpacity(density);
      const opacity = Math.min(1, base + (base < 1 ? (1 - base) * (1 - cell.s) * 1.4 : 0));
      const segment = [cell.x - halfX * cell.s, cell.y - halfY * cell.s, cell.x + halfX * cell.s, cell.y + halfY * cell.s];
      if (heat > 0.02) warm.push([segment, Math.min(1, heat), opacity]);
      else paths[opacityBucket(opacity)].push(segment);
    }
    ctx.strokeStyle = `rgb(${stroke.join(',')})`;
    for (let level = 1; level < BUCKETS; level += 1) {
      if (!paths[level].length) continue;
      ctx.globalAlpha = level / (BUCKETS - 1);
      ctx.beginPath();
      for (const [x1, y1, x2, y2] of paths[level]) { ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); }
      ctx.stroke();
    }
    for (const [[x1, y1, x2, y2], k, opacity] of warm) {
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = `rgb(${stroke.map((value, at) => Math.round(value + (hot[at] - value) * k)).join(',')})`;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    moving = settling;
  };

  let frame = null;
  let running = false;
  let lastTick = 0;
  let lastDraw = 0;
  let tick = 0;
  let checked = 0;
  let slow = 0;
  const degrade = () => {
    cleanupHeroField();
    hide();
    document.documentElement.classList.remove('high-performance');
    document.documentElement.classList.add('low-performance');
  };
  const animate = (now) => {
    if (!running) return;
    frame = requestAnimationFrame(animate);
    if (lastTick > 0 && checked < 60) {
      checked += 1;
      if (now - lastTick > 50 && ++slow >= 5) return degrade();
    }
    lastTick = now;
    // While nothing touches the field it only breathes, so one frame in three is enough (about 20 fps).
    tick += 1;
    if (!touched && !ripples.length && !moving && tick % 3) return;
    const dt = lastDraw ? Math.min(0.05, (now - lastDraw) / 1000) : 0.016;
    lastDraw = now;
    time += dt;
    for (let at = ripples.length - 1; at >= 0; at -= 1) {
      ripples[at].r += 480 * dt;
      ripples[at].a -= 0.66 * dt;
      if (ripples[at].a <= 0) ripples.splice(at, 1);
    }
    if (!ripples.length && pointerX < -999) touched = false;
    draw();
    canvas.classList.remove('canvas-placeholder');
  };
  const start = () => {
    if (running) return;
    running = true;
    lastTick = 0;
    lastDraw = 0;
    frame = requestAnimationFrame(animate);
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
  const onMove = (event) => {
    const rect = canvas.getBoundingClientRect();
    pointerX = event.clientX - rect.left;
    pointerY = event.clientY - rect.top;
    touched = true;
  };
  const onLeave = () => { pointerX = -9999; pointerY = -9999; touched = ripples.length > 0; };
  const onDown = (event) => {
    const rect = canvas.getBoundingClientRect();
    if (ripples.length < 4) ripples.push({ x: event.clientX - rect.left, y: event.clientY - rect.top, r: 0, a: 1 });
    touched = true;
  };
  const onResize = () => { build(); if (!running) draw(); };

  const system = window.matchMedia('(prefers-color-scheme: light)');
  const themes = new MutationObserver(() => { readColors(); if (!running) draw(); });
  readColors();
  build();
  themes.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  system.addEventListener('change', readColors);
  if (finePointer) {
    hero.addEventListener('pointermove', onMove, { passive: true });
    hero.addEventListener('pointerleave', onLeave, { passive: true });
    hero.addEventListener('pointerdown', onDown, { passive: true });
  }
  window.addEventListener('resize', onResize, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  observer.observe(hero);

  stop = () => {
    pause();
    observer.disconnect();
    themes.disconnect();
    system.removeEventListener('change', readColors);
    hero.removeEventListener('pointermove', onMove);
    hero.removeEventListener('pointerleave', onLeave);
    hero.removeEventListener('pointerdown', onDown);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibility);
  };
}

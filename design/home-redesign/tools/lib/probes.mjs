// Functions that run inside the page (page.evaluate / addInitScript) for tools/check.mjs.
// Each one is self-contained: Playwright sends its source text to the browser, so nothing from
// this module's scope is visible inside them.

// ------------------------------------------------------------------ page facts (load checks + theme)
export function pageFacts() {
  const vis = (el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length) || el.classList.contains('sr');
  const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter((h) => !h.closest('[hidden]') && vis(h)).map((h) => +h.tagName[1]);
  let skips = 0; for (let i = 1; i < hs.length; i++) if (hs[i] > hs[i - 1] + 1) skips++;
  const bg = (el) => (el ? getComputedStyle(el).backgroundColor : null);
  const INV = ['footer', '.hero', '.on-deep', '.term', 'pre.panel', '.diagram', '.mesh-box', '.fic'];
  return {
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    h1: document.querySelectorAll('h1').length, main: document.querySelectorAll('main').length, first: hs[0], skips,
    lang: document.documentElement.lang,
    imgs: [...document.querySelectorAll('img')].filter((i) => !i.getAttribute('width') || !i.getAttribute('height')).map((i) => i.getAttribute('src')),
    links: [...document.querySelectorAll('a[href]')].map((a) => ({ href: a.getAttribute('href'), abs: a.href, target: a.getAttribute('target'), rel: a.getAttribute('rel') || '' })),
    theme: {
      dataTheme: document.documentElement.getAttribute('data-theme'),
      get: window.naindevTheme && window.naindevTheme.get ? window.naindevTheme.get() : null,
      jsTheme: document.documentElement.classList.contains('js-theme'),
      body: bg(document.body), html: bg(document.documentElement), header: bg(document.querySelector('header.top')),
      favicon: (document.getElementById('favicon') || {}).getAttribute ? document.getElementById('favicon').getAttribute('href') : null,
      themeColor: document.getElementById('themeColor') ? document.getElementById('themeColor').getAttribute('content') : null,
      pressed: [...document.querySelectorAll('[data-theme-toggle]')].map((b) => b.getAttribute('aria-pressed')),
      invariants: INV.map((s) => { const e = document.querySelector(s); return e ? [s, bg(e)] : null; }).filter(Boolean),
    },
  };
}

// ------------------------------------------------------------------ contrast of every text pair
// opts: { documented: [[selector, '#RRGGBB']], page, maxFails }
export function contrastProbe(opts) {
  const DOC = opts.documented || [];
  const cache = new Map();
  const cs = (e) => { let s = cache.get(e); if (!s) { s = getComputedStyle(e); cache.set(e, s); } return s; };
  const ctx = document.createElement('canvas').getContext('2d');
  function parse(s) {
    if (!s) return null;
    s = String(s).trim();
    if (s === 'transparent') return [0, 0, 0, 0];
    let m = s.match(/^rgba?\(([^)]+)\)$/i);
    if (m) { const p = m[1].split(/[\s,/]+/).filter(Boolean).map((x) => (x.endsWith('%') ? parseFloat(x) / 100 : parseFloat(x))); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; }
    m = s.match(/^color\(srgb\s+([^)]+)\)$/i);
    if (m) { const p = m[1].split(/[\s/]+/).filter(Boolean).map(parseFloat); return [p[0] * 255, p[1] * 255, p[2] * 255, p.length > 3 ? p[3] : 1]; }
    m = s.match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/i);
    if (m) return [parseInt(m[1].slice(0, 2), 16), parseInt(m[1].slice(2, 4), 16), parseInt(m[1].slice(4, 6), 16), m[2] ? parseInt(m[2], 16) / 255 : 1];
    ctx.fillStyle = '#010203'; ctx.fillStyle = s;
    if (ctx.fillStyle !== '#010203' && ctx.fillStyle !== s) return parse(ctx.fillStyle);
    return null;
  }
  const over = (t, b) => { const a = t[3] + b[3] * (1 - t[3]); if (!a) return [0, 0, 0, 0]; return [0, 1, 2].map((i) => (t[i] * t[3] + b[i] * b[3] * (1 - t[3])) / a).concat(a); };
  const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const lum = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const hex = (c) => '#' + c.slice(0, 3).map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('').toUpperCase();
  const MOTION = /^(apar|aparece|cae|linea|resp|on|built|still|mo)$/;
  function selOf(e) {
    if (!e || !e.tagName) return '?';
    const own = e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + [...(e.classList || [])].filter((c) => !MOTION.test(c) && c !== 'es' && c !== 'en').slice(0, 2).map((c) => '.' + c).join('');
    const ctxEl = e.parentElement && e.parentElement.closest('section[id],section[aria-labelledby],header,footer,aside,nav,figure,[id]');
    if (!ctxEl) return own;
    const c = ctxEl.tagName.toLowerCase() + (ctxEl.id ? '#' + ctxEl.id : ctxEl.getAttribute('aria-labelledby') ? '[' + ctxEl.getAttribute('aria-labelledby') + ']' : [...ctxEl.classList].filter((x) => !MOTION.test(x)).slice(0, 1).map((x) => '.' + x).join(''));
    return c + ' › ' + own;
  }
  function splitTop(v) { const out = []; let d = 0, cur = ''; for (const ch of v) { if (ch === '(') d++; if (ch === ')') d--; if (ch === ',' && !d) { out.push(cur.trim()); cur = ''; } else cur += ch; } if (cur.trim()) out.push(cur.trim()); return out; }
  // a gradient stripe a few pixels tall or wide (an underline) is not a surface behind the text
  function decorative(s) {
    const imgs = splitTop(s.backgroundImage), sizes = splitTop(s.backgroundSize || 'auto');
    return imgs.every((im, i) => /gradient\(/.test(im) && /(^|\s)[0-8](\.\d+)?px(\s|$)/.test(sizes[i % sizes.length] || ''));
  }
  function hiddenReason(el) {
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      if (e.hasAttribute('hidden')) return 'hidden';
      if (e.classList.contains('sr')) return 'sr';
      if (e.getAttribute('data-demo') === 'no') return 'demo';
      const s = cs(e);
      if (s.display === 'none') return 'display';
      if (+s.opacity === 0) return 'opacity';
      if (/rect\(0px,?\s*0px,?\s*0px,?\s*0px\)/.test(s.clip) || s.clipPath === 'inset(50%)') return 'clip';
    }
    return null;
  }
  const media = [...document.querySelectorAll('img,canvas,video')].filter((m) => !hiddenReason(m)).map((m) => ({ m, r: m.getBoundingClientRect() })).filter((x) => x.r.width > 1 && x.r.height > 1);
  const hits = (a, b) => a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1;
  // the effective background: first opaque background-color up the tree, semi-transparent layers composited
  function bgFor(el, rects) {
    const layers = [];
    let base = null, via = 'colour', bgEl = null;
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      const s = cs(e);
      if (s.backgroundImage && s.backgroundImage !== 'none' && !decorative(s)) {
        const d = DOC.find(([sel]) => e.matches(sel));
        if (d) { base = parse(d[1]); via = 'documented ' + d[0] + ' → ' + d[1]; bgEl = e; break; }
        return { unmeasurable: 'background-image on ' + selOf(e) + ': ' + s.backgroundImage.slice(0, 60) };
      }
      const c = parse(s.backgroundColor);
      if (c && c[3] > 0) { layers.push(c); if (c[3] >= 0.999) { base = c; bgEl = e; break; } }
    }
    if (rects) {
      for (const x of media) {
        if ((bgEl && !bgEl.contains(x.m)) || x.m.contains(el)) continue;
        if (rects.some((r) => hits(r, x.r))) return { unmeasurable: x.m.tagName.toLowerCase() + (x.m.id ? '#' + x.m.id : '') + ' behind the text' };
      }
    }
    let col;
    if (base && layers.length && layers[layers.length - 1] === base) { col = base; for (let i = layers.length - 2; i >= 0; i--) col = over(layers[i], col); }
    else { col = base || [255, 255, 255, 1]; if (!base) via = 'canvas default (white)'; for (let i = layers.length - 1; i >= 0; i--) col = over(layers[i], col); }
    return { color: col, via, bgEl };
  }
  // an SVG text over a filled shape of the same drawing: the shape is its background
  function svgShapeUnder(el, rect) {
    const svg = el.ownerSVGElement || el.closest('svg');
    if (!svg) return null;
    const cx = (rect.left + rect.right) / 2, cy = (rect.top + rect.bottom) / 2;
    let found = null;
    for (const sh of svg.querySelectorAll('rect,circle,ellipse,polygon')) {
      if (!(sh.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING)) continue;
      const s = cs(sh);
      if (s.display === 'none' || s.visibility !== 'visible') continue;
      const f = parse(s.fill);
      if (!f || !f[3]) continue;
      const r = sh.getBoundingClientRect();
      if (cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom) found = [f[0], f[1], f[2], f[3] * (+s.fillOpacity || 1) * (+s.opacity || 1)];
    }
    return found;
  }
  const pairs = new Map();
  const fails = [];
  const unmeasurable = [];
  const documented = new Map();
  let measured = 0;
  function record(el, fgRaw, rects, text, size, weight, suffix) {
    const fg0 = parse(fgRaw);
    if (!fg0) { unmeasurable.push({ sel: selOf(el) + suffix, why: 'colour ' + fgRaw, text }); return; }
    const b = bgFor(el, rects);
    if (b.unmeasurable) { unmeasurable.push({ sel: selOf(el) + suffix, why: b.unmeasurable, text }); return; }
    let bgc = b.color;
    const isSvg = el instanceof SVGElement;
    if (isSvg && rects[0]) { const sh = svgShapeUnder(el, rects[0]); if (sh) bgc = over(sh, bgc); }
    let op = 1;
    for (let e = el; e && e !== b.bgEl && e.nodeType === 1; e = e.parentElement) op *= +cs(e).opacity;
    const alpha = fg0[3] * op * (isSvg ? (+cs(el).fillOpacity || 1) : 1);
    if (alpha <= 0.001) return;
    const fg = over([fg0[0], fg0[1], fg0[2], alpha], bgc);
    const r = ratio(fg, bgc);
    const large = size >= 24 || (size >= 18.66 && weight >= 600);
    const min = large ? 3 : 4.5;
    const key = hex(fg) + ' on ' + hex(bgc) + (large ? ' large' : '');
    measured++;
    if (b.via !== 'colour') documented.set(selOf(el) + suffix, b.via);
    const p = pairs.get(key);
    if (!p) pairs.set(key, { fg: hex(fg), bg: hex(bgc), large, min, ratio: r, count: 1, sel: selOf(el) + suffix, text: text.slice(0, 40) });
    else { p.count++; if (r < p.ratio) { p.ratio = r; p.sel = selOf(el) + suffix; p.text = text.slice(0, 40); } }
    if (r < min - 0.005 && fails.length < (opts.maxFails || 60)) fails.push({ fg: hex(fg), bg: hex(bgc), ratio: r, min, sel: selOf(el) + suffix, text: text.slice(0, 50), size, weight });
  }
  const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'TITLE', 'DESC', 'METADATA', 'HEAD', 'CANVAS', 'VIDEO', 'AUDIO', 'OBJECT']);
  for (const el of document.querySelectorAll('body, body *')) {
    if (SKIP.has(el.tagName.toUpperCase())) continue;
    const texts = [...el.childNodes].filter((n) => n.nodeType === 3 && /\S/.test(n.nodeValue));
    const isField = el.matches('input:not([type=hidden]):not([type=checkbox]):not([type=radio]),textarea');
    const pseudo = [];
    for (const which of ['::before', '::after']) {
      const ps = getComputedStyle(el, which);
      const c = ps.content;
      if (!c || c === 'none' || c === 'normal' || ps.display === 'none') continue;
      const m = c.match(/^"((?:[^"\\]|\\.)*)"$/);
      const t = m ? m[1] : /counter\(/.test(c) ? '0' : '';
      if (/\S/.test(t)) pseudo.push([which, ps, t]);
    }
    if (!texts.length && !isField && !pseudo.length) continue;
    if (hiddenReason(el)) continue;
    const s = cs(el);
    if (s.visibility !== 'visible') continue;
    const size = parseFloat(s.fontSize), weight = +s.fontWeight || 400;
    if (texts.length) {
      const rects = [];
      for (const n of texts) { const rg = document.createRange(); rg.selectNodeContents(n); for (const r of rg.getClientRects()) if (r.width > 0.5 && r.height > 0.5) rects.push(r); }
      if (rects.length) {
        const fill = el instanceof SVGElement ? s.fill : (s.webkitTextFillColor && s.webkitTextFillColor !== s.color && s.webkitTextFillColor !== 'currentcolor' ? s.webkitTextFillColor : s.color);
        if (/^url\(/.test(fill)) unmeasurable.push({ sel: selOf(el), why: 'fill ' + fill, text: texts.map((n) => n.nodeValue).join(' ').trim().slice(0, 40) });
        else if (fill !== 'none') record(el, fill, rects, texts.map((n) => n.nodeValue).join(' ').replace(/\s+/g, ' ').trim(), size, weight, '');
      }
    }
    if (isField) {
      const r = el.getBoundingClientRect();
      if (r.width > 1 && r.height > 1) {
        if (el.value) record(el, s.color, [r], el.value, size, weight, ' (value)');
        else if (el.placeholder) record(el, getComputedStyle(el, '::placeholder').color, [r], el.placeholder, size, weight, '::placeholder');
      }
    }
    for (const [which, ps, t] of pseudo) {
      if (ps.visibility !== 'visible' || +ps.opacity === 0) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 1 && r.height < 1) continue;
      record(el, ps.color, [], t, parseFloat(ps.fontSize), +ps.fontWeight || 400, which);
    }
  }

  // non-text: the boundary of controls (WCAG 1.4.11), measured where the border is the only boundary
  const boundaries = [];
  for (const el of document.querySelectorAll('button, a.btn, .chip, input:not([type=hidden]), textarea, select, [role="button"]')) {
    if (hiddenReason(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const s = cs(el);
    if (s.visibility !== 'visible') continue;
    const around = bgFor(el.parentElement, null);
    if (around.unmeasurable) { boundaries.push({ sel: selOf(el), kind: 'unmeasurable', why: around.unmeasurable }); continue; }
    const sur = around.color;
    const fillRaw = parse(s.backgroundColor);
    const fill = fillRaw && fillRaw[3] > 0 ? over(fillRaw, sur) : sur;
    const fillRatio = ratio(fill, sur);
    const sides = ['Top', 'Right', 'Bottom', 'Left'].map((k) => ({ w: parseFloat(s['border' + k + 'Width']), c: parse(s['border' + k + 'Color']), st: s['border' + k + 'Style'] })).filter((x) => x.w > 0 && x.c && x.c[3] > 0 && x.st !== 'none' && x.st !== 'hidden');
    const field = el.matches('input,textarea,select');
    if (fillRatio >= 3) continue;                       // the fill is the boundary
    if (!sides.length) { boundaries.push({ sel: selOf(el), kind: fillRatio > 1.05 ? 'fill' : 'none', field, fill: hex(fill), bg: hex(sur), ratio: fillRatio }); continue; }
    const br = Math.min(...sides.map((x) => ratio(over(x.c, fill), sur)));
    if (br < 3) boundaries.push({ sel: selOf(el), kind: 'border', field, border: hex(over(sides[0].c, fill)), bg: hex(sur), ratio: br });
  }
  return { pairs: [...pairs.values()], fails, unmeasurable: unmeasurable.slice(0, 40), documented: [...documented.entries()].slice(0, 20), boundaries, measured };
}

// ------------------------------------------------------------------ first paint (init script)
// Records when theme.js ran (class js-theme, data-theme) and the state at the first paint.
export function firstPaintInit() {
  window.__fp = { marks: [], paints: [] };
  try {
    new MutationObserver((ms) => {
      for (const m of ms) if (m.target === document.documentElement) window.__fp.marks.push({ t: performance.now(), attr: m.attributeName, value: document.documentElement.getAttribute(m.attributeName) });
    }).observe(document, { attributes: true, subtree: true, attributeFilter: ['data-theme', 'class'] });
    new PerformanceObserver((l) => l.getEntries().forEach((e) => {
      const root = document.documentElement;
      window.__fp.paints.push({ name: e.name, t: e.startTime, seen: performance.now(), dataTheme: root.getAttribute('data-theme'), jsTheme: root.classList.contains('js-theme'),
        html: getComputedStyle(root).backgroundColor, body: document.body ? getComputedStyle(document.body).backgroundColor : null,
        header: document.querySelector('header.top') ? getComputedStyle(document.querySelector('header.top')).backgroundColor : null });
    })).observe({ type: 'paint', buffered: true });
  } catch (e) { window.__fp.error = String(e); }
}

// ------------------------------------------------------------------ animation recorder (init script)
// Catches every CSS transition and animation as it is created, and every Element.animate() call.
export function animRecorderInit() {
  const seen = new WeakSet();
  window.__anims = [];
  const STATE = /^(aparece|on|built|es|en)$/;
  const name = (e) => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + [...(e.classList || [])].filter((c) => !STATE.test(c)).slice(0, 2).map((c) => '.' + c).join('');
  const selOf = (e) => {
    if (!e || !e.tagName) return '?';
    let own = name(e);
    if (own === e.tagName.toLowerCase() && e.parentElement) own = name(e.parentElement) + ' > ' + own;   // a bare tag says little: show its parent
    const sec = e.closest && e.closest('section[id],header,footer,.agd,[data-replay],.lab-stage');
    return (sec && sec !== e ? (sec.id ? '#' + sec.id : sec.tagName.toLowerCase() + (sec.classList[0] ? '.' + sec.classList[0] : '')) + ' › ' : '') + own;
  };
  function rec(a, how) {
    if (!a || seen.has(a)) return;
    seen.add(a);
    try {
      const ef = a.effect;
      if (!ef) return;
      const t = ef.getTiming();
      const kf = ef.getKeyframes ? ef.getKeyframes() : [];
      const tg = ef.target;
      // A transition that reverses mid-way runs shortened (the reversing shortening factor), so its
      // effect reports less than the stylesheet says: take the declared duration from the computed style.
      let declared = null;
      if (a.constructor.name === 'CSSTransition' && tg) {
        const s = getComputedStyle(tg, ef.pseudoElement || null);
        const props = s.transitionProperty.split(',').map((x) => x.trim());
        const durs = s.transitionDuration.split(',').map((x) => parseFloat(x) * (/ms$/.test(x.trim()) ? 1 : 1000));
        const p = a.transitionProperty;
        let k = -1;
        props.forEach((q, i) => {
          const parts = q.split('-');
          if (q === 'all' || q === p || p.indexOf(q + '-') === 0 || (parts.length > 1 && p.indexOf(parts[0] + '-') === 0 && p.slice(-(parts.slice(1).join('-').length + 1)) === '-' + parts.slice(1).join('-'))) k = i;
        });
        if (k >= 0) declared = durs[k % durs.length];
      }
      window.__anims.push({
        type: a.constructor.name, how, name: a.animationName || '', prop: a.transitionProperty || '',
        duration: declared != null ? declared : (typeof t.duration === 'number' ? t.duration : String(t.duration)), effective: typeof t.duration === 'number' ? Math.round(t.duration) : null,
        iterations: t.iterations === Infinity ? 'Infinity' : t.iterations,
        easing: t.easing, delay: t.delay, pseudo: ef.pseudoElement || '',
        kf: kf.map((k) => { const o = { o: k.computedOffset, e: k.easing, v: {} }; for (const p in k) if (!/^(offset|computedOffset|easing|composite)$/.test(p)) o.v[p] = String(k[p]); return o; }),
        sel: selOf(tg) + (ef.pseudoElement || ''), agd: !!(tg && tg.closest && tg.closest('.agd')), at: Math.round(performance.now()),
      });
    } catch (e) { /* an animation that went away */ }
  }
  window.__recAll = (how) => { try { document.getAnimations().forEach((a) => rec(a, how)); } catch (e) { /* none */ } };
  const onEv = (e) => { try { (e.target.getAnimations ? e.target.getAnimations({ subtree: true }) : []).forEach((a) => rec(a, e.type)); } catch (er) { /* none */ } };
  ['transitionrun', 'transitionstart', 'animationstart'].forEach((t) => document.addEventListener(t, onEv, true));
  const orig = Element.prototype.animate;
  Element.prototype.animate = function () { const a = orig.apply(this, arguments); rec(a, 'Element.animate'); return a; };
}

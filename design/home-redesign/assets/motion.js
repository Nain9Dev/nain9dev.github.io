/* ============================================================
   NainDev · motion system (round 3, brandbook addendum 1.1)
   Construction: plays once on entry, CSS transitions only, no JS per
   frame. Response: only while the visitor acts. The only loop is the
   hero field (nain.js). Reduced motion: final state, no frames.
   ES5 syntax on purpose (iOS 15 and older engines).
   ============================================================ */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var reduce = !root.classList.contains('mo');

  function hash(i, j) { var n = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return n - Math.floor(n); }
  function attr(el, name, fallback) {
    var n = el.closest ? el.closest('[' + name + ']') : null;
    return n ? n.getAttribute(name) : fallback;
  }
  // Restart a construction: drop the state class, force a style flush, add it back.
  function replay(el) {
    if (el.classList.contains('apar')) {
      el.classList.remove('aparece');
      void el.offsetWidth;
      el.classList.add('aparece');
      return;
    }
    el.classList.add('rst');            // .rst cancels every animation inside; removing it restarts them
    void el.offsetWidth;
    el.classList.remove('rst');
  }

  /* ---------- 7.2 · the pattern, built once from its seed ---------- */
  var SVGNS = 'http://www.w3.org/2000/svg';
  // Strokes go into a dozen groups by build order, so the browser animates 12 groups, not 300 paths.
  var GROUPS = 12;
  function trama(box, rect) {
    var w = Math.round(rect && rect.width ? rect.width : box.clientWidth), h = Math.round(rect && rect.height ? rect.height : box.clientHeight);
    if (!w || !h || box.getAttribute('data-w') === String(w)) return;
    box.setAttribute('data-w', String(w));
    var seed = +box.getAttribute('data-seed') || 7, step = 22, len = 15;
    var ink = box.getAttribute('data-ink') || '#0047AB', fromRight = box.getAttribute('data-dir') === 'r';
    var variant = attr(box, 'data-trama', 'a');
    var a = 52 * Math.PI / 180, hx = Math.cos(a) * len, hy = Math.sin(a) * len;
    var items = [];
    for (var j = -1; j * step < h + step; j++) {
      for (var i = -1; i * step < w + step; i++) {
        var x = i * step + (j % 2 ? step / 2 : 0), y = j * step;
        var dn = Math.max(0, Math.min(1, (fromRight ? (w - x) : x) / w * -1.2 + 1.15));
        if (hash(i + seed, j + seed * 3) > dn) continue;
        items.push({ x: x, y: y, d: dn });
      }
    }
    var order = items.slice();
    if (variant === 'b') order.sort(function (p, q) { return (fromRight ? q.x - p.x : p.x - q.x) || p.y - q.y; });
    else order.sort(function (p, q) { return q.d - p.d || p.x - q.x || p.y - q.y; });
    var svg = d.createElementNS(SVGNS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    var g = d.createElementNS(SVGNS, 'g');
    g.setAttribute('stroke', ink); g.setAttribute('stroke-width', '4'); g.setAttribute('stroke-linecap', 'round');
    var tb = [];
    for (var n = 0; n < GROUPS; n++) {
      tb.push(d.createElementNS(SVGNS, 'g'));
      tb[n].setAttribute('class', 'tb');
      tb[n].style.setProperty('--td', Math.round(n / (GROUPS - 1) * 760) + 'ms');
      g.appendChild(tb[n]);
    }
    // One path per group and opacity step: a few dozen nodes instead of hundreds.
    var paths = {};
    for (var k = 0; k < order.length; k++) {
      var it = order[k], op = (Math.round((0.35 + it.d * 0.65) * 10) / 10).toFixed(1);
      var key = Math.min(GROUPS - 1, Math.floor(k * GROUPS / order.length)) + ':' + op;
      paths[key] = (paths[key] || '') + 'M' + (it.x - hx).toFixed(1) + ' ' + (it.y + hy).toFixed(1) + 'L' + (it.x + hx).toFixed(1) + ' ' + (it.y - hy).toFixed(1);
    }
    for (var key2 in paths) {
      var p = d.createElementNS(SVGNS, 'path'), sep = key2.indexOf(':');
      p.setAttribute('d', paths[key2]);
      p.setAttribute('stroke-opacity', key2.slice(sep + 1));
      tb[+key2.slice(0, sep)].appendChild(p);
    }
    svg.appendChild(g);
    while (box.firstChild) box.removeChild(box.firstChild);
    box.appendChild(svg);
    box.classList.add('built');
  }
  var boxes = d.querySelectorAll('.trama-blk');
  if ('IntersectionObserver' in window) {
    var tio = new IntersectionObserver(function (es) {
      for (var i = 0; i < es.length; i++) if (es[i].isIntersecting) { trama(es[i].target, es[i].boundingClientRect); tio.unobserve(es[i].target); }
    }, { rootMargin: '600px 0px' });
    for (var b = 0; b < boxes.length; b++) tio.observe(boxes[b]);
  } else {
    for (var b2 = 0; b2 < boxes.length; b2++) trama(boxes[b2]);
  }
  var rt = 0;
  window.addEventListener('resize', function () {
    window.clearTimeout(rt);
    rt = window.setTimeout(function () { for (var i = 0; i < boxes.length; i++) if (boxes[i].getAttribute('data-w')) trama(boxes[i]); }, 200);
  }, { passive: true });

  /* ---------- section entrance (construction) ---------- */
  var sections = d.querySelectorAll('.apar');
  if (reduce || !('IntersectionObserver' in window)) {
    for (var s = 0; s < sections.length; s++) sections[s].classList.add('aparece');
  } else {
    var io = new IntersectionObserver(function (entries) {
      for (var e = 0; e < entries.length; e++) {
        var en = entries[e], el = en.target;
        if (en.isIntersecting) { el.classList.add('aparece'); continue; }
        if (en.boundingClientRect.top > 0) el.classList.remove('aparece');   // left below: rearm
        else { el.classList.add('aparece'); io.unobserve(el); }             // left above: stays built
      }
    }, { rootMargin: '0px 0px -8% 0px' });
    for (var t = 0; t < sections.length; t++) io.observe(sections[t]);
  }

  /* ---------- the diagram that runs: replay on hover and focus ---------- */
  var runs = d.querySelectorAll('[data-replay]');
  for (var r = 0; r < runs.length; r++) {
    (function (el) {
      var host = el.closest('.apar') || el, last = 0;
      function again() {
        if (reduce || !host.classList.contains('aparece')) return;
        var now = Date.now();
        if (now - last < 1400) return;
        last = now;
        replay(el);
      }
      el.addEventListener('mouseenter', again);
      el.addEventListener('focus', again);
    })(runs[r]);
  }

  /* ---------- LAB: replay buttons ---------- */
  var btns = d.querySelectorAll('[data-replay-target]');
  for (var q = 0; q < btns.length; q++) {
    btns[q].addEventListener('click', function () {
      var el = d.getElementById(this.getAttribute('data-replay-target'));
      if (!el) return;
      var tb = el.querySelectorAll('.trama-blk');
      for (var z = 0; z < tb.length; z++) { tb[z].removeAttribute('data-w'); trama(tb[z]); }
      replay(el);
    });
  }

  /* ---------- the mark: 7.5 contraction and spring on hover ---------- */
  (function () {
    var host = d.getElementById('brandMark');
    var lines = host ? host.querySelectorAll('line') : [];
    if (!host || lines.length !== 3 || reduce) return;
    var base = [], st = [];
    for (var i = 0; i < 3; i++) {
      var l = lines[i];
      base.push([+l.getAttribute('x1'), +l.getAttribute('y1'), +l.getAttribute('x2'), +l.getAttribute('y2')]);
      st.push({ s: 1, v: 0 });
    }
    var target = 1, raf = 0, MIN = 0.6;
    function frame() {
      raf = 0;
      var moving = false;
      for (var i = 0; i < 3; i++) {
        var c = st[i], k = target < c.s ? 0.34 : 0.13;
        c.v = (c.v + (target - c.s) * k) * 0.74;
        c.s += c.v;
        if (c.s > 1.06) c.s = 1.06;
        if (Math.abs(target - c.s) < 0.001 && Math.abs(c.v) < 0.001) { c.s = target; c.v = 0; } else moving = true;
        var p = base[i], mx = (p[0] + p[2]) / 2, my = (p[1] + p[3]) / 2;
        lines[i].setAttribute('x1', (mx + (p[0] - mx) * c.s).toFixed(1)); lines[i].setAttribute('y1', (my + (p[1] - my) * c.s).toFixed(1));
        lines[i].setAttribute('x2', (mx + (p[2] - mx) * c.s).toFixed(1)); lines[i].setAttribute('y2', (my + (p[3] - my) * c.s).toFixed(1));
      }
      if (moving) raf = window.requestAnimationFrame(frame);   // stops at rest: no idle frames
    }
    function go(t) { target = t; if (!raf) raf = window.requestAnimationFrame(frame); }
    host.addEventListener('mouseenter', function () { go(MIN); });
    host.addEventListener('mouseleave', function () { go(1); });
    host.addEventListener('focus', function () { go(MIN); window.setTimeout(function () { go(1); }, 260); });
  })();

  window.naindevMotion = { replay: replay, trama: trama };
})();

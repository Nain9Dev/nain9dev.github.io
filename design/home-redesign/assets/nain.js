/* ============================================================
   NainDev · comportamiento del prototipo (ronda 2, 14-10-2026)
   Reglas: sin librerías, sin peticiones de red, sin innerHTML con
   datos del visitante, sin manejadores en atributos, sin eval.
   Todo localStorage va dentro de try/catch y guarda datos, no HTML.
   ============================================================ */
(function () {
  'use strict';

  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* bloqueado: no pasa nada */ } },
    del: function (k) { try { window.localStorage.removeItem(k); } catch (e) { /* idem */ } }
  };
  var reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  function lang() { return document.documentElement.lang === 'en' ? 'en' : 'es'; }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  // Work for sections far below the fold waits until they come near (keeps the first load free of
  // long tasks on slow phones). Without IntersectionObserver it runs at once.
  function whenNear(id, fn) {
    var target = document.getElementById(id);
    if (!target) return;
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      fn();
    }, { rootMargin: '800px 0px' });
    io.observe(target);
  }

  /* ----------------------------------------------------------
     IDIOMA — en producción son dos rutas (/ y /en/). Aquí se
     conmuta en el sitio para revisar las dos versiones.
     ---------------------------------------------------------- */
  var langListeners = [];
  function setLang(l, persist) {
    if (l !== 'es' && l !== 'en') return;
    var root = document.documentElement;
    root.lang = l;
    var t = root.getAttribute('data-title-' + l);
    if (t) document.title = t;
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === l ? 'true' : 'false');
    });
    if (persist) store.set('naindev-lang', l);
    langListeners.forEach(function (fn) { fn(l); });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang'), true); });
  });
  var q = /[?&]lang=(es|en)\b/.exec(window.location.search);
  setLang(q ? q[1] : (store.get('naindev-lang') || 'es'), !!q);

  /* ----------------------------------------------------------
     MENÚ MÓVIL — diálogo modal: aria-expanded, foco atrapado,
     Esc cierra y el foco vuelve al botón que lo abrió.
     ---------------------------------------------------------- */
  (function () {
    var sheet = document.getElementById('sheet');
    var opener = document.getElementById('menuOpen');
    var closer = document.getElementById('menuClose');
    if (!sheet || !opener) return;
    var isOpen = false;
    function focusables() {
      return Array.prototype.filter.call(sheet.querySelectorAll('a[href],button:not([disabled])'),
        function (n) { return n.offsetParent !== null; });
    }
    function open() {
      isOpen = true;
      sheet.hidden = false;
      opener.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
      var cur = sheet.querySelector('nav a[aria-current="page"]') || sheet.querySelector('nav a');
      if (cur) cur.focus();
    }
    function close(returnFocus) {
      if (!isOpen) return;
      isOpen = false;
      sheet.hidden = true;
      opener.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      if (returnFocus !== false) opener.focus();
    }
    opener.addEventListener('click', open);
    if (closer) closer.addEventListener('click', function () { close(); });
    sheet.querySelectorAll('nav a, .foot a').forEach(function (a) {
      a.addEventListener('click', function () { close(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (!isOpen) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      var f = focusables();
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || !sheet.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !sheet.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
    });
    window.matchMedia('(min-width: 981px)').addEventListener('change', function (m) { if (m.matches) close(false); });
    window.naindevMenu = { open: open, close: close };
  })();

  /* ----------------------------------------------------------
     EL CAMPO DE TRAZOS — la única superficie animada.
     Canvas 2D, sin librerías. Se detiene fuera de pantalla y con
     la pestaña oculta; con movimiento reducido pinta un fotograma.
     ---------------------------------------------------------- */
  (function () {
    var cv = document.getElementById('field');
    if (!cv || !cv.getContext) return;
    var ctx = cv.getContext('2d', { alpha: true });
    var out = document.getElementById('breakCount');
    var host = cv.parentNode;
    // ?vivo=0 stops the living surface (addendum 1.1, section 7) to compare the page without it.
    var still0 = /[?&]vivo=0\b/.test(window.location.search);
    var reduce = reduceMQ.matches || still0;

    var ANG = -52 * Math.PI / 180, DX = Math.cos(ANG), DY = Math.sin(ANG);
    var LEN = 30, W = 0, H = 0, STEP = 26, cells = [], t = 0, mx = -9999, my = -9999, ripples = [], broken = 0, shown = 0;
    var R = 210, MIN = 0.18;
    var raf = 0, onScreen = true, last = 0, active = false;

    function hash(i, j) { var n = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return n - Math.floor(n); }
    function build() {
      // DPR capped at 2, and at 1.5 on narrow screens: the strokes stay sharp and rasterising costs less.
      var dpr = Math.min(window.innerWidth < 760 ? 1 : 2, window.devicePixelRatio || 1);
      W = cv.clientWidth; H = cv.clientHeight;
      STEP = W < 760 ? 30 : 26;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cells.length = 0;
      for (var j = 0; j * STEP < H + STEP; j++) {
        for (var i = 0; i * STEP < W + STEP; i++) {
          cells.push({ x: i * STEP + ((j % 2) ? STEP / 2 : 0), y: j * STEP, h: hash(i, j), s: 1, v: 0 });
        }
      }
    }
    // Los trazos se agrupan por opacidad (11 niveles): un trazado y un stroke() por nivel en lugar de
    // uno por trazo. Solo los trazos que toca el halo del clic se pintan sueltos, en rojo.
    var BUCKETS = 11, paths = [];
    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = 'round';
      ctx.lineWidth = 4;
      var hx = DX * LEN / 2, hy = DY * LEN / 2, n = 0, hot = [];
      for (var bI = 0; bI < BUCKETS; bI++) paths[bI] = [];
      for (var k = 0; k < cells.length; k++) {
        var c = cells[k];
        var wave = reduce ? 0 : 0.17 * Math.sin(c.x * 0.0055 + c.y * 0.004 + t * 0.55);
        var d = (c.x / W) * 1.15 - 0.04 + wave;
        if (d < 0) d = 0; else if (d > 1) d = 1;
        if (c.h > d) continue;
        var push = 0, heat = 0;
        if (!reduce) {
          if (active) {
            var dx = c.x - mx, dy = c.y - my, d2 = dx * dx + dy * dy;
            if (d2 < R * R) { var u = 1 - Math.sqrt(d2) / R; push = u * u * (3 - 2 * u); }
            for (var r = 0; r < ripples.length; r++) {
              var Rp = ripples[r], rdx = c.x - Rp.x, rdy = c.y - Rp.y;
              var rd = Math.abs(Math.sqrt(rdx * rdx + rdy * rdy) - Rp.r);
              if (rd < 52) { var pv = (1 - rd / 52) * Rp.a, hv = pv * 1.9; if (pv > push) push = pv; if (hv > heat) heat = hv; }
            }
          }
          if (push > 0 || c.s !== 1 || c.v !== 0) {
            var target = 1 - (1 - MIN) * push;
            c.v += (target - c.s) * (target < c.s ? 0.34 : 0.13);
            c.v *= 0.74;
            c.s += c.v;
            if (c.s < MIN * 0.9) c.s = MIN * 0.9;
            if (c.s > 1.06) c.s = 1.06;
            if (Math.abs(c.s - 1) < 0.002 && Math.abs(c.v) < 0.002) { c.s = 1; c.v = 0; }
            if (c.s < 0.92) n++;
          }
        }
        var op = 0.26 + d * 0.74;
        var ob = op + (1 - op) * (1 - c.s) * 1.4; if (ob > 1) ob = 1;
        var x1 = c.x - hx * c.s, y1 = c.y - hy * c.s, x2 = c.x + hx * c.s, y2 = c.y + hy * c.s;
        if (heat > 0.02) hot.push(x1, y1, x2, y2, heat > 1 ? 1 : heat, ob);
        else paths[Math.round(ob * (BUCKETS - 1))].push(x1, y1, x2, y2);
      }
      ctx.strokeStyle = '#80FF00';
      for (var q = 1; q < BUCKETS; q++) {
        var pp = paths[q];
        if (!pp.length) continue;
        ctx.globalAlpha = q / (BUCKETS - 1);
        ctx.beginPath();
        for (var i = 0; i < pp.length; i += 4) { ctx.moveTo(pp[i], pp[i + 1]); ctx.lineTo(pp[i + 2], pp[i + 3]); }
        ctx.stroke();
      }
      for (var h = 0; h < hot.length; h += 6) {
        var kh = hot[h + 4];
        ctx.globalAlpha = hot[h + 5];
        ctx.strokeStyle = 'rgb(' + Math.round(128 + 127 * kh) + ',' + Math.round(255 - 255 * kh) + ',' + Math.round(31 * kh) + ')';
        ctx.beginPath(); ctx.moveTo(hot[h], hot[h + 1]); ctx.lineTo(hot[h + 2], hot[h + 3]); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      broken = n;
    }
    // Sin interacción el campo solo respira (onda de 0,55 rad/s): basta con 20 fotogramas por segundo.
    var skip = 0;
    function frame(ts) {
      raf = 0;
      if (!active && broken === 0) { skip = (skip + 1) % 3; if (skip) { schedule(); return; } }
      var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016;
      last = ts;
      t += dt;
      for (var i = ripples.length - 1; i >= 0; i--) {
        ripples[i].r += 480 * dt; ripples[i].a -= 0.66 * dt;
        if (ripples[i].a <= 0) ripples.splice(i, 1);
      }
      if (!ripples.length && mx < -999) active = false;
      draw();
      if (out) { shown += (broken - shown) * 0.18; out.textContent = ('000' + Math.round(shown)).slice(-4); }
      schedule();
    }
    function running() { return !reduce && onScreen && !document.hidden; }
    function schedule() { if (!raf && running()) raf = window.requestAnimationFrame(frame); }
    function stop() { if (raf) { window.cancelAnimationFrame(raf); raf = 0; } last = 0; }
    function still() { stop(); build(); draw(); if (out) out.textContent = '0000'; }

    // First paint goes out without the canvas work: layout is settled by then, so reading the size
    // forces nothing, and the build runs in its own task.
    window.requestAnimationFrame(function () {
      window.setTimeout(function () { build(); if (reduce) draw(); else schedule(); }, 0);
    });

    window.addEventListener('resize', function () { build(); if (!running()) draw(); }, { passive: true });
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else schedule(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[0].isIntersecting;
        if (onScreen) schedule(); else stop();
      }).observe(cv);
    }
    reduceMQ.addEventListener('change', function (m) { reduce = m.matches || still0; if (reduce) still(); else schedule(); });
    host.addEventListener('pointermove', function (e) {
      var r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; active = true;
    }, { passive: true });
    host.addEventListener('pointerleave', function () { mx = -9999; my = -9999; active = ripples.length > 0; }, { passive: true });
    host.addEventListener('pointerdown', function (e) {
      if (reduce) return;
      var r = cv.getBoundingClientRect();
      if (ripples.length < 4) ripples.push({ x: e.clientX - r.left, y: e.clientY - r.top, r: 0, a: 1 });
      active = true;
    }, { passive: true });
    window.naindevField = { running: function () { return !!raf; } };
  })();

  /* ----------------------------------------------------------
     LA CONSOLA — solo stack, servicios y contacto, con el mismo
     texto que la página. La entrada del visitante se pinta con
     textContent. El historial guarda comandos (JSON), no HTML, y
     la salida se reconstruye a partir de ellos.
     ---------------------------------------------------------- */
  whenNear('termOut', function () {
    var out = document.getElementById('termOut'), inp = document.getElementById('termIn'), chips = document.getElementById('termChips'),
      term = document.getElementById('term');
    if (!out || !inp) return;
    var KEY = 'naindev-console';
    var MAX = 20;
    var CAL = 'https://calendly.com/aitornainmendozavallejo-ksez/30min';
    var LI = 'https://www.linkedin.com/in/aitor-nain-mendoza-vallejo/';

    // Una línea es una lista de piezas: texto plano, {b:texto}, {m:texto} o {a:url, t:texto}.
    var D = {
      es: {
        banner: [[{ b: 'naindev · consola del sitio' }],
                 [{ m: 'Escribe ' }, { b: 'ayuda' }, { m: ' para ver los comandos. ↑ recupera el anterior y Tab completa.' }]],
        help: [['stack', 'Con qué trabajo, por áreas'], ['servicios', 'Las tres familias de servicios'],
               ['contacto', 'Llamada, correo y LinkedIn'], ['ir <sección>', 'Salta a esa sección de la página'],
               ['limpiar', 'Limpia la consola y su historial']],
        stack: [[{ b: '>> BACKEND & DATOS' }], ['- Python (FastAPI, Pydantic v2, SQLAlchemy) y C# (.NET, ASP.NET)'], ['- PostgreSQL y SQL Server'],
                [{ b: '>> FRONTEND' }], ['- Vue 3, TypeScript, Tailwind CSS, Astro y Three.js'],
                [{ b: '>> IA & OPS' }], ['- MCP con humano en el bucle'], ['- Docker, GitHub Actions, Linux y Azure']],
        servicios: [[{ b: '01 · Conformidad determinista y 3D' }],
                    ['Arquitectura multidominio que valida cada producto contra especificaciones versionadas. El primer dominio son los modelos 3D.'],
                    [{ b: '02 · IA generativa con revisión humana' }],
                    ['Ecosistemas agénticos robustos para integrar modelos de IA en flujos corporativos.'],
                    [{ b: '03 · Backend crítico en Python y .NET' }],
                    ['Sistemas de misión crítica donde la consistencia del dato es innegociable, sobre PostgreSQL y SQL Server.'],
                    [{ m: 'Quince páginas de servicio en total. Escribe ' }, { b: 'ir servicios' }, { m: ' para verlas.' }]],
        contacto: [[{ m: 'Llamada   ' }, { a: CAL, t: 'Agendar llamada gratuita (Calendly)' }],
                   [{ m: 'Email     ' }, { a: 'mailto:contact@naindev.com', t: 'contact@naindev.com' }],
                   [{ m: 'LinkedIn  ' }, { a: LI, t: 'linkedin.com/in/aitor-nain-mendoza-vallejo' }],
                   ['Acepto proyectos a tiempo parcial y en remoto para empresas de cualquier país.']],
        nf: 'comando no encontrado: ', nfHint: 'escribe ayuda para ver la lista',
        go: 'saltando a ', nogo: 'esa sección no existe. secciones: ',
        prompt: 'escribe ayuda y pulsa intro'
      },
      en: {
        banner: [[{ b: 'naindev · site console' }],
                 [{ m: 'Type ' }, { b: 'help' }, { m: ' for the commands. ↑ recalls the last one and Tab completes.' }]],
        help: [['stack', 'What I work with, by area'], ['services', 'The three service families'],
               ['contact', 'Call, email and LinkedIn'], ['go <section>', 'Jump to that section of the page'],
               ['clear', 'Clear the console and its history']],
        stack: [[{ b: '>> BACKEND & DATA' }], ['- Python (FastAPI, Pydantic v2, SQLAlchemy) and C# (.NET, ASP.NET)'], ['- PostgreSQL and SQL Server'],
                [{ b: '>> FRONTEND' }], ['- Vue 3, TypeScript, Tailwind CSS, Astro and Three.js'],
                [{ b: '>> AI & OPS' }], ['- MCP with human-in-the-loop'], ['- Docker, GitHub Actions, Linux and Azure']],
        servicios: [[{ b: '01 · Deterministic conformance and 3D' }],
                    ['A multi-domain architecture that validates each product against versioned specifications. The first domain is 3D models.'],
                    [{ b: '02 · Generative AI with human review' }],
                    ['Robust agentic ecosystems to integrate AI models into corporate workflows.'],
                    [{ b: '03 · Critical backend in Python and .NET' }],
                    ['Mission-critical systems where data consistency is non-negotiable, on PostgreSQL and SQL Server.'],
                    [{ m: 'Fifteen service pages in total. Type ' }, { b: 'go services' }, { m: ' to see them.' }]],
        contacto: [[{ m: 'Call      ' }, { a: CAL, t: 'Book a free call (Calendly)' }],
                   [{ m: 'Email     ' }, { a: 'mailto:contact@naindev.com', t: 'contact@naindev.com' }],
                   [{ m: 'LinkedIn  ' }, { a: LI, t: 'linkedin.com/in/aitor-nain-mendoza-vallejo' }],
                   ['I take on part-time, remote projects for companies in any country.']],
        nf: 'command not found: ', nfHint: 'type help for the list',
        go: 'jumping to ', nogo: 'no such section. sections: ',
        prompt: 'type help and press enter'
      }
    };
    var ALIAS = { ayuda: 'help', help: 'help', '?': 'help', stack: 'stack', servicios: 'servicios', services: 'servicios',
                  contacto: 'contacto', contact: 'contacto', limpiar: 'clear', clear: 'clear', cls: 'clear' };
    var SEC = { problema: 'problema', problem: 'problema', servicios: 'servicios', services: 'servicios',
                metodo: 'metodo', 'método': 'metodo', method: 'metodo', proyectos: 'proyectos', projects: 'proyectos',
                casos: 'casos', cases: 'casos', escritos: 'escritos', writing: 'escritos', checklist: 'checklist',
                consola: 'consola', console: 'consola', sobre: 'sobre', about: 'sobre', contacto: 'contacto', contact: 'contacto' };
    var SEC_LIST = { es: 'problema, servicios, metodo, proyectos, casos, escritos, checklist, consola, sobre, contacto',
                     en: 'problem, services, method, projects, cases, writing, checklist, console, about, contact' };

    var hist = [], hp = -1;
    function load() {
      var raw = store.get(KEY);
      if (!raw) return [];
      try {
        var d = JSON.parse(raw);
        if (!d || d.v !== 1 || !Array.isArray(d.cmds)) return [];
        return d.cmds.filter(function (c) { return typeof c === 'string' && c.length <= 80; }).slice(-MAX);
      } catch (e) { return []; }
    }
    function save() { store.set(KEY, JSON.stringify({ v: 1, cmds: hist.slice(-MAX) })); }

    function piece(p) {
      if (typeof p === 'string') return document.createTextNode(p);
      if (p.b != null) return el('b', null, p.b);
      if (p.m != null) return el('span', 'mut', p.m);
      if (p.a) {
        var a = el('a', null, p.t);
        a.href = p.a;
        if (/^https:/.test(p.a)) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
        return a;
      }
      return document.createTextNode('');
    }
    function line(parts, cls) {
      var d = el('div', cls || null);
      parts.forEach(function (p) { d.appendChild(piece(p)); });
      out.appendChild(d);
    }
    function blank() { line([' ']); }
    function scrollEnd() { out.scrollTop = out.scrollHeight; }
    function banner() {
      while (out.firstChild) out.removeChild(out.firstChild);
      D[lang()].banner.forEach(function (x) { line(x); });
      blank();
      D[lang()].help.forEach(function (h) { line([{ b: h[0] }, { m: h[1] }], 'trow'); });
      blank();
    }
    function echo(raw) {
      var d = el('div');
      d.appendChild(el('span', 'mut', '[aitor@naindev ~]$ '));
      d.appendChild(el('span', 'cmd', raw));          // textContent: lo escrito se ve, no se interpreta
      out.appendChild(d);
    }
    function run(raw, replay) {
      var t = String(raw).trim().slice(0, 80);
      if (!t) return;
      echo(t);
      var parts = t.toLowerCase().split(/\s+/), c = parts[0], arg = parts[1] || '';
      var d = D[lang()];
      if (c === 'ir' || c === 'go' || c === 'cd') {
        var id = SEC[arg];
        if (id && document.getElementById(id)) {
          line([{ m: d.go }, { b: arg }]);
          if (!replay) document.getElementById(id).scrollIntoView({ behavior: reduceMQ.matches ? 'auto' : 'smooth' });
        } else {
          line([{ m: d.nogo + SEC_LIST[lang()] }]);
        }
      } else {
        var key = ALIAS[c];
        if (key === 'clear') { hist = []; save(); banner(); return; }
        if (key === 'help') d.help.forEach(function (h) { line([{ b: h[0] }, { m: h[1] }], 'trow'); });
        else if (key && d[key]) d[key].forEach(function (x) { line(x); });
        else { line([{ m: d.nf }, c]); line([{ m: d.nfHint }]); }
      }
      blank();
      scrollEnd();
    }
    function rebuild() {
      banner();
      hist.forEach(function (c) { run(c, true); });
      scrollEnd();
    }
    function buildChips() {
      while (chips.firstChild) chips.removeChild(chips.firstChild);
      D[lang()].help.forEach(function (h) {
        var name = h[0].split(' ')[0];
        if (name === 'ir' || name === 'go') return;
        var b = el('button', 'chip', name);
        b.type = 'button';
        b.addEventListener('click', function () { submit(name); inp.focus(); });
        chips.appendChild(b);
      });
    }
    function submit(v) {
      v = String(v).trim().slice(0, 80);
      if (!v) return;
      var isClear = ALIAS[v.toLowerCase()] === 'clear';
      run(v, false);
      if (!isClear) { hist.push(v); if (hist.length > MAX) hist.shift(); save(); }
      hp = -1;
    }
    inp.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' || e.isComposing) return;
      e.preventDefault(); submit(inp.value); inp.value = '';
    });
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowUp') {
        if (hist.length) { hp = Math.min(hp + 1, hist.length - 1); inp.value = hist[hist.length - 1 - hp]; }
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        if (hp > 0) { hp--; inp.value = hist[hist.length - 1 - hp]; } else { hp = -1; inp.value = ''; }
        e.preventDefault();
      } else if (e.key === 'Tab') {
        var v = inp.value.trim().toLowerCase();
        if (!v) return;
        var all = Object.keys(ALIAS).filter(function (k) { return k.indexOf(v) === 0; });
        if (all.length) { inp.value = all[0]; e.preventDefault(); }
      }
    });
    if (term) term.addEventListener('click', function (e) {
      if (e.target.closest('a') || (window.getSelection && String(window.getSelection()))) return;
      inp.focus({ preventScroll: true });
    });
    function placeholder() { inp.placeholder = D[lang()].prompt; }

    hist = load();
    rebuild(); buildChips(); placeholder();
    langListeners.push(function () { rebuild(); buildChips(); placeholder(); });
    window.naindevConsole = { run: submit };
  });

  /* ----------------------------------------------------------
     PROYECTOS — filtros y "ver todos". Sin JavaScript se ven
     todos los proyectos y no aparecen los controles.
     ---------------------------------------------------------- */
  whenNear('projList', function () {
    var list = document.getElementById('projList');
    if (!list) return;
    var bar = document.querySelector('.pfilters');
    var more = document.getElementById('projMore');
    var count = document.getElementById('projCount');
    var cards = Array.prototype.slice.call(list.querySelectorAll('[data-cats]'));
    var filter = 'all', expanded = false;
    function apply() {
      var shown = 0;
      cards.forEach(function (c) {
        var cats = (c.getAttribute('data-cats') || '').split(' ');
        var match = filter === 'all' || cats.indexOf(filter) >= 0;
        var visible = match && (expanded || filter !== 'all' || !c.hasAttribute('data-extra'));
        c.hidden = !visible;
        if (visible) shown++;
      });
      if (count) count.textContent = lang() === 'en' ? shown + ' of ' + cards.length + ' projects' : shown + ' de ' + cards.length + ' proyectos';
      if (more) {
        more.hidden = expanded || filter !== 'all';
        more.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      }
    }
    if (bar) {
      bar.hidden = false;
      bar.querySelectorAll('[data-filter]').forEach(function (b) {
        b.addEventListener('click', function () {
          filter = b.getAttribute('data-filter');
          bar.querySelectorAll('[data-filter]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
          apply();
        });
      });
    }
    if (more) more.addEventListener('click', function () {
      expanded = true; apply();
      var first = cards.filter(function (c) { return c.hasAttribute('data-extra'); })[0];
      if (first) { first.setAttribute('tabindex', '-1'); first.focus(); }
    });
    langListeners.push(apply);
    apply();
  });

  /* ----------------------------------------------------------
     AVISO DE PRIVACIDAD — se cierra y se recuerda en este
     navegador. Sin almacenamiento disponible, vuelve a salir.
     ---------------------------------------------------------- */
  (function () {
    var b = document.getElementById('pbanner'), x = document.getElementById('pbannerClose');
    if (!b) return;
    function hide() { b.hidden = true; document.body.classList.remove('has-banner'); }
    if (store.get('naindev-privacy-closed') === '1' && !/[?&]banner=1\b/.test(window.location.search)) { hide(); return; }
    document.body.classList.add('has-banner');
    if (x) x.addEventListener('click', function () { hide(); store.set('naindev-privacy-closed', '1'); });
  })();
})();

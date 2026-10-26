/* Runs before the first paint (brandbook v2.0, chapter 03 · Las dos expresiones).
   Deep blue is the default. Paper applies when the system prefers light and the visitor made no
   choice, or when the visitor chose it with the header switch. The choice is stored under "theme",
   the key main already uses (ADR-0014), and storage is only touched inside try/catch: with storage
   blocked, the system preference decides. CSS does the same without JavaScript (prefers-color-scheme).
   ES5 on purpose (iOS 15). */
(function (d, w) {
  var root = d.documentElement, KEY = 'theme';
  root.className += (root.className ? ' ' : '') + 'js-theme';   // the switch shows only when this ran
  var mq = w.matchMedia ? w.matchMedia('(prefers-color-scheme: light)') : null;

  function stored() {
    try { var v = w.localStorage.getItem(KEY); return v === 'light' || v === 'dark' ? v : null; }
    catch (e) { return null; }
  }
  function effective() { return stored() || (mq && mq.matches ? 'light' : 'dark'); }
  function store(v) { try { w.localStorage.setItem(KEY, v); } catch (e) { /* blocked: this page only */ } }

  var chosen = null;   // the choice of this page view, kept even if storage is blocked
  function apply() {
    var c = chosen || stored(), t = c || effective();
    if (c) root.setAttribute('data-theme', c); else root.removeAttribute('data-theme');
    var i, icon = d.getElementById('favicon');
    if (icon) icon.setAttribute('href', icon.getAttribute('href').replace(/favicon-(deep|paper)/, 'favicon-' + (t === 'light' ? 'paper' : 'deep')));
    var bar = d.getElementById('themeColor');
    if (bar) bar.setAttribute('content', t === 'light' ? '#EDF1F6' : '#070B16');
    var btns = d.querySelectorAll('[data-theme-toggle]');
    for (i = 0; i < btns.length; i++) btns[i].setAttribute('aria-pressed', t === 'light' ? 'true' : 'false');
    return t;
  }
  apply();

  if (mq && mq.addEventListener) mq.addEventListener('change', function () { if (!chosen && !stored()) apply(); });

  function wire() {
    var btns = d.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        var next = (chosen || stored() || effective()) === 'light' ? 'dark' : 'light';
        chosen = next;
        store(next);
        apply();
      });
    }
    apply();
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', wire); else wire();

  w.naindevTheme = { get: function () { return chosen || stored() || effective(); } };
})(document, window);

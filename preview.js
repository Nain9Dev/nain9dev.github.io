/* Language of the review index, set before the first paint. It uses the prototype's own key
   ("naindev-lang", see site/assets/nain.js), so the pages open in the language chosen here and
   this index opens in the language chosen there. ?lang=es|en wins and is stored, like on the pages.
   Storage is only touched inside try/catch: with storage blocked, Spanish is the default.
   ES5 on purpose, like theme.js (iOS 15). */
(function (d, w) {
  var root = d.documentElement, KEY = 'naindev-lang';

  function stored() {
    try { var v = w.localStorage.getItem(KEY); return v === 'es' || v === 'en' ? v : null; }
    catch (e) { return null; }
  }
  function store(v) { try { w.localStorage.setItem(KEY, v); } catch (e) { /* blocked: this view only */ } }

  function apply(l) {
    root.lang = l;
    var t = root.getAttribute('data-title-' + l);
    if (t) d.title = t;
    var i, btns = d.querySelectorAll('[data-lang]');
    for (i = 0; i < btns.length; i++) btns[i].setAttribute('aria-pressed', btns[i].getAttribute('data-lang') === l ? 'true' : 'false');
  }

  var q = /[?&]lang=(es|en)\b/.exec(w.location.search);
  var lang = q ? q[1] : (stored() || 'es');
  if (q) store(lang);
  apply(lang);

  function wire() {
    var btns = d.querySelectorAll('[data-lang]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        lang = this.getAttribute('data-lang');
        store(lang);
        apply(lang);
      });
    }
    apply(lang);
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', wire); else wire();
})(document, window);

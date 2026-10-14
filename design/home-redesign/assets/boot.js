/* Runs before first paint. Marks the document for construction motion unless the visitor asked for
   reduced motion. If motion.js never arrives, the mark is removed so nothing stays hidden. */
(function (d) {
  var root = d.documentElement;
  if (!window.matchMedia || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.classList.add('mo');
  try {
    if (!window.sessionStorage.getItem('naindev-mark')) { root.classList.add('mk-build'); window.sessionStorage.setItem('naindev-mark', '1'); }
  } catch (e) { /* storage blocked: no first-visit build */ }
  window.setTimeout(function () { if (!window.naindevMotion) root.classList.remove('mo'); }, 3000);
})(document);

/* Runs before first paint. Marks the document for construction motion unless the visitor asked for
   reduced motion. If motion.js never arrives, the mark is removed so nothing stays hidden. */
(function (d) {
  var root = d.documentElement;
  // Fetch the three fonts before the first layout, so text is not laid out twice. Not from disk:
  // file:// has no CORS and the preload would only print errors (the @font-face still loads them).
  if (window.location.protocol !== 'file:') {
    var f = ['urbanist-latin-300-600', 'ibm-plex-mono-latin-500', 'ibm-plex-mono-latin-400'];
    for (var i = 0; i < f.length; i++) {
      var l = d.createElement('link');
      l.rel = 'preload'; l.as = 'font'; l.type = 'font/woff2'; l.crossOrigin = 'anonymous';
      l.href = 'assets/fonts/' + f[i] + '.woff2';
      d.head.appendChild(l);
    }
  }
  if (!window.matchMedia || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.classList.add('mo');
  try {
    if (!window.sessionStorage.getItem('naindev-mark')) { root.classList.add('mk-build'); window.sessionStorage.setItem('naindev-mark', '1'); }
  } catch (e) { /* storage blocked: no first-visit build */ }
  window.setTimeout(function () { if (!window.naindevMotion) root.classList.remove('mo'); }, 3000);
})(document);

/**
 * Lazy loads the MailerLite scripts (or any script/iframe) when they enter the viewport.
 * Reduces initial page load weight.
 */
export function initializeLazyLoading() {
  const lazyElements = document.querySelectorAll('.ml-subscribe-form, [data-lazy-load]');

  if (lazyElements.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        
        // Si hay un script de MailerLite pendiente de cargar
        const scriptId = 'mailerlite-script';
        if (!document.getElementById(scriptId)) {
          console.log('[NainDev] Lazy loading MailerLite script...');
          const script = document.createElement('script');
          script.id = scriptId;
          script.defer = true;
          // URL genérica de MailerLite (Universal)
          script.src = "https://assets.mailerlite.com/js/universal.js";
          document.body.appendChild(script);
        }

        // Si el contenedor tiene iframes o imágenes con data-src, los cargamos
        const lazyMedia = target.querySelectorAll('[data-src]');
        lazyMedia.forEach(media => {
          media.src = media.getAttribute('data-src');
          media.removeAttribute('data-src');
        });

        // Dejamos de observar este elemento
        obs.unobserve(target);
      }
    });
  }, {
    rootMargin: '100px', // Cargar 100px antes de que entre en pantalla
    threshold: 0.1
  });

  lazyElements.forEach(el => observer.observe(el));
}

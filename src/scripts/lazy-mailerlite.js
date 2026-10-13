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
        
        // Inject MailerLite script when needed
        const scriptId = 'mailerlite-script';
        if (!document.getElementById(scriptId)) {
          console.log('[NainDev] Lazy loading MailerLite script...');
          const script = document.createElement('script');
          script.id = scriptId;
          script.defer = true;
          // Generic MailerLite Universal script URL
          script.src = "https://assets.mailerlite.com/js/universal.js";
          document.body.appendChild(script);
        }

        // Hydrate lazy iframes or media with data-src attributes
        const lazyMedia = target.querySelectorAll('[data-src]');
        lazyMedia.forEach(media => {
          media.src = media.getAttribute('data-src');
          media.removeAttribute('data-src');
        });

        // Unobserve target element after hydration
        obs.unobserve(target);
      }
    });
  }, {
    rootMargin: '100px', // Load 100px before entering viewport
    threshold: 0.1
  });

  lazyElements.forEach(el => observer.observe(el));
}

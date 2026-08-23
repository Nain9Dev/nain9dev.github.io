export function initializeScrollTracking() {
  const marks = {
    '25%': false,
    '50%': false,
    '75%': false,
    '100%': false
  };

  let ticking = false;

  const trackScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Si la página no tiene scroll, no trackeamos
    if (documentHeight <= 0) return;

    // Calcular el porcentaje (evitando picos superiores al 100% por overscroll en Mac/Móviles)
    const scrollPercentage = Math.min((scrollY / documentHeight) * 100, 100);

    checkThreshold(scrollPercentage, 25, '25%');
    checkThreshold(scrollPercentage, 50, '50%');
    checkThreshold(scrollPercentage, 75, '75%');
    checkThreshold(scrollPercentage, 99, '100%'); // Umbral al 99% por imprecisión decimal al fondo

    if (marks['100%']) {
      window.removeEventListener('scroll', onScroll);
    }
  };

  const checkThreshold = (percentage, threshold, label) => {
    if (percentage >= threshold && !marks[label]) {
      marks[label] = true;
      if (window.plausible) {
        window.plausible('Scroll Depth', { props: { depth: label } });
      }
    }
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        trackScroll();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

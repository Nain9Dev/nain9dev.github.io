export function initializeScrollTracking() {
  const marks = {
    '25%': false,
    '50%': false,
    '75%': false,
    '100%': false
  };

  let ticking = false;
  let requestFrameId = null;

  const trackScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if (documentHeight <= 0) return;

    const scrollPercentage = Math.min((scrollY / documentHeight) * 100, 100);

    checkThreshold(scrollPercentage, 25, '25%');
    checkThreshold(scrollPercentage, 50, '50%');
    checkThreshold(scrollPercentage, 75, '75%');
    checkThreshold(scrollPercentage, 99, '100%');

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
      requestFrameId = window.requestAnimationFrame(() => {
        trackScroll();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  return () => {
    window.removeEventListener('scroll', onScroll);
    if (requestFrameId) cancelAnimationFrame(requestFrameId);
  };
}

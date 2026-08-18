export function initializeScrollStorytelling() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const parallaxElements = document.querySelectorAll("[data-parallax='true']");
  let scrollY = window.scrollY;
  let ticking = false;

  function updateParallax() {
    parallaxElements.forEach((el) => {
      const speed = parseFloat(el.dataset.parallaxSpeed) || 0.05;
      const yPos = -(scrollY * speed);
      el.style.transform = `translateY(${yPos}px)`;
    });
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    scrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  // Initial update
  updateParallax();
}

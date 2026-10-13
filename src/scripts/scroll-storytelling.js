import { hasHardwareAcceleration } from "./hardware-acceleration.js";

export function initializeScrollStorytelling() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion || !hasHardwareAcceleration()) return () => {};

  const parallaxElements = document.querySelectorAll("[data-parallax='true']");
  if (!parallaxElements.length) return () => {};

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

  const onScroll = () => {
    scrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });

  // Initial update
  updateParallax();

  return () => {
    window.removeEventListener("scroll", onScroll);
    parallaxElements.forEach((el) => {
      el.style.transform = '';
    });
  };
}

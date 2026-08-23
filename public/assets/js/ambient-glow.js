export function initializeAmbientGlow() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const root = document.documentElement;
  let mouseX = 0;
  let mouseY = 0;
  let isUpdating = false;

  function updateGlowPosition() {
    root.style.setProperty('--mouse-x', `${mouseX}px`);
    root.style.setProperty('--mouse-y', `${mouseY}px`);
    isUpdating = false;
  }

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isUpdating) {
      isUpdating = true;
      requestAnimationFrame(updateGlowPosition);
    }
  }, { passive: true });
}

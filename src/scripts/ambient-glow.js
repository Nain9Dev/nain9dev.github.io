import { hasHardwareAcceleration } from './hardware-acceleration.js';

export function initializeAmbientGlow() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  if (prefersReducedMotion || !hasHardwareAcceleration() || isTouchDevice) return () => {};

  const root = document.documentElement;
  let mouseX = 0;
  let mouseY = 0;
  let isUpdating = false;

  function updateGlowPosition() {
    root.style.setProperty('--mouse-x', `${mouseX}px`);
    root.style.setProperty('--mouse-y', `${mouseY}px`);
    isUpdating = false;
  }

  const onMouseMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isUpdating) {
      isUpdating = true;
      requestAnimationFrame(updateGlowPosition);
    }
  };

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  return () => {
    window.removeEventListener('mousemove', onMouseMove);
  };
}

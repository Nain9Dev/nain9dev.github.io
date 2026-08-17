export function initializeCardTilt() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const container = document.querySelector('[data-project-list]');
  if (!container) return;

  let activeCard = null;
  let isUpdating = false;
  let mouseX = 0;
  let mouseY = 0;

  function updateTilt() {
    if (!activeCard) {
      isUpdating = false;
      return;
    }

    const rect = activeCard.getBoundingClientRect();
    const x = mouseX - rect.left;
    const y = mouseY - rect.top;

    // Calculate rotation between -3 and 3 degrees
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;

    activeCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    isUpdating = false;
  }

  container.addEventListener('mousemove', (e) => {
    const card = e.target.closest('[data-project-card]');
    if (!card) return;

    if (activeCard !== card) {
      if (activeCard) {
        activeCard.style.transform = '';
      }
      activeCard = card;
      activeCard.style.willChange = 'transform';
      activeCard.style.transition = 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)';
    }

    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isUpdating) {
      isUpdating = true;
      requestAnimationFrame(updateTilt);
    }
  }, { passive: true });

  container.addEventListener('mouseleave', (e) => {
    if (activeCard) {
      activeCard.style.transform = '';
      activeCard.style.willChange = 'auto';
      activeCard = null;
    }
  }, { passive: true });

  // Also clear on mouseleave of individual cards just to be safe if they move fast
  container.addEventListener('mouseout', (e) => {
    const card = e.target.closest('[data-project-card]');
    if (card && !card.contains(e.relatedTarget)) {
      card.style.transform = '';
      card.style.willChange = 'auto';
      if (activeCard === card) activeCard = null;
    }
  }, { passive: true });
}

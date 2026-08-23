export function initializeCardTilt() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return () => {};

  const container = document.querySelector('[data-project-list]');
  if (!container) return () => {};

  let activeCard = null;
  let isUpdating = false;
  let mouseX = 0;
  let mouseY = 0;
  let requestFrameId = null;

  function updateTilt() {
    if (!activeCard) {
      isUpdating = false;
      return;
    }

    const rect = activeCard.getBoundingClientRect();
    const x = mouseX - rect.left;
    const y = mouseY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;

    activeCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    activeCard.style.setProperty('--card-mouse-x', `${x}px`);
    activeCard.style.setProperty('--card-mouse-y', `${y}px`);
    isUpdating = false;
  }

  const onMouseMove = (e) => {
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
      requestFrameId = requestAnimationFrame(updateTilt);
    }
  };

  const onMouseLeave = (e) => {
    if (activeCard) {
      activeCard.style.transform = '';
      activeCard.style.willChange = 'auto';
      activeCard.style.removeProperty('--card-mouse-x');
      activeCard.style.removeProperty('--card-mouse-y');
      activeCard = null;
    }
  };

  const onMouseOut = (e) => {
    const card = e.target.closest('[data-project-card]');
    if (card && !card.contains(e.relatedTarget)) {
      card.style.transform = '';
      card.style.willChange = 'auto';
      card.style.removeProperty('--card-mouse-x');
      card.style.removeProperty('--card-mouse-y');
      if (activeCard === card) activeCard = null;
    }
  };

  container.addEventListener('mousemove', onMouseMove, { passive: true });
  container.addEventListener('mouseleave', onMouseLeave, { passive: true });
  container.addEventListener('mouseout', onMouseOut, { passive: true });

  return () => {
    container.removeEventListener('mousemove', onMouseMove);
    container.removeEventListener('mouseleave', onMouseLeave);
    container.removeEventListener('mouseout', onMouseOut);
    if (requestFrameId) cancelAnimationFrame(requestFrameId);
    if (activeCard) {
      activeCard.style.transform = '';
      activeCard.style.willChange = 'auto';
    }
  };
}

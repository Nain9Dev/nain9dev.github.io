/**
 * Wrapper utility for Plausible Analytics
 * Ensures safe execution even if ad-blockers block the Plausible script.
 */

export function trackCalendlyClick(section = 'unknown') {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible('Agendar Llamada', { props: { section } });
  } else {
    console.debug('[Analytics Disabled] Agendar Llamada:', section);
  }
}

export function trackTerminalCommand(command) {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible('Terminal Command', { props: { command } });
  } else {
    console.debug('[Analytics Disabled] Terminal Command:', command);
  }
}

/**
 * Initializes global event listeners for analytics.
 * Should be called once during app initialization.
 */
export function initializeGlobalAnalytics() {
  if (typeof document === 'undefined') return;
  
  document.addEventListener('click', (e) => {
    // Find closest element with data-calendly-track
    const trackTarget = e.target.closest('[data-calendly-track]');
    if (trackTarget) {
      const section = trackTarget.getAttribute('data-calendly-track') || 'general';
      trackCalendlyClick(section);
    }
  });
}

import { loadProjects } from "./project-catalog.js?v=019";
import { initializeDemoModal } from "./demo-modal.js?v=019";
import { initializeProjectFilters } from "./project-filters.js?v=019";
import { renderProjectError, renderProjects } from "./project-view.js?v=019";
import { initializeAmbientGlow } from "./ambient-glow.js?v=019";
import { initializeCardTilt } from "./card-tilt.js?v=019";
import { initializeScrollStorytelling } from "./scroll-storytelling.js?v=019";
import { initializeParticles } from "./particles.js?v=019";
import { initializeThreeHero, cleanupThreeHero } from "./three-hero.js?v=019";
import { ImpactMetricsManager } from "./impact-metrics.js?v=019";
import {
  initializeEmailCopy,
  initializeHeaderState,
  initializeRevealMotion,
  initializeSectionNavigation
} from "./site-interactions.js?v=019";
import { initializeScrollTracking } from "./scroll-tracking.js?v=019";
import { initializeLazyLoading } from "./lazy-mailerlite.js?v=019";
import { dataUrl } from './locale.js?v=019';

let isAppInitialized = false;
let cleanupFunctions = [];
let impactMetricsManager = null;

function addCleanup(fn) {
  if (typeof fn === 'function') {
    cleanupFunctions.push(fn);
  }
}

function initApp() {
  console.log('[App] Initializing application...');
  isAppInitialized = true;
  const projectContainer = document.querySelector("[data-project-list]");
  const projectToolbar = document.querySelector("[data-project-toolbar]");
  const projectCount = document.querySelector("[data-project-count]");
  const yearElement = document.querySelector("[data-current-year]");

  function safeInit(name, initFn) {
    try {
      const cleanup = initFn();
      if (cleanup) {
        addCleanup(cleanup);
      }
    } catch (error) {
      console.warn(`[NainDev] Failed to initialize visual module '${name}':`, error);
    }
  }

  safeInit('AmbientGlow', initializeAmbientGlow);
  safeInit('CardTilt', initializeCardTilt);
  safeInit('ScrollStory', initializeScrollStorytelling);
  safeInit('Particles', initializeParticles);
  
  let heroTimer = null;
  if ('requestIdleCallback' in window) {
    heroTimer = requestIdleCallback(() => {
      initializeThreeHero();
    });
    addCleanup(() => {
      if (heroTimer) cancelIdleCallback(heroTimer);
      cleanupThreeHero();
    });
  } else {
    heroTimer = setTimeout(() => {
      initializeThreeHero();
    }, 1000);
    addCleanup(() => {
      if (heroTimer) clearTimeout(heroTimer);
      cleanupThreeHero();
    });
  }
  
  safeInit('ImpactMetrics', () => {
    impactMetricsManager = new ImpactMetricsManager('impact-metrics-container');
    impactMetricsManager.init();
    return () => impactMetricsManager && impactMetricsManager.destroy();
  });
  
  safeInit('ScrollTracking', initializeScrollTracking);
  safeInit('LazyLoading', initializeLazyLoading);
  
  // Modal DOM persists across SPA lifecycle
  initializeDemoModal(document);

  safeInit('HeaderState', () => {
    return initializeHeaderState({
      header: document.querySelector("[data-site-header]"),
      progress: document.querySelector("[data-scroll-progress]")
    });
  });
  
  safeInit('SectionNav', () => initializeSectionNavigation(document.querySelectorAll("[data-section-link]")));
  safeInit('RevealMotion', () => initializeRevealMotion(document.querySelectorAll("[data-reveal]")));
  
  safeInit('EmailCopy', () => {
    return initializeEmailCopy({
      button: document.querySelector("[data-copy-email]"),
      emailLink: document.querySelector(".contact-email"),
      status: document.querySelector("[data-copy-status]")
    });
  });

  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }

  if (projectContainer) {
    loadProjects(dataUrl('projects.json?v=019'))
      .then((projects) => {
        renderProjects(projectContainer, projects);
        addCleanup(initializeProjectFilters({
          container: projectContainer,
          count: projectCount,
          toolbar: projectToolbar
        }));
        addCleanup(initializeRevealMotion(projectContainer.querySelectorAll("[data-reveal]")));
      })
      .catch((error) => {
        console.error("Unable to render the project catalog.", error);
        renderProjectError(projectContainer);
      });
  }
}

function cleanupApp() {
  console.log('[App] Disposing application before SPA navigation...', cleanupFunctions.length, 'cleanup handlers registered.');
  cleanupFunctions.forEach(fn => {
    try {
      fn();
    } catch(e) {
      console.warn('[App] Error during cleanup execution:', e);
    }
  });
  cleanupFunctions = [];
  impactMetricsManager = null;
}

if (!isAppInitialized) {
  initApp();
}

document.addEventListener('astro:before-swap', () => {
  cleanupApp();
});

document.addEventListener('astro:after-swap', () => {
  console.log('[App] SPA navigation complete, reinitializing...');
  isAppInitialized = false;
  initApp();
});

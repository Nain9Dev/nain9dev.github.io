import { initializeDemoModal } from "./demo-modal.js";
import { initializeAmbientGlow } from "./ambient-glow.js";
import { initializeCardTilt } from "./card-tilt.js";
import { initializeScrollStorytelling } from "./scroll-storytelling.js";
import { initializeParticles } from "./particles.js";
import {
  initializeEmailCopy,
  initializeHeaderState,
  initializeRevealMotion,
  initializeSectionNavigation
} from "./site-interactions.js";
import { initializeScrollTracking } from "./scroll-tracking.js";
import { runWhenIdle } from "./idle.js";
import { restorePerformanceClass } from "./hardware-acceleration.js";

let isAppInitialized = false;
let cleanupFunctions = [];
// Incremented on every SPA swap so late async work from a previous page cleans itself up.
let generation = 0;

function addCleanup(fn) {
  if (typeof fn === 'function') {
    cleanupFunctions.push(fn);
  }
}

function safeInit(name, initFn) {
  try {
    addCleanup(initFn());
  } catch (error) {
    console.warn(`[NainDev] Failed to initialize visual module '${name}':`, error);
  }
}

// Loads a home-only module on demand; its cleanup is registered only if the page is still current.
function loadOnDemand(name, importer, start) {
  const currentGeneration = generation;
  importer()
    .then((module) => start(module))
    .then((cleanup) => {
      if (currentGeneration === generation) addCleanup(cleanup);
      else if (typeof cleanup === 'function') cleanup();
    })
    .catch((error) => console.warn(`[NainDev] Failed to load module '${name}':`, error));
}

function initApp() {
  console.log('[App] Initializing application...');
  isAppInitialized = true;
  restorePerformanceClass();
  const projectContainer = document.querySelector("[data-project-list]");
  const yearElement = document.querySelector("[data-current-year]");

  safeInit('HeaderState', () => initializeHeaderState({
    header: document.querySelector("[data-site-header]"),
    progress: document.querySelector("[data-scroll-progress]")
  }));
  safeInit('SectionNav', () => initializeSectionNavigation(document.querySelectorAll("[data-section-link]")));
  safeInit('RevealMotion', () => initializeRevealMotion(document.querySelectorAll("[data-reveal]")));
  safeInit('EmailCopy', () => initializeEmailCopy({
    button: document.querySelector("[data-copy-email]"),
    status: document.querySelector("[data-copy-status]")
  }));

  // Modal DOM persists across SPA lifecycle
  initializeDemoModal(document);

  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }

  // Everything below is decorative or below the fold: start it after first paint (PERF-015).
  addCleanup(runWhenIdle(() => {
    safeInit('AmbientGlow', initializeAmbientGlow);
    safeInit('CardTilt', initializeCardTilt);
    safeInit('ScrollStory', initializeScrollStorytelling);
    safeInit('Particles', initializeParticles);
    safeInit('ScrollTracking', initializeScrollTracking);

    // The effects above have already run the capability probe, so constrained devices skip the download.
    if (document.getElementById('hero-3d-canvas') && !document.documentElement.classList.contains('low-performance')) {
      loadOnDemand('ThreeHero', () => import("./three-hero.js"), async ({ initializeThreeHero, cleanupThreeHero }) => {
        await initializeThreeHero();
        return cleanupThreeHero;
      });
    }

    if (document.getElementById('impact-metrics-container')) {
      loadOnDemand('ImpactMetrics', () => import("./impact-metrics.js"), async ({ ImpactMetricsManager }) => {
        const manager = new ImpactMetricsManager('impact-metrics-container');
        await manager.init();
        return () => manager.destroy();
      });
    }

    if (projectContainer) {
      loadOnDemand('ProjectCatalog', () => import("./home-catalog.js"), ({ initializeHomeCatalog }) => initializeHomeCatalog({
        container: projectContainer,
        toolbar: document.querySelector("[data-project-toolbar]"),
        count: document.querySelector("[data-project-count]")
      }));
    }
  }));
}

function cleanupApp() {
  console.log('[App] Disposing application before SPA navigation...', cleanupFunctions.length, 'cleanup handlers registered.');
  generation++;
  cleanupFunctions.forEach(fn => {
    try {
      fn();
    } catch(e) {
      console.warn('[App] Error during cleanup execution:', e);
    }
  });
  cleanupFunctions = [];
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

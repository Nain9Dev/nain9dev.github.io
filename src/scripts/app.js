import { initializeDemoModal } from "./demo-modal.js";
import { initializeAmbientGlow } from "./ambient-glow.js";
import { initializeScrollStorytelling } from "./scroll-storytelling.js";
import {
  initializeEmailCopy,
  initializeHeaderState,
  initializeMobileMenu,
  initializeThemeToggle,
  initializeRevealMotion,
  initializeSectionNavigation
} from "./site-interactions.js";
import { initializeScrollTracking } from "./scroll-tracking.js";
import { runQueueWhenIdle } from "./idle.js";
import { isSampled } from "./vitals-sampling.js";

// Each navigation is a full document load (ADR-0003): modules initialise once and need no cleanup.

function safeInit(name, initFn) {
  try {
    initFn();
  } catch (error) {
    console.warn(`[NainDev] Failed to initialize visual module '${name}':`, error);
  }
}

// Loads a home-only module on demand (PERF-012).
function loadOnDemand(name, importer, start) {
  importer()
    .then((module) => start(module))
    .catch((error) => console.warn(`[NainDev] Failed to load module '${name}':`, error));
}

function initApp() {
  const projectContainer = document.querySelector("[data-project-list]");
  const yearElement = document.querySelector("[data-current-year]");

  safeInit('HeaderState', () => initializeHeaderState({
    header: document.querySelector("[data-site-header]"),
    progress: document.querySelector("[data-scroll-progress]")
  }));
  safeInit('MobileMenu', () => initializeMobileMenu({
    header: document.querySelector("[data-site-header]"),
    button: document.querySelector("[data-nav-toggle]"),
    navigation: document.getElementById("primary-navigation")
  }));
  safeInit('ThemeToggle', () => initializeThemeToggle({ button: document.querySelector("[data-theme-toggle]") }));
  safeInit('SectionNav',() => initializeSectionNavigation(document.querySelectorAll("[data-section-link]")));
  safeInit('RevealMotion', () => initializeRevealMotion(document.querySelectorAll("[data-reveal]")));
  safeInit('EmailCopy', () => initializeEmailCopy({
    button: document.querySelector("[data-copy-email]"),
    status: document.querySelector("[data-copy-status]")
  }));

  initializeDemoModal(document);

  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }

  // Everything below is decorative or below the fold: start it after first paint (PERF-015),
  // one module per idle slot so no single task blocks input on slow devices (PERF-017).
  runQueueWhenIdle([
    () => safeInit('AmbientGlow', initializeAmbientGlow),
    () => safeInit('ScrollStory', initializeScrollStorytelling),
    () => safeInit('ScrollTracking', initializeScrollTracking),
    // The effects above have already run the capability probe, so constrained devices skip the download.
    () => {
      if (document.getElementById('hero-field') && !document.documentElement.classList.contains('low-performance')) {
        loadOnDemand('HeroField', () => import("./hero-field.js"), ({ initializeHeroField }) => initializeHeroField());
      }
    },
    () => {
      if (document.getElementById('impact-metrics-container')) {
        loadOnDemand('ImpactMetrics', () => import("./impact-metrics.js"), ({ ImpactMetricsManager }) => {
          return new ImpactMetricsManager('impact-metrics-container').init();
        });
      }
    },
    () => {
      if (projectContainer) {
        loadOnDemand('ProjectCatalog', () => import("./home-catalog.js"), ({ initializeHomeCatalog }) => initializeHomeCatalog({
          container: projectContainer,
          toolbar: document.querySelector("[data-project-toolbar]"),
          count: document.querySelector("[data-project-count]")
        }));
      }
    },
    // Field Web Vitals on a sample of page views; unsampled views download nothing (spec 032).
    () => {
      if (isSampled()) {
        loadOnDemand('WebVitals', () => import("./web-vitals-report.js"), ({ startWebVitalsReport }) => startWebVitalsReport());
      }
    }
  ]);
}

initApp();

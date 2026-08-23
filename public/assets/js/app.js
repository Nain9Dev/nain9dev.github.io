import { loadProjects } from "./project-catalog.js";
import { initializeDemoModal } from "./demo-modal.js";
import { initializeProjectFilters } from "./project-filters.js";
import { renderProjectError, renderProjects } from "./project-view.js";
import { initializeAmbientGlow } from "./ambient-glow.js";
import { initializeCardTilt } from "./card-tilt.js";
import { initializeScrollStorytelling } from "./scroll-storytelling.js";
import { initializeParticles } from "./particles.js";
import { initializeThreeHero, cleanupThreeHero } from "./three-hero.js";
import { CaseStudiesManager } from "./case-studies.js";
import { ImpactMetricsManager } from "./impact-metrics.js";
import {
  initializeEmailCopy,
  initializeHeaderState,
  initializeRevealMotion,
  initializeSectionNavigation
} from "./site-interactions.js";
import { initializeScrollTracking } from "./scroll-tracking.js";
import { initializeLazyLoading } from "./lazy-mailerlite.js";

let isAppInitialized = false;
let cleanupFunctions = [];
let caseStudiesManager = null;
let impactMetricsManager = null;

function addCleanup(fn) {
  if (typeof fn === 'function') {
    cleanupFunctions.push(fn);
  }
}

function initApp() {
  console.log('[App] Inicializando app...');
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
      console.warn(`[NainDev] Fallo al inicializar módulo visual '${name}':`, error);
    }
  }

  safeInit('AmbientGlow', initializeAmbientGlow);
  safeInit('CardTilt', initializeCardTilt);
  safeInit('ScrollStory', initializeScrollStorytelling);
  safeInit('Particles', initializeParticles);
  
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      initializeThreeHero();
      addCleanup(cleanupThreeHero);
    });
  } else {
    setTimeout(() => {
      initializeThreeHero();
      addCleanup(cleanupThreeHero);
    }, 1000);
  }
  
  safeInit('CaseStudies', () => {
    caseStudiesManager = new CaseStudiesManager('case-studies-container');
    caseStudiesManager.init();
    return () => caseStudiesManager && caseStudiesManager.destroy();
  });
  
  safeInit('ImpactMetrics', () => {
    impactMetricsManager = new ImpactMetricsManager('impact-metrics-container');
    impactMetricsManager.init();
    return () => impactMetricsManager && impactMetricsManager.destroy();
  });
  
  safeInit('ScrollTracking', initializeScrollTracking);
  safeInit('LazyLoading', initializeLazyLoading);
  
  // Asumiendo que demo-modal no se regenera
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
    loadProjects("/assets/data/projects.json")
      .then((projects) => {
        renderProjects(projectContainer, projects);
        initializeProjectFilters({
          container: projectContainer,
          count: projectCount,
          toolbar: projectToolbar
        });
        addCleanup(initializeRevealMotion(projectContainer.querySelectorAll("[data-reveal]")));
      })
      .catch((error) => {
        console.error("Unable to render the project catalog.", error);
        renderProjectError(projectContainer);
      });
  }
}

function cleanupApp() {
  console.log('[App] Limpiando app antes de la navegación SPA...', cleanupFunctions.length, 'funciones de limpieza registradas.');
  cleanupFunctions.forEach(fn => {
    try {
      fn();
    } catch(e) {
      console.warn('[App] Error ejecutando limpieza:', e);
    }
  });
  cleanupFunctions = [];
  caseStudiesManager = null;
  impactMetricsManager = null;
}

if (!isAppInitialized) {
  initApp();
}

document.addEventListener('astro:before-swap', () => {
  cleanupApp();
});

document.addEventListener('astro:after-swap', () => {
  console.log('[App] Navegación SPA completada, reinicializando...');
  isAppInitialized = false;
  initApp();
});

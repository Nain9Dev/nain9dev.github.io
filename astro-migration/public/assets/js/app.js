import { loadProjects } from "./project-catalog.js";
import { initializeDemoModal } from "./demo-modal.js";
import { initializeProjectFilters } from "./project-filters.js";
import { renderProjectError, renderProjects } from "./project-view.js";
import { initializeAmbientGlow } from "./ambient-glow.js";
import { initializeCardTilt } from "./card-tilt.js";
import { initializeScrollStorytelling } from "./scroll-storytelling.js";
import { initializeParticles } from "./particles.js";
import { initializeThreeHero } from "./three-hero.js";
import { initTechStack } from "./tech-stack.js";
import { CaseStudiesManager } from "./case-studies.js";
import { ImpactMetricsManager } from "./impact-metrics.js";
import {
  initializeEmailCopy,
  initializeHeaderState,
  initializeRevealMotion,
  initializeSectionNavigation
} from "./site-interactions.js";
import { initializeScrollTracking } from "./scroll-tracking.js";

let isAppInitialized = false;

function initApp() {
  console.log('[App] Inicializando app...');
  isAppInitialized = true;
  const projectContainer = document.querySelector("[data-project-list]");
  const projectToolbar = document.querySelector("[data-project-toolbar]");
  const projectCount = document.querySelector("[data-project-count]");
  const yearElement = document.querySelector("[data-current-year]");

function safeInit(name, initFn) {
  try {
    initFn();
  } catch (error) {
    console.warn(`[NainDev] Fallo al inicializar módulo visual '${name}':`, error);
  }
}

safeInit('AmbientGlow', initializeAmbientGlow);
safeInit('CardTilt', initializeCardTilt);
safeInit('ScrollStory', initializeScrollStorytelling);
safeInit('Particles', initializeParticles);
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => safeInit('ThreeHero', initializeThreeHero));
} else {
  setTimeout(() => safeInit('ThreeHero', initializeThreeHero), 1000);
}
safeInit('TechStack', initTechStack);
safeInit('CaseStudies', () => {
  console.log('[app.js] Inicializando CaseStudiesManager...');
  return new CaseStudiesManager('case-studies-container').init();
});
safeInit('ImpactMetrics', () => {
  console.log('[app.js] Inicializando ImpactMetricsManager...');
  return new ImpactMetricsManager('impact-metrics-container').init();
});
safeInit('ScrollTracking', initializeScrollTracking);
initializeDemoModal(document);

safeInit('HeaderState', () => {
  initializeHeaderState({
    header: document.querySelector("[data-site-header]"),
    progress: document.querySelector("[data-scroll-progress]")
  });
});
safeInit('SectionNav', () => initializeSectionNavigation(document.querySelectorAll("[data-section-link]")));
safeInit('RevealMotion', () => initializeRevealMotion(document.querySelectorAll("[data-reveal]")));
safeInit('EmailCopy', () => {
  initializeEmailCopy({
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
        initializeRevealMotion(projectContainer.querySelectorAll("[data-reveal]"));
      })
      .catch((error) => {
        console.error("Unable to render the project catalog.", error);
        renderProjectError(projectContainer);
      });
  }
}

// Ejecutar en primera carga (DOM ya listo gracias a type="module")
if (!isAppInitialized) {
  initApp();
}

// Escuchar navegaciones SPA
document.addEventListener('astro:after-swap', () => {
  console.log('[App] Navegación SPA detectada, reinicializando...');
  isAppInitialized = false; // Reset para permitir reinicialización
  initApp();
});

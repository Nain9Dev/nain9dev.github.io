import { loadProjects } from "./project-catalog.js";
import { initializeDemoModal } from "./demo-modal.js";
import { initializeProjectFilters } from "./project-filters.js";
import { renderProjectError, renderProjects } from "./project-view.js";
import { initializeAmbientGlow } from "./ambient-glow.js";
import { initializeCardTilt } from "./card-tilt.js";
import {
  initializeEmailCopy,
  initializeHeaderState,
  initializeRevealMotion,
  initializeSectionNavigation
} from "./site-interactions.js";

const projectContainer = document.querySelector("[data-project-list]");
const projectToolbar = document.querySelector("[data-project-toolbar]");
const projectCount = document.querySelector("[data-project-count]");
const yearElement = document.querySelector("[data-current-year]");

initializeAmbientGlow();
initializeCardTilt();
initializeDemoModal(document);

initializeHeaderState({
  header: document.querySelector("[data-site-header]"),
  progress: document.querySelector("[data-scroll-progress]")
});
initializeSectionNavigation(document.querySelectorAll("[data-section-link]"));
initializeRevealMotion(document.querySelectorAll("[data-reveal]"));
initializeEmailCopy({
  button: document.querySelector("[data-copy-email]"),
  emailLink: document.querySelector(".contact-email"),
  status: document.querySelector("[data-copy-status]")
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

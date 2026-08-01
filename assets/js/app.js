import { loadProjects } from "./project-catalog.js";
import { renderProjectError, renderProjects } from "./project-view.js";

const projectContainer = document.querySelector("[data-project-list]");
const yearElement = document.querySelector("[data-current-year]");

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

if (projectContainer) {
  loadProjects("/assets/data/projects.json")
    .then((projects) => renderProjects(projectContainer, projects))
    .catch((error) => {
      console.error("Unable to render the project catalog.", error);
      renderProjectError(projectContainer);
    });
}

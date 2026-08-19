function createElement(tagName, className, text) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (text) {
    element.textContent = text;
  }

  return element;
}

function createProjectLink(link) {
  const anchor = createElement("a", "project-link", link.label);
  anchor.href = link.url;

  if (link.url.startsWith("https://")) {
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.append(" ↗");
  }

  return anchor;
}

function createProjectCard(project, index) {
  const article = createElement("article", "project-card");
  article.dataset.featured = String(Boolean(project.featured));
  article.dataset.projectCard = "";
  article.dataset.categories = project.categories.join(" ");
  article.dataset.reveal = "";
  article.style.transitionDelay = `${index * 80}ms`;

  const header = createElement("div", "project-card-header");
  header.append(
    createElement("p", "project-status", project.status),
    createElement("span", "project-index", String(index + 1).padStart(2, "0"))
  );

  const title = createElement("h3", "project-title", project.title);
  const summary = createElement("p", "project-summary", project.summary);
  const proof = createElement("p", "project-proof", project.proof);

  const technologies = createElement("ul", "tag-list");
  technologies.setAttribute("aria-label", `Tecnologías de ${project.title}`);
  project.technologies.forEach((technology) => {
    technologies.append(createElement("li", "", technology));
  });

  const links = createElement("div", "project-links");
  project.links.forEach((link) => links.append(createProjectLink(link)));

  article.append(header, title, summary, proof, technologies, links);
  return article;
}

export function renderProjects(container, projects) {
  const fragment = document.createDocumentFragment();
  projects.forEach((project, index) => fragment.append(createProjectCard(project, index)));

  container.replaceChildren(fragment);
  container.setAttribute("aria-busy", "false");
}

export function renderProjectError(container) {
  const message = createElement(
    "p",
    "notice",
    "No se ha podido cargar el catálogo. Puedes revisar los proyectos directamente en GitHub."
  );
  const link = createElement("a", "", " Abrir GitHub ↗");
  link.href = "https://github.com/Nain9Dev";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  message.append(link);

  container.replaceChildren(message);
  container.setAttribute("aria-busy", "false");
}

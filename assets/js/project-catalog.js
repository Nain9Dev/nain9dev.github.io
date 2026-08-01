const REQUIRED_FIELDS = ["id", "title", "status", "summary", "proof", "technologies", "categories", "links", "order"];
const SUPPORTED_CATEGORIES = new Set(["backend", "data", "demo"]);

function isValidLink(link) {
  return Boolean(link)
    && typeof link.label === "string"
    && typeof link.url === "string"
    && (link.url.startsWith("/") || link.url.startsWith("https://"));
}

function isValidProject(project) {
  return REQUIRED_FIELDS.every((field) => Object.prototype.hasOwnProperty.call(project, field))
    && Array.isArray(project.technologies)
    && project.technologies.every((technology) => typeof technology === "string")
    && Array.isArray(project.categories)
    && project.categories.length > 0
    && project.categories.every((category) => SUPPORTED_CATEGORIES.has(category))
    && Array.isArray(project.links)
    && project.links.length > 0
    && project.links.every(isValidLink)
    && Number.isInteger(project.order);
}

export async function loadProjects(sourceUrl) {
  const response = await fetch(sourceUrl, {
    headers: { Accept: "application/json" },
    credentials: "same-origin"
  });

  if (!response.ok) {
    throw new Error(`Project catalog request failed with status ${response.status}.`);
  }

  const projects = await response.json();

  if (!Array.isArray(projects) || !projects.every(isValidProject)) {
    throw new TypeError("Project catalog has an invalid structure.");
  }

  return [...projects].sort((first, second) => first.order - second.order);
}

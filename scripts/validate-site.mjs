import { execFileSync } from "node:child_process";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requiredProjectFields = ["id", "title", "status", "summary", "proof", "technologies", "categories", "links", "order"];
const supportedProjectCategories = new Set(["backend", "data", "demo"]);
const ignoredDirectories = new Set([".git", ".continue", ".agents", ".portfolio-private", "node_modules"]);
const errors = [];
let inlineJavaScriptCount = 0;

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function findFiles(directory, extension) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory() && !ignoredDirectories.has(entry.name)) {
      files.push(...await findFiles(path.join(directory, entry.name), extension));
    } else if (entry.isFile() && entry.name.endsWith(extension)) {
      files.push(path.join(directory, entry.name));
    }
  }

  return files;
}

function validateProjectCatalog(projects) {
  if (!Array.isArray(projects) || projects.length === 0) {
    errors.push("Project catalog must contain at least one project.");
    return;
  }

  const identifiers = new Set();
  const orders = new Set();

  for (const project of projects) {
    for (const field of requiredProjectFields) {
      if (!Object.prototype.hasOwnProperty.call(project, field)) {
        errors.push(`Project is missing required field: ${field}.`);
      }
    }

    if (identifiers.has(project.id)) {
      errors.push(`Duplicate project id: ${project.id}.`);
    }
    identifiers.add(project.id);

    if (orders.has(project.order)) {
      errors.push(`Duplicate project order: ${project.order}.`);
    }
    orders.add(project.order);

    if (!Array.isArray(project.technologies) || project.technologies.length === 0) {
      errors.push(`Project ${project.id} must declare technologies.`);
    }

    if (!Array.isArray(project.categories) || project.categories.length === 0) {
      errors.push(`Project ${project.id} must declare at least one category.`);
    } else {
      for (const category of project.categories) {
        if (!supportedProjectCategories.has(category)) {
          errors.push(`Project ${project.id} contains unsupported category: ${category}.`);
        }
      }
    }

    if (!Array.isArray(project.links) || project.links.length === 0) {
      errors.push(`Project ${project.id} must declare at least one link.`);
    } else {
      for (const link of project.links) {
        if (typeof link.url !== "string" || (!link.url.startsWith("/") && !link.url.startsWith("https://") && !link.url.startsWith("#"))) {
          errors.push(`Project ${project.id} contains a link with an unsafe URL.`);
        }
      }
    }
  }
}

async function validateHtmlFile(filePath) {
  const content = await readFile(filePath, "utf8");
  const relativeFile = path.relative(rootDirectory, filePath);
  const identifiers = [...content.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicateIdentifiers = identifiers.filter((identifier, index) => identifiers.indexOf(identifier) !== index);

  for (const identifier of new Set(duplicateIdentifiers)) {
    errors.push(`${relativeFile} contains duplicate id: ${identifier}.`);
  }

  const inlineScripts = [...content.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  for (const [, attributes, source] of inlineScripts) {
    if (/\bsrc\s*=/i.test(attributes)) {
      continue;
    }

    const type = attributes.match(/\btype\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase();
    if (type && type !== "module" && type !== "text/javascript" && type !== "application/javascript") {
      continue;
    }

    inlineJavaScriptCount++;
    const label = `${relativeFile} inline script ${inlineJavaScriptCount}`;
    const inputType = type === "module" ? "module" : "commonjs";

    try {
      execFileSync(process.execPath, ["--check", `--input-type=${inputType}`, "-"], {
        input: source,
        stdio: ["pipe", "pipe", "pipe"]
      });
    } catch (error) {
      const diagnostic = error.stderr?.toString().trim() || error.message;
      errors.push(`${label} has invalid JavaScript: ${diagnostic}`);
    }
  }

  const unsafeBlankLinks = content.match(/<a\b(?=[^>]*target="_blank")(?![^>]*rel="[^"]*noopener)[^>]*>/gi) ?? [];
  if (unsafeBlankLinks.length > 0) {
    errors.push(`${relativeFile} contains ${unsafeBlankLinks.length} target=_blank link(s) without rel=noopener.`);
  }

  const references = [...content.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const reference of references) {
    if (reference.startsWith("http://")) {
      errors.push(`${relativeFile} contains insecure external reference: ${reference}.`);
      continue;
    }

    if (reference.startsWith("#") || reference.startsWith("mailto:") || reference.startsWith("https://") || reference.startsWith("data:")) {
      continue;
    }

    const referenceWithoutFragment = reference.split("#", 1)[0];
    const siteRelativePath = referenceWithoutFragment.startsWith("/")
      ? referenceWithoutFragment.slice(1)
      : path.join(path.dirname(relativeFile), referenceWithoutFragment);
    const candidatePath = path.join(rootDirectory, siteRelativePath);
    const resolvedPath = referenceWithoutFragment.endsWith("/") ? path.join(candidatePath, "index.html") : candidatePath;

    if (!await fileExists(resolvedPath)) {
      errors.push(`${relativeFile} references missing local file: ${reference}.`);
    }
  }
}

function validatePrivateDocumentationBoundary() {
  const trackedPrivateFiles = execFileSync("git", ["ls-files", ".portfolio-private"], {
    cwd: rootDirectory,
    encoding: "utf8"
  }).trim();

  if (trackedPrivateFiles) {
    errors.push("Private portfolio documentation is tracked by Git.");
  }

  try {
    execFileSync("git", ["check-ignore", "-q", ".portfolio-private/docs/README.md"], { cwd: rootDirectory });
  } catch {
    errors.push("Private portfolio documentation is not protected by .gitignore.");
  }
}

const catalogPath = path.join(rootDirectory, "assets", "data", "projects.json");
const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
validateProjectCatalog(catalog);

const htmlFiles = await findFiles(rootDirectory, ".html");
for (const htmlFile of htmlFiles) {
  await validateHtmlFile(htmlFile);
}

const javascriptFiles = await findFiles(rootDirectory, ".js");
for (const javascriptFile of javascriptFiles) {
  try {
    execFileSync(process.execPath, ["--check", javascriptFile], { stdio: "pipe" });
  } catch (error) {
    errors.push(`${path.relative(rootDirectory, javascriptFile)} has invalid JavaScript: ${error.message}`);
  }
}

validatePrivateDocumentationBoundary();

if (errors.length > 0) {
  console.error("Portfolio validation failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  const totalJavaScriptFiles = javascriptFiles.length + inlineJavaScriptCount;
  console.log(`Portfolio validation passed (${htmlFiles.length} HTML files, ${totalJavaScriptFiles} JavaScript sources, ${catalog.length} projects).`);
}

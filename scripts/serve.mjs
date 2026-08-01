import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number.parseInt(process.env.PORT ?? "4173", 10);
const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".xml", "application/xml; charset=utf-8"]
]);

function resolveRequestPath(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, `http://localhost:${port}`).pathname);
  const requestedPath = pathname.endsWith("/") ? `${pathname}index.html` : pathname;
  const absolutePath = path.resolve(rootDirectory, `.${requestedPath}`);

  return absolutePath.startsWith(`${rootDirectory}${path.sep}`) || absolutePath === rootDirectory
    ? absolutePath
    : null;
}

const server = createServer(async (request, response) => {
  let filePath;

  try {
    filePath = resolveRequestPath(request.url ?? "/");

    if (!filePath || !(await stat(filePath)).isFile()) {
      response.statusCode = 404;
      filePath = path.join(rootDirectory, "404.html");
    }
  } catch {
    response.statusCode = 404;
    filePath = path.join(rootDirectory, "404.html");
  }

  response.setHeader("Content-Type", contentTypes.get(path.extname(filePath).toLowerCase()) ?? "application/octet-stream");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  createReadStream(filePath).pipe(response);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Portfolio available at http://127.0.0.1:${port}`);
});

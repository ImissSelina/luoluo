const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = __dirname;
loadDotEnv(path.join(ROOT, ".env"));

const PORT = Number(process.env.PORT || 6066);
const HOST = process.env.HOST || "127.0.0.1";
const MAX_BODY_BYTES = 40 * 1024 * 1024;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 30;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".ttf": "font/ttf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon"
};

const CHAT_PROVIDERS = {
  gpt: {
    keyEnv: "GPT_API_KEY",
    urlEnv: "GPT_CHAT_URL",
    modelEnv: "GPT_MODEL"
  },
  claude: {
    keyEnv: "CLAUDE_API_KEY",
    urlEnv: "CLAUDE_CHAT_URL",
    modelEnv: "CLAUDE_MODEL"
  },
  mimo: {
    keyEnv: "MIMO_API_KEY",
    urlEnv: "MIMO_CHAT_URL",
    modelEnv: "MIMO_MODEL"
  }
};

const IMAGE_MODES = {
  edit: {
    legacyUrlEnv: "GPTIMAGE2_EDIT_URL",
    pathEnv: "CHATGPTIMAGE2_EDIT_PATH",
    defaultPath: "images/edits"
  },
  generate: {
    legacyUrlEnv: "GPTIMAGE2_GENERATE_URL",
    pathEnv: "CHATGPTIMAGE2_GENERATE_PATH",
    defaultPath: "images/generations"
  },
  imitate: {
    legacyUrlEnv: "GPTIMAGE2_IMITATE_URL",
    pathEnv: "CHATGPTIMAGE2_IMITATE_PATH",
    fallbackPathEnv: "CHATGPTIMAGE2_EDIT_PATH",
    defaultPath: "images/edits"
  }
};

const IMAGE_ALLOWED_TEXT_FIELDS = new Set([
  "model",
  "prompt",
  "n",
  "size",
  "quality",
  "response_format",
  "background",
  "moderation",
  "output_format",
  "output_compression",
  "user",
  "style"
]);

const IMAGE_ALLOWED_FILE_FIELDS = new Set(["image", "mask"]);

const IMAGE_TEMPLATE_PROMPTS = {
  "studio-neon": "blue-violet futuristic neon studio lighting",
  "product-poster": "premium product poster composition with polished commercial lighting",
  "avatar-polish": "clean portrait retouching with refined avatar detail",
  "cinematic-ui": "cinematic interface lighting with dramatic depth and crisp highlights"
};

const rateBuckets = new Map();

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const equalsAt = trimmed.indexOf("=");
    if (equalsAt === -1) continue;

    const key = trimmed.slice(0, equalsAt).trim().replace(/^\uFEFF/, "");
    let value = trimmed.slice(equalsAt + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(data));
}

function sendText(res, statusCode, text) {
  res.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(text);
}

function isRateLimited(req) {
  const ip = req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const bucket = rateBuckets.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };

  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }

  bucket.count += 1;
  rateBuckets.set(ip, bucket);
  return bucket.count > RATE_LIMIT_MAX;
}

function readJsonBody(req) {
  if (req.body !== undefined) {
    if (typeof req.body === "string") {
      return Promise.resolve(parseJsonBodyText(req.body));
    }
    if (Buffer.isBuffer(req.body)) {
      return Promise.resolve(parseJsonBodyText(req.body.toString("utf8")));
    }
    if (typeof req.body === "object" && req.body !== null) {
      return Promise.resolve(req.body);
    }
  }

  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];

    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error("Request body too large"), { statusCode: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(parseJsonBodyText(raw));
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}

function parseJsonBodyText(raw) {
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    throw Object.assign(new Error("Invalid JSON body"), { statusCode: 400 });
  }
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];

    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error("Request body too large"), { statusCode: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function fetchWithTimeout(url, options) {
  const timeoutMs = getRequestTimeoutMs();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function forwardToUpstream({ url, apiKey, payload }) {
  let response;
  try {
    response = await fetchWithTimeout(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    if (error.name === "AbortError") {
      return {
        statusCode: 504,
        body: {
          error: `Upstream request timed out after ${getRequestTimeoutSeconds()} seconds`
        }
      };
    }
    return {
      statusCode: 502,
      body: {
        error: "Network request to upstream API failed",
        detail: getNetworkErrorDetail(error)
      }
    };
  }

  const text = await response.text();
  const contentType = response.headers.get("content-type") || "";
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { text };
  }

  if (contentType.includes("text/html")) {
    return {
      statusCode: 502,
      body: {
        error: "Upstream returned HTML instead of API JSON. Check that the URL points to the real API endpoint, not a website page.",
        status: response.status
      }
    };
  }

  if (!response.ok) {
    return {
      statusCode: response.status,
      body: {
        error: extractUpstreamError(data, "Upstream API request failed"),
        status: response.status,
        detail: data
      }
    };
  }

  return { statusCode: 200, body: data };
}

async function forwardMultipartToUpstream({ url, apiKey, formData }) {
  let response;
  try {
    response = await fetchWithTimeout(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`
      },
      body: formData
    });
  } catch (error) {
    if (error.name === "AbortError") {
      return {
        statusCode: 504,
        body: {
          error: `Upstream request timed out after ${getRequestTimeoutSeconds()} seconds`
        }
      };
    }
    return {
      statusCode: 502,
      body: {
        error: "Network request to upstream API failed",
        detail: getNetworkErrorDetail(error)
      }
    };
  }

  const text = await response.text();
  const contentType = response.headers.get("content-type") || "";
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { text };
  }

  if (contentType.includes("text/html")) {
    return {
      statusCode: 502,
      body: {
        error: "Upstream returned HTML instead of API JSON. Check that the URL points to the real API endpoint, not a website page.",
        status: response.status
      }
    };
  }

  if (!response.ok) {
    return {
      statusCode: response.status,
      body: {
        error: extractUpstreamError(data, "Upstream API request failed"),
        status: response.status,
        detail: data
      }
    };
  }

  return { statusCode: 200, body: data };
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw Object.assign(new Error(`Missing server environment variable: ${name}`), {
      statusCode: 500
    });
  }
  return value;
}

function getOptionalEnv(name, fallback = "") {
  return process.env[name] || fallback;
}

function getFirstEnv(names, fallback = "") {
  for (const name of names) {
    const value = process.env[name];
    if (value) return value;
  }
  return fallback;
}

function requireFirstEnv(names) {
  const value = getFirstEnv(names);
  if (!value) {
    throw Object.assign(new Error(`Missing server environment variable: ${names.join(" or ")}`), {
      statusCode: 500
    });
  }
  return value;
}

function getRequestTimeoutSeconds() {
  const configured = Number(getOptionalEnv("REQUEST_TIMEOUT", "90"));
  return Number.isFinite(configured) && configured > 0 ? configured : 90;
}

function getRequestTimeoutMs() {
  return getRequestTimeoutSeconds() * 1000;
}

function getImageApiKey() {
  return requireFirstEnv(["CHATGPTIMAGE2_API_KEY", "GPTIMAGE2_API_KEY"]);
}

function getImageModel() {
  return getFirstEnv(["CHATGPTIMAGE2_MODEL", "GPTIMAGE2_MODEL"], "gpt-image-2");
}

function getImageTransportMode() {
  return getFirstEnv(["CHATGPTIMAGE2_MODE", "GPTIMAGE2_MODE"], "auto").trim().toLowerCase();
}

function getImageApiUrl(mode) {
  const config = IMAGE_MODES[mode];
  if (!config) return "";

  const baseUrl = getOptionalEnv("CHATGPTIMAGE2_API_URL").replace(/\/+$/, "");
  if (baseUrl) {
    const pathValue =
      getOptionalEnv(config.pathEnv) ||
      (config.fallbackPathEnv ? getOptionalEnv(config.fallbackPathEnv) : "") ||
      config.defaultPath;
    return `${baseUrl}/${pathValue.replace(/^\/+/, "")}`;
  }

  return requireEnv(config.legacyUrlEnv);
}

function templateToPrompt(value) {
  const key = String(value || "").trim();
  return IMAGE_TEMPLATE_PROMPTS[key] || key;
}

function appendTemplatePrompt(prompt, templates) {
  const templateText = templates.map(templateToPrompt).filter(Boolean).join("; ");
  if (!templateText) return prompt;

  const normalizedPrompt = String(prompt || "").trim();
  const templatePrompt = `Reference style/templates: ${templateText}.`;
  return normalizedPrompt ? `${normalizedPrompt}\n\n${templatePrompt}` : templatePrompt;
}

function appendImageTextField(formData, name, value) {
  if (value === undefined || value === null || value === "") return;
  if (!IMAGE_ALLOWED_TEXT_FIELDS.has(name)) return;
  formData.append(name, String(value));
}

function getImageFileFieldName(name) {
  if (name === "images" || name === "template_images") return "image";
  if (IMAGE_ALLOWED_FILE_FIELDS.has(name)) return name;
  return "";
}

function buildImagePayload(payload) {
  const templates = normalizeArray(payload.templates || payload.template).filter(Boolean);
  const upstreamPayload = {};

  for (const field of IMAGE_ALLOWED_TEXT_FIELDS) {
    if (field === "prompt") continue;
    const value = payload[field];
    if (value !== undefined && value !== null && value !== "") {
      upstreamPayload[field] = value;
    }
  }

  upstreamPayload.model = upstreamPayload.model || getImageModel();
  upstreamPayload.prompt = appendTemplatePrompt(payload.prompt || "", templates);
  return upstreamPayload;
}

function imagePartToDataUrl(part) {
  const mime = part.type || "application/octet-stream";
  return `data:${mime};base64,${part.content.toString("base64")}`;
}

function buildImagePayloadFromParts(parts) {
  const templates = [];
  const upstreamPayload = {};
  const images = [];
  const masks = [];
  let prompt = "";

  parts.forEach((part) => {
    if (part.filename) {
      if (part.content.length === 0) return;
      const fieldName = getImageFileFieldName(part.name);
      if (fieldName === "image") {
        images.push(imagePartToDataUrl(part));
      } else if (fieldName === "mask") {
        masks.push(imagePartToDataUrl(part));
      }
      return;
    }

    const value = part.content.toString("utf8");
    if (part.name === "templates" || part.name === "template") {
      if (value) templates.push(value);
      return;
    }
    if (part.name === "prompt") {
      prompt = prompt ? `${prompt}\n${value}` : value;
      return;
    }
    if (IMAGE_ALLOWED_TEXT_FIELDS.has(part.name) && value) {
      upstreamPayload[part.name] = value;
    }
  });

  upstreamPayload.model = upstreamPayload.model || getImageModel();
  upstreamPayload.prompt = appendTemplatePrompt(prompt, templates);
  if (images.length > 0) {
    upstreamPayload.image = images.length === 1 ? images[0] : images;
  }
  if (masks.length > 0) {
    upstreamPayload.mask = masks[0];
  }
  return upstreamPayload;
}

function normalizeArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === "") return [];
  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [value];
}

function extractUpstreamError(data, fallback) {
  const message = (
    data?.error?.message ||
    data?.detail?.error?.message ||
    data?.message ||
    data?.error ||
    fallback
  );
  return typeof message === "string" ? message : fallback;
}

function getNetworkErrorDetail(error) {
  const cause = error?.cause || {};
  return {
    message: error?.message || "fetch failed",
    code: cause.code || error?.code || "",
    errno: cause.errno || "",
    syscall: cause.syscall || "",
    hostname: cause.hostname || ""
  };
}

function parseMultipartBody(buffer, contentType) {
  const boundary = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i)?.[1] || contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i)?.[2];
  if (!boundary) {
    throw Object.assign(new Error("Missing multipart boundary"), { statusCode: 400 });
  }

  const boundaryBuffer = Buffer.from(`--${boundary}`);
  const parts = [];
  let cursor = buffer.indexOf(boundaryBuffer);

  while (cursor !== -1) {
    cursor += boundaryBuffer.length;
    if (buffer[cursor] === 45 && buffer[cursor + 1] === 45) break;
    if (buffer[cursor] === 13 && buffer[cursor + 1] === 10) cursor += 2;

    const headerEnd = buffer.indexOf(Buffer.from("\r\n\r\n"), cursor);
    if (headerEnd === -1) break;

    const headers = buffer.slice(cursor, headerEnd).toString("utf8");
    let dataStart = headerEnd + 4;
    let nextBoundary = buffer.indexOf(Buffer.from(`\r\n--${boundary}`), dataStart);
    if (nextBoundary === -1) {
      nextBoundary = buffer.length;
    }

    const content = buffer.slice(dataStart, nextBoundary);
    const disposition = headers.match(/content-disposition:\s*form-data;([^\r\n]+)/i)?.[1] || "";
    const name = disposition.match(/name="([^"]+)"/i)?.[1] || "";
    const filename = disposition.match(/filename="([^"]*)"/i)?.[1] || "";
    const type = headers.match(/content-type:\s*([^\r\n]+)/i)?.[1]?.trim() || "application/octet-stream";

    if (name) {
      parts.push({ name, filename, type, content });
    }

    cursor = buffer.indexOf(boundaryBuffer, nextBoundary);
  }

  return parts;
}

function buildImageFormData(parts) {
  const formData = new FormData();
  const templates = [];
  let prompt = "";

  parts.forEach((part) => {
    if (part.filename) {
      if (part.content.length === 0) return;
      const fieldName = getImageFileFieldName(part.name);
      if (!fieldName) return;
      const blob = new Blob([part.content], { type: part.type });
      formData.append(fieldName, blob, part.filename);
      return;
    }

    const value = part.content.toString("utf8");
    if (part.name === "templates" || part.name === "template") {
      if (value) templates.push(value);
      return;
    }
    if (part.name === "prompt") {
      prompt = prompt ? `${prompt}\n${value}` : value;
      return;
    }
    appendImageTextField(formData, part.name, value);
  });

  formData.set("prompt", appendTemplatePrompt(prompt, templates));
  if (!formData.has("model")) {
    formData.set("model", getImageModel());
  }

  return formData;
}

async function handleChat(req, res, providerId) {
  const provider = CHAT_PROVIDERS[providerId];
  if (!provider) {
    sendJson(res, 404, { error: "Unknown chat provider" });
    return;
  }

  const payload = await readJsonBody(req);
  const modelName = requireEnv(provider.modelEnv);
  const messages = Array.isArray(payload.messages) && payload.messages.length
    ? payload.messages
    : [
        {
          role: "user",
          content: payload.message || ""
        }
      ];
  const upstreamPayload = {
    model: modelName,
    messages,
    stream: false
  };
  const upstream = await forwardToUpstream({
    url: requireEnv(provider.urlEnv),
    apiKey: requireEnv(provider.keyEnv),
    payload: upstreamPayload
  });
  sendJson(res, upstream.statusCode, upstream.body);
}

async function handleImage(req, res, mode) {
  const imageConfig = IMAGE_MODES[mode];
  if (!imageConfig) {
    sendJson(res, 404, { error: "Unknown image mode" });
    return;
  }

  const contentType = req.headers["content-type"] || "";
  const url = getImageApiUrl(mode);
  const apiKey = getImageApiKey();
  let upstream;

  if (contentType.includes("multipart/form-data")) {
    const body = await readRawBody(req);
    const parts = parseMultipartBody(body, contentType);
    if (getImageTransportMode() === "json") {
      upstream = await forwardToUpstream({
        url,
        apiKey,
        payload: buildImagePayloadFromParts(parts)
      });
    } else {
      const formData = buildImageFormData(parts);
      upstream = await forwardMultipartToUpstream({
        url,
        apiKey,
        formData
      });
    }
  } else {
    const payload = await readJsonBody(req);
    const upstreamPayload = buildImagePayload(payload);
    upstream = await forwardToUpstream({
      url,
      apiKey,
      payload: upstreamPayload
    });
  }

  sendJson(res, upstream.statusCode, upstream.body);
}

function serveStatic(req, res) {
  const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const decodedPath = decodeURIComponent(requestUrl.pathname);
  const cleanPath = decodedPath === "/" ? "index.html" : decodedPath.replace(/^\/+/, "");
  const normalized = path.normalize(cleanPath).replace(/^(\.\.[/\\])+/, "");
  const relativePath = normalized || "index.html";

  if (!isPublicStaticPath(relativePath)) {
    sendText(res, 404, "Not found");
    return;
  }

  const filePath = path.join(ROOT, relativePath);
  const resolvedPath = path.resolve(filePath);

  if (resolvedPath !== ROOT && !resolvedPath.startsWith(`${ROOT}${path.sep}`)) {
    sendText(res, 403, "Forbidden");
    return;
  }

  fs.stat(resolvedPath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      sendText(res, 404, "Not found");
      return;
    }

    const ext = path.extname(resolvedPath).toLowerCase();
    const cacheControl = [".html", ".css", ".js"].includes(ext)
      ? "no-store"
      : "public, max-age=3600";

    res.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
      "Cache-Control": cacheControl
    });
    fs.createReadStream(resolvedPath).pipe(res);
  });
}

function isPublicStaticPath(relativePath) {
  const publicPath = relativePath.replace(/\\/g, "/");
  const publicFiles = new Set(["index.html", "app.js", "styles.css"]);

  if (publicFiles.has(publicPath)) {
    return true;
  }

  if (!publicPath.startsWith("assets/")) {
    return false;
  }

  return publicPath
    .split("/")
    .every((segment) => segment && !segment.startsWith("."));
}

async function route(req, res) {
  const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (requestUrl.pathname.startsWith("/api/")) {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      sendJson(res, 405, { error: "Method not allowed" });
      return;
    }

    if (isRateLimited(req)) {
      sendJson(res, 429, { error: "Too many requests. Please try again later." });
      return;
    }

    const chatMatch = requestUrl.pathname.match(/^\/api\/chat\/(gpt|claude|mimo)$/);
    if (chatMatch) {
      await handleChat(req, res, chatMatch[1]);
      return;
    }

    const imageMatch = requestUrl.pathname.match(/^\/api\/gptimage2\/(edit|generate|imitate)$/);
    if (imageMatch) {
      await handleImage(req, res, imageMatch[1]);
      return;
    }

    sendJson(res, 404, { error: "API route not found" });
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    sendText(res, 405, "Method not allowed");
    return;
  }

  serveStatic(req, res);
}

const server = http.createServer((req, res) => {
  route(req, res).catch((error) => {
    const statusCode = error.statusCode || 500;
    sendJson(res, statusCode, { error: error.message || "Internal server error" });
  });
});

if (require.main === module) {
  server.listen(PORT, HOST, () => {
    console.log(`Luoluo Studio website and backend running at http://${HOST}:${PORT}`);
  });
}

module.exports = async function handler(req, res) {
  try {
    await route(req, res);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    sendJson(res, statusCode, { error: error.message || "Internal server error" });
  }
};

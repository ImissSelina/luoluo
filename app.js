const API_CONFIG = {
  useMockApi: false,
  chat: {
    gpt: {
      name: "GPT",
      endpoint: "/api/chat/gpt",
      icon: "assets/icon-gpt.jpg"
    },
    claude: {
      name: "CLAUDE",
      endpoint: "/api/chat/claude",
      icon: "assets/icon-claude.jpg"
    },
    mimo: {
      name: "MIMO",
      endpoint: "/api/chat/mimo",
      icon: "assets/icon-mimo.jpg"
    }
  },
  image: {
    edit: "/api/gptimage2/edit",
    generate: "/api/gptimage2/generate",
    imitate: "/api/gptimage2/imitate"
  }
};

const TEXT = {
  homeTitle: "\u9996\u9875",
  productsTitle: "\u4ea7\u54c1\u4e0e\u6210\u679c",
  servicesTitle: "\u0041\u0049 \u670d\u52a1",
  chatTitle: "\u0041\u0049 \u95ee\u7b54",
  imageTitle: "\u56fe\u50cf\u751f\u6210",
  contactTitle: "\u8054\u7cfb\u6211\u4eec",
  editLabel: "\u5f00\u59cb\u4fee\u6539",
  generateLabel: "\u5f00\u59cb\u751f\u6210",
  imitateLabel: "\u5f00\u59cb\u6a21\u4eff",
  you: "\u4f60",
  connecting: "\u6b63\u5728\u8fde\u63a5\u6a21\u578b\u901a\u9053...",
  mockChat: (name) =>
    `${name} \u6f14\u793a\u6a21\u5f0f\u5df2\u542f\u7528\u3002`,
  mockImage: (endpoint) =>
    `\u5df2\u51c6\u5907\u8c03\u7528 ${endpoint}\u3002\u8fd9\u91cc\u4fdd\u7559 GPTIMAGE2 \u7684\u72ec\u7acb\u6a21\u5f0f\u63a5\u53e3\uff0c\u7b49\u5f85\u586b\u5165\u771f\u5b9e\u540e\u7aef\u3002`,
  imagePending: "\u6b63\u5728\u6574\u7406\u8bf7\u6c42\u53c2\u6570...",
  modelReturned: "\u6a21\u578b\u5df2\u8fd4\u56de\u7ed3\u679c\u3002",
  imageSubmitted: "\u56fe\u50cf\u4efb\u52a1\u5df2\u63d0\u4ea4\u3002",
  promptRequired: "\u8bf7\u5148\u586b\u5199\u6587\u5b57\u63cf\u8ff0\u3002",
  imageRequired: "\u8bf7\u5148\u4e0a\u4f20\u81f3\u5c11\u4e00\u5f20\u53c2\u8003\u56fe\u3002",
  wechatCopied: "\u5df2\u590d\u5236\u5fae\u4fe1\u53f7\u3002",
  wechatCopyFailed: "\u8bf7\u624b\u52a8\u590d\u5236\u5fae\u4fe1\u53f7\u3002",
  chatError: (status) => `\u6a21\u578b\u63a5\u53e3\u8bf7\u6c42\u5931\u8d25\uff1a${status}`,
  imageError: (status) => `\u56fe\u50cf\u63a5\u53e3\u8bf7\u6c42\u5931\u8d25\uff1a${status}`,
  backendNotConfigured: "\u656c\u8bf7\u671f\u5f85"
};

const IMAGE_MODE_CONTENT = {
  edit: {
    kicker: "EDIT",
    title: "修改图片",
    desc: "上传需要修改的原图，用文字说明要调整的内容。",
    points: ["原图必填", "局部修改", "保留主体"],
    promptLabel: "修改要求",
    placeholder: "例如：把背景改成科技蓝色，保留人物和衣服细节。",
    sourceTitle: "上传原图",
    sourceHint: "修改模式必填，支持多张",
    templateTitle: "参考模板",
    templateHint: "修改模式不需要模板",
    templateUploadTitle: "上传模板图",
    templateUploadHint: "修改模式不需要模板图",
    previewLabel: "原图编辑模式",
    emptyResult: "上传原图并填写修改要求后，会调用图片修改接口。",
    pending: "正在整理修改请求参数...",
    requiredError: "请先上传至少一张需要修改的原图。"
  },
  generate: {
    kicker: "TEXT TO IMAGE",
    title: "生成图片",
    desc: "不上传图片时就是文生图；上传参考图时会按参考内容辅助生成。",
    points: ["文字驱动", "参考图可选", "适合从零创作"],
    promptLabel: "生成描述",
    placeholder: "例如：生成一张蓝紫色科技感产品海报，中心有发光玻璃质感的 AI 控制台。",
    sourceTitle: "上传参考图",
    sourceHint: "可选，不上传时就是文生图",
    templateTitle: "生成参考模板",
    templateHint: "可选，用来约束画面风格",
    templateUploadTitle: "上传灵感参考",
    templateUploadHint: "可选，用来提供构图或色彩方向",
    previewLabel: "文生图模式",
    emptyResult: "输入描述即可生成；参考图和模板是可选增强项。",
    pending: "正在准备生成请求..."
  },
  imitate: {
    kicker: "STYLE IMITATION",
    title: "模仿图片",
    desc: "上传风格参考图或模板图，让模型模仿它的风格、色彩和构图再生成。",
    points: ["参考图必填", "风格迁移", "适合系列化创作"],
    promptLabel: "模仿目标",
    placeholder: "例如：模仿参考图的蓝紫科技感和光影层次，生成一张新的工作室宣传图。",
    sourceTitle: "上传风格参考",
    sourceHint: "必填，请上传想要模仿的图片",
    templateTitle: "风格模板",
    templateHint: "可选，辅助限定模仿方向",
    templateUploadTitle: "上传模板图",
    templateUploadHint: "建议上传，可同时提供多张风格参考",
    previewLabel: "风格模仿模式",
    emptyResult: "模仿图片需要至少一张参考图或模板图，再填写要生成的新画面。",
    pending: "正在整理模仿参考素材...",
    requiredError: "模仿图片请先上传至少一张风格参考图。"
  }
};

const state = {
  view: "home",
  model: "gpt",
  imageMode: "edit",
  conversations: {
    gpt: [],
    claude: [],
    mimo: []
  }
};

const MAX_CONTEXT_MESSAGES = 12;
const INTRO_DURATION_MS = 2200;
const INTRO_EXIT_MS = 520;

const canvas = document.querySelector("#particle-field");
const ctx = canvas.getContext("2d");
const particles = [];
const comets = [];
const twinkles = [];
const ripples = [];
const pointerTrail = [];
let nextCometTime = 0;
let particlesStarted = false;
let particleAnimationId = 0;

const PARTICLE_COLORS = ["100, 241, 255", "100, 241, 255", "90, 151, 255", "138, 86, 255"];
const TWINKLE_COLORS = ["5, 199, 232", "138, 86, 255", "255, 255, 255"];

const pointerState = { x: -1000, y: -1000, active: false };
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reducedMotion;

window.addEventListener("pointermove", (event) => {
  pointerState.x = event.clientX;
  pointerState.y = event.clientY;
  pointerState.active = true;
  if (finePointer) {
    pointerTrail.push({ x: event.clientX, y: event.clientY, life: 1 });
    if (pointerTrail.length > 26) pointerTrail.shift();
  }
});

window.addEventListener("pointerdown", (event) => {
  if (reducedMotion) return;
  ripples.push({ x: event.clientX, y: event.clientY, r: 4, alpha: 0.5 });
  if (ripples.length > 6) ripples.shift();
});

window.addEventListener("pointerout", (event) => {
  if (!event.relatedTarget) {
    pointerState.active = false;
  }
});

window.addEventListener("blur", () => {
  pointerState.active = false;
});

function isCompactViewport() {
  return window.innerWidth <= 680 || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, isCompactViewport() ? 1.15 : 1.5);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function seedParticles() {
  particles.length = 0;
  const area = window.innerWidth * window.innerHeight;
  const total = isCompactViewport()
    ? Math.min(34, Math.floor(area / 18000))
    : Math.min(76, Math.floor(area / 15000));
  for (let i = 0; i < total; i += 1) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      size: Math.random() * 1.4 + 0.5,
      alpha: Math.random() * 0.42 + 0.18,
      color: PARTICLE_COLORS[i % PARTICLE_COLORS.length]
    });
  }
}

function seedTwinkles() {
  twinkles.length = 0;
  const area = window.innerWidth * window.innerHeight;
  const total = isCompactViewport()
    ? Math.min(14, Math.floor(area / 60000))
    : Math.min(32, Math.floor(area / 40000));
  for (let i = 0; i < total; i += 1) {
    twinkles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 1.6 + 0.6,
      phase: Math.random() * Math.PI * 2,
      speed: 0.012 + Math.random() * 0.025,
      color: TWINKLE_COLORS[i % TWINKLE_COLORS.length]
    });
  }
}

function drawTwinkles() {
  twinkles.forEach((t) => {
    t.phase += t.speed;
    const wave = (Math.sin(t.phase) + 1) / 2;
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.size + wave * 1.2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${t.color}, ${0.08 + wave * 0.5})`;
    ctx.fill();
    if (wave > 0.82) {
      const sparkle = (wave - 0.82) * 4;
      const arm = t.size * 5;
      ctx.strokeStyle = `rgba(${t.color}, ${sparkle * 0.55})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(t.x - arm, t.y);
      ctx.lineTo(t.x + arm, t.y);
      ctx.moveTo(t.x, t.y - arm);
      ctx.lineTo(t.x, t.y + arm);
      ctx.stroke();
    }
  });
}

function drawPointerTrail() {
  for (let i = pointerTrail.length - 1; i >= 0; i -= 1) {
    pointerTrail[i].life -= 0.045;
    if (pointerTrail[i].life <= 0) pointerTrail.splice(i, 1);
  }
  for (let i = 1; i < pointerTrail.length; i += 1) {
    const a = pointerTrail[i - 1];
    const b = pointerTrail[i];
    const alpha = b.life * (i / pointerTrail.length) * 0.32;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = `rgba(5, 199, 232, ${alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function drawRipples() {
  for (let i = ripples.length - 1; i >= 0; i -= 1) {
    const r = ripples[i];
    r.r += 3.4;
    r.alpha *= 0.94;
    if (r.alpha < 0.02) {
      ripples.splice(i, 1);
      continue;
    }
    ctx.beginPath();
    ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(5, 199, 232, ${r.alpha})`;
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(r.x, r.y, r.r * 0.62, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(138, 86, 255, ${r.alpha * 0.7})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function spawnComet() {
  const fromLeft = Math.random() < 0.5;
  comets.push({
    x: Math.random() * window.innerWidth * 0.7 + (fromLeft ? 0 : window.innerWidth * 0.3),
    y: -40,
    vx: (fromLeft ? 1 : -1) * (2.6 + Math.random() * 2.6),
    vy: 1.7 + Math.random() * 1.8,
    len: 80 + Math.random() * 80,
    width: 1.5 + Math.random() * 1.2,
    alpha: 0.45 + Math.random() * 0.35
  });
}

function maybeSpawnComet(now) {
  if (isCompactViewport()) return;
  if (now < nextCometTime) return;
  nextCometTime = now + 1500 + Math.random() * 2600;
  spawnComet();
  if (Math.random() < 0.3 && comets.length < 6) {
    spawnComet();
  }
}

function drawComets() {
  for (let i = comets.length - 1; i >= 0; i -= 1) {
    const c = comets[i];
    c.x += c.vx;
    c.y += c.vy;
    const speed = Math.hypot(c.vx, c.vy) || 1;
    const tailX = c.x - (c.vx / speed) * c.len;
    const tailY = c.y - (c.vy / speed) * c.len;
    const gradient = ctx.createLinearGradient(c.x, c.y, tailX, tailY);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${c.alpha})`);
    gradient.addColorStop(0.3, `rgba(5, 199, 232, ${c.alpha * 0.7})`);
    gradient.addColorStop(1, "rgba(138, 86, 255, 0)");
    ctx.beginPath();
    ctx.moveTo(c.x, c.y);
    ctx.lineTo(tailX, tailY);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = c.width || 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(c.x, c.y, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${c.alpha})`;
    ctx.fill();
    if (c.y > window.innerHeight + 80 || c.x < -120 || c.x > window.innerWidth + 120) {
      comets.splice(i, 1);
    }
  }
}

function drawParticles(now = performance.now()) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  const compact = isCompactViewport();
  const linkDistance = compact ? 72 : 94;
  const pointerRange = 150;

  if (!reducedMotion) {
    drawTwinkles();
  }

  particles.forEach((p, index) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
    if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;

    if (pointerState.active && !compact) {
      const dxm = p.x - pointerState.x;
      const dym = p.y - pointerState.y;
      const dm = Math.hypot(dxm, dym);
      if (dm < pointerRange) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(pointerState.x, pointerState.y);
        ctx.strokeStyle = `rgba(5, 199, 232, ${(1 - dm / pointerRange) * 0.24})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        if (dm > 0.01) {
          const push = (1 - dm / pointerRange) * 0.022;
          p.vx += (dxm / dm) * push;
          p.vy += (dym / dm) * push;
        }
      }
    }

    if (Math.hypot(p.vx, p.vy) > 0.55) {
      p.vx *= 0.96;
      p.vy *= 0.96;
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color || "100, 241, 255"}, ${p.alpha})`;
    ctx.fill();

    if (compact && index % 2 === 1) return;

    for (let j = index + 1; j < particles.length; j += 1) {
      const q = particles[j];
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      const dist = Math.hypot(dx, dy);
      if (dist < linkDistance) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(90, 151, 255, ${(1 - dist / linkDistance) * 0.12})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  });

  if (!reducedMotion) {
    drawPointerTrail();
    drawRipples();
    maybeSpawnComet(now);
    drawComets();
  }
  particleAnimationId = requestAnimationFrame(drawParticles);
}

function startParticles() {
  if (particlesStarted) return;
  particlesStarted = true;
  drawParticles();
}

function burstAt(element) {
  const rect = element.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;
  for (let i = 0; i < 18; i += 1) {
    const spark = document.createElement("span");
    const angle = (Math.PI * 2 * i) / 18;
    const distance = 36 + Math.random() * 40;
    spark.className = "spark";
    spark.style.left = `${originX}px`;
    spark.style.top = `${originY}px`;
    spark.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    spark.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    document.body.appendChild(spark);
    spark.addEventListener("animationend", () => spark.remove());
  }
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Continue to the form-based fallback when browser permissions block Clipboard API.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, text.length);

  try {
    return document.execCommand("copy");
  } finally {
    textarea.remove();
  }
}

function playViewStagger(view) {
  if (view === "home" || reducedMotion) return;
  const panel = document.querySelector(`#${view}-view`);
  if (!panel) return;
  const targets = panel.querySelectorAll(
    ".section-heading, .product-card, .service-card, .process-strip, .service-actions, .model-strip, .chat-panel, .mode-tabs, .image-form, .preview-panel, .contact-panel"
  );
  targets.forEach((element, index) => {
    element.style.animation = "none";
    void element.offsetWidth;
    element.style.animation = `staggerRise 560ms cubic-bezier(0.16, 1, 0.3, 1) ${70 + index * 70}ms both`;
    element.addEventListener("animationend", () => {
      element.style.animation = "";
    }, { once: true });
  });
}

function switchView(view) {
  state.view = view;
  document.body.dataset.view = view;
  if (view !== "home" && document.body.dataset.loading) {
    delete document.body.dataset.loading;
  }
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
  document.querySelectorAll(".view").forEach((panel) => {
    panel.classList.toggle("view-active", panel.id === `${view}-view`);
  });
  playViewStagger(view);
  const titles = {
    home: TEXT.homeTitle,
    products: TEXT.productsTitle,
    services: TEXT.servicesTitle,
    chat: TEXT.chatTitle,
    image: TEXT.imageTitle,
    contact: TEXT.contactTitle
  };
  document.querySelector("#view-title").textContent = titles[view];
}

function switchModel(model) {
  state.model = model;
  const modelMeta = API_CONFIG.chat[model];
  document.querySelectorAll(".model-card").forEach((button) => {
    const active = button.dataset.model === model;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  document.querySelector(".chat-panel").dataset.modelSkin = model;
  document.querySelector("#model-watermark-img").src = modelMeta.icon;
  renderConversation(model);
}

function updateImageModeContent(mode) {
  const content = IMAGE_MODE_CONTENT[mode] || IMAGE_MODE_CONTENT.edit;
  const form = document.querySelector("#image-form");
  const preview = document.querySelector(".preview-panel");
  const guide = document.querySelector("#image-mode-guide");
  const prompt = document.querySelector("#image-prompt");
  const points = document.querySelector("#image-mode-points");

  form.dataset.mode = mode;
  preview.dataset.mode = mode;
  guide.dataset.mode = mode;
  document.querySelector("#image-mode-kicker").textContent = content.kicker;
  document.querySelector("#image-mode-title").textContent = content.title;
  document.querySelector("#image-mode-desc").textContent = content.desc;
  document.querySelector("#image-prompt-label").textContent = content.promptLabel;
  prompt.placeholder = content.placeholder;
  document.querySelector("#source-upload-title").textContent = content.sourceTitle;
  document.querySelector("#source-upload-hint").textContent = content.sourceHint;
  document.querySelector("#template-select-title").textContent = content.templateTitle;
  document.querySelector("#template-select-hint").textContent = content.templateHint;
  document.querySelector("#template-upload-title").textContent = content.templateUploadTitle;
  document.querySelector("#template-upload-hint").textContent = content.templateUploadHint;

  points.replaceChildren(...content.points.map((item) => {
    const element = document.createElement("li");
    element.textContent = item;
    return element;
  }));
  setImageResult(content.emptyResult, content.previewLabel);
}

function switchImageMode(mode) {
  state.imageMode = mode;
  document.querySelector("#image-mode").value = mode;
  document.querySelectorAll(".mode-tab").forEach((button) => {
    const active = button.dataset.mode === mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });

  document.querySelectorAll("[data-requires]").forEach((field) => {
    const allowed = field.dataset.requires.split(" ").includes(mode);
    field.toggleAttribute("hidden-by-mode", !allowed);
    field.querySelectorAll("input, select, textarea").forEach((control) => {
      control.disabled = !allowed;
    });
  });

  const labels = {
    edit: TEXT.editLabel,
    generate: TEXT.generateLabel,
    imitate: TEXT.imitateLabel
  };
  document.querySelector("#image-submit-label").textContent = labels[mode];
  updateImageModeContent(mode);
  renderCurrentImagePreview();
}

function buildInitialMessage(model) {
  const modelMeta = API_CONFIG.chat[model];
  return {
    kind: "ai",
    author: "\u843d\u843d AI \u4e2d\u67a2",
    text: `\u5f53\u524d\u662f ${modelMeta.name} \u72ec\u7acb\u5bf9\u8bdd\u9875\u3002\u8fd9\u91cc\u7684\u8bb0\u5f55\u4e0d\u4f1a\u548c\u5176\u4ed6\u6a21\u578b\u6df7\u5728\u4e00\u8d77\u3002`,
    icon: "assets/studio-logo.jpg",
    role: "assistant"
  };
}

function ensureConversation(model) {
  if (!state.conversations[model]) {
    state.conversations[model] = [];
  }
  if (state.conversations[model].length === 0) {
    state.conversations[model].push(buildInitialMessage(model));
  }
}

function renderConversation(model = state.model) {
  ensureConversation(model);
  const feed = document.querySelector("#chat-feed");
  feed.innerHTML = "";
  state.conversations[model].forEach((message) => {
    feed.appendChild(createMessageElement(message));
  });
  feed.scrollTop = feed.scrollHeight;
}

function createMessageElement({ kind, author, text, icon }) {
  const article = document.createElement("article");
  article.className = `message ${kind}`;
  article.innerHTML = `
    <img src="${icon || "assets/studio-logo.jpg"}" alt="" />
    <div>
      <span>${author}</span>
      <div class="message-content"></div>
    </div>
  `;
  article.querySelector(".message-content").innerHTML = renderMarkdown(text || "");
  return article;
}

function appendMessage(kind, author, text, icon = "assets/studio-logo.jpg", model = state.model, role = kind === "user" ? "user" : "assistant") {
  ensureConversation(model);
  const message = { kind, author, text, icon, role };
  state.conversations[model].push(message);
  const feed = document.querySelector("#chat-feed");
  feed.appendChild(createMessageElement(message));
  feed.scrollTop = feed.scrollHeight;
  return message;
}

async function callChatApi(message) {
  const model = API_CONFIG.chat[state.model];
  const payload = {
    model: state.model,
    message,
    messages: buildContextMessages(state.model, message)
  };

  if (!API_CONFIG.useMockApi) {
    const response = await fetch(model.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(formatApiError(response.status, data, TEXT.chatError, { hideMissingEnv: true }));
    }

    return data;
  }

  return {
    text: TEXT.mockChat(model.name, model.endpoint)
  };
}

async function callImageApi(form) {
  const summary = summarizeImageForm(form);
  const shouldUseEditEndpoint = state.imageMode === "generate" && (summary.imageCount > 0 || summary.templateImageCount > 0);
  const endpoint = shouldUseEditEndpoint ? API_CONFIG.image.edit : API_CONFIG.image[state.imageMode];
  const formData = new FormData(form);
  const prompt = String(formData.get("prompt") || "").trim();
  const content = IMAGE_MODE_CONTENT[state.imageMode] || IMAGE_MODE_CONTENT.edit;
  if (!prompt) {
    throw new Error(TEXT.promptRequired);
  }
  if (state.imageMode === "edit" && summary.imageCount === 0) {
    throw new Error(content.requiredError || TEXT.imageRequired);
  }
  if (state.imageMode === "imitate" && summary.imageCount + summary.templateImageCount === 0) {
    throw new Error(content.requiredError || TEXT.imageRequired);
  }
  formData.set("prompt", prompt);
  formData.set("mode", state.imageMode);
  formData.set("target", shouldUseEditEndpoint ? "edit" : state.imageMode);

  const payload = {
    mode: state.imageMode,
    prompt,
    templates: formData.getAll("templates").filter(Boolean)
  };

  if (!API_CONFIG.useMockApi) {
    const response = await fetch(endpoint, shouldUseEditEndpoint || summary.imageCount > 0 || summary.templateImageCount > 0
      ? {
          method: "POST",
          body: formData
        }
      : {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(formatApiError(response.status, data, TEXT.imageError));
    }

    return data;
  }

  return {
    endpoint,
    message: TEXT.mockImage(endpoint)
  };
}

function summarizeImageForm(form) {
  const formData = new FormData(form);
  const imageCount = formData.getAll("images").filter((item) => item instanceof File && item.size > 0).length;
  const templateImageCount = formData.getAll("template_images").filter((item) => item instanceof File && item.size > 0).length;
  const templateCount = formData.getAll("templates").filter(Boolean).length;
  return { imageCount, templateImageCount, templateCount };
}

function formatApiError(status, data, fallback, options = {}) {
  const message = data?.error?.message || data?.detail?.error?.message || data?.detail?.message || data?.error || data?.message || "";
  if (options.hideMissingEnv && message.includes("Missing server environment variable")) {
    return TEXT.backendNotConfigured;
  }
  if (message) return message;
  if (data?.detail) {
    try {
      return JSON.stringify(data.detail);
    } catch {
      return String(data.detail);
    }
  }
  return fallback(status);
}

function setImageResult(message, label = "GPTIMAGE2") {
  const result = document.querySelector("#image-result");
  const title = document.createElement("strong");
  const text = document.createElement("span");
  title.textContent = label;
  text.textContent = message;
  result.replaceChildren(title, text);
}

function extractGeneratedImages(response) {
  const candidates = [];
  const items = Array.isArray(response?.data) ? response.data : [];

  items.forEach((item) => {
    if (item?.url) {
      candidates.push({ src: item.url, alt: item.revised_prompt || "\u751f\u6210\u56fe\u7247" });
    }
    if (item?.b64_json) {
      candidates.push({ src: `data:image/png;base64,${item.b64_json}`, alt: item.revised_prompt || "\u751f\u6210\u56fe\u7247" });
    }
  });

  if (response?.url) {
    candidates.push({ src: response.url, alt: "\u751f\u6210\u56fe\u7247" });
  }

  if (response?.image_url) {
    candidates.push({ src: response.image_url, alt: "\u751f\u6210\u56fe\u7247" });
  }

  return candidates;
}

function renderGeneratedImages(images) {
  const stage = document.querySelector("#preview-stage");
  const scanline = stage.querySelector(".scanline");
  stage.querySelectorAll("img, .preview-grid").forEach((item) => item.remove());

  if (!images.length) return;

  const container = images.length === 1 ? stage : document.createElement("div");
  if (images.length > 1) {
    container.className = "preview-grid generated-grid";
    stage.insertBefore(container, scanline);
  }

  images.slice(0, 4).forEach((item) => {
    const image = document.createElement("img");
    image.src = item.src;
    image.alt = item.alt;
    if (images.length === 1) {
      stage.insertBefore(image, scanline);
    } else {
      container.appendChild(image);
    }
  });
}

function extractModelContent(response) {
  return (
    response?.choices?.[0]?.message?.content ||
    response?.choices?.[0]?.text ||
    response?.output_text ||
    response?.text ||
    response?.message ||
    response?.content ||
    TEXT.modelReturned
  );
}

function buildContextMessages(model, nextMessage) {
  ensureConversation(model);
  const history = state.conversations[model]
    .filter((item) => item.role === "user" || item.role === "assistant")
    .slice(-MAX_CONTEXT_MESSAGES)
    .map((item) => ({
      role: item.role,
      content: item.text
    }));

  history.push({
    role: "user",
    content: nextMessage
  });

  return history;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isEscaped(source, index) {
  let slashCount = 0;
  for (let i = index - 1; i >= 0 && source[i] === "\\"; i -= 1) {
    slashCount += 1;
  }
  return slashCount % 2 === 1;
}

function findUnescaped(source, delimiter, fromIndex) {
  for (let i = fromIndex; i <= source.length - delimiter.length; i += 1) {
    if (source.startsWith(delimiter, i) && !isEscaped(source, i)) {
      return i;
    }
  }
  return -1;
}

function findDisplayMathStart(source, fromIndex) {
  for (let i = fromIndex; i < source.length; i += 1) {
    if (source.startsWith("$$", i) && !isEscaped(source, i)) {
      return { index: i, open: "$$", close: "$$" };
    }
    if (source.startsWith("\\[", i) && !isEscaped(source, i)) {
      return { index: i, open: "\\[", close: "\\]" };
    }
  }
  return null;
}

function splitDisplayMath(source) {
  const tokens = [];
  let index = 0;

  while (index < source.length) {
    const start = findDisplayMathStart(source, index);
    if (!start) {
      tokens.push({ type: "text", value: source.slice(index) });
      break;
    }

    if (start.index > index) {
      tokens.push({ type: "text", value: source.slice(index, start.index) });
    }

    const contentStart = start.index + start.open.length;
    const contentEnd = findUnescaped(source, start.close, contentStart);
    if (contentEnd === -1) {
      tokens.push({ type: "text", value: source.slice(start.index) });
      break;
    }

    tokens.push({
      type: "math",
      value: source.slice(contentStart, contentEnd)
    });
    index = contentEnd + start.close.length;
  }

  return tokens;
}

function renderMath(latex, displayMode = false) {
  const source = String(latex || "").trim();
  if (!source) return "";

  if (window.katex?.renderToString) {
    return window.katex.renderToString(source, {
      displayMode,
      throwOnError: false,
      strict: "ignore",
      trust: false
    });
  }

  return escapeHtml(displayMode ? `$$${source}$$` : `\\(${source}\\)`);
}

function renderBasicInlineMarkdown(value) {
  return escapeHtml(value).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function shouldRenderDollarMath(value) {
  const trimmed = value.trim();
  return Boolean(trimmed) && trimmed === value && !/^\d+(?:[.,]\d+)?$/.test(trimmed);
}

function findInlineDollarClose(source, fromIndex) {
  for (let i = fromIndex; i < source.length; i += 1) {
    if (source[i] === "$" && source[i + 1] !== "$" && source[i - 1] !== "$" && !isEscaped(source, i)) {
      return i;
    }
  }
  return -1;
}

function renderInlineText(value) {
  const source = String(value || "");
  let html = "";
  let buffer = "";
  let index = 0;

  while (index < source.length) {
    if (source.startsWith("\\(", index) && !isEscaped(source, index)) {
      const end = findUnescaped(source, "\\)", index + 2);
      if (end > -1) {
        html += renderBasicInlineMarkdown(buffer);
        buffer = "";
        html += `<span class="math-inline">${renderMath(source.slice(index + 2, end), false)}</span>`;
        index = end + 2;
        continue;
      }
    }

    if (source[index] === "$" && source[index + 1] !== "$" && !isEscaped(source, index)) {
      const end = findInlineDollarClose(source, index + 1);
      if (end > -1) {
        const latex = source.slice(index + 1, end);
        if (shouldRenderDollarMath(latex)) {
          html += renderBasicInlineMarkdown(buffer);
          buffer = "";
          html += `<span class="math-inline">${renderMath(latex, false)}</span>`;
          index = end + 1;
          continue;
        }
      }
    }

    buffer += source[index];
    index += 1;
  }

  return html + renderBasicInlineMarkdown(buffer);
}

function renderInlineMarkdown(value) {
  const parts = String(value || "").split(/`([^`]+)`/g);
  return parts
    .map((part, index) => (index % 2 === 1
      ? `<code>${escapeHtml(part)}</code>`
      : renderInlineText(part)))
    .join("");
}

function renderTextMarkdownBlock(value) {
  const lines = String(value || "").trim().split(/\n+/).filter(Boolean);
  let html = "";
  let listOpen = false;

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (/^---+$/.test(trimmed)) {
      if (listOpen) {
        html += "</ul>";
        listOpen = false;
      }
      html += "<hr />";
      return;
    }

    const bullet = trimmed.match(/^[-*]\s+(.+)$/);
    const numbered = trimmed.match(/^\d+[.)]\s+(.+)$/);
    if (bullet || numbered) {
      if (!listOpen) {
        html += "<ul>";
        listOpen = true;
      }
      html += `<li>${renderInlineMarkdown((bullet || numbered)[1])}</li>`;
      return;
    }

    if (listOpen) {
      html += "</ul>";
      listOpen = false;
    }

    html += `<p>${renderInlineMarkdown(trimmed)}</p>`;
  });

  if (listOpen) {
    html += "</ul>";
  }

  return html;
}

function renderMarkdown(markdown) {
  const source = String(markdown || "");
  const parts = source.split(/```([\s\S]*?)```/g);
  let html = "";

  parts.forEach((part, index) => {
    if (index % 2 === 1) {
      const firstBreak = part.indexOf("\n");
      const maybeLang = firstBreak > -1 ? part.slice(0, firstBreak).trim() : "";
      const hasLang = firstBreak > -1 && /^[a-zA-Z0-9_+#.-]+$/.test(maybeLang);
      const code = hasLang ? part.slice(firstBreak + 1) : part;
      const lang = hasLang ? maybeLang : "";
      html += `<pre class="code-block"><span>${escapeHtml(lang || "code")}</span><code>${escapeHtml(code.trim())}</code></pre>`;
      return;
    }

    splitDisplayMath(part).forEach((token) => {
      if (token.type === "math") {
        html += `<div class="math-block">${renderMath(token.value, true)}</div>`;
        return;
      }
      html += renderTextMarkdownBlock(token.value);
    });
  });

  return html || "<p></p>";
}

document.querySelectorAll(".nav-button").forEach((button) => {
  button.addEventListener("click", () => {
    burstAt(button);
    switchView(button.dataset.view);
  });
});

document.querySelectorAll("[data-view-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    burstAt(button);
    switchView(button.dataset.viewJump);
  });
});

document.querySelector("[data-copy-wechat]")?.addEventListener("click", async (event) => {
  const status = document.querySelector("#contact-status");
  burstAt(event.currentTarget);
  try {
    const copied = await copyTextToClipboard("luoluochat111");
    status.textContent = copied ? TEXT.wechatCopied : TEXT.wechatCopyFailed;
  } catch (error) {
    status.textContent = TEXT.wechatCopyFailed;
  }
});

document.querySelectorAll(".model-card").forEach((button) => {
  button.addEventListener("click", () => {
    burstAt(button);
    switchModel(button.dataset.model);
  });
});

document.querySelectorAll(".mode-tab").forEach((button) => {
  button.addEventListener("click", () => {
    burstAt(button);
    switchImageMode(button.dataset.mode);
  });
});

document.querySelectorAll("[data-particle-button]").forEach((button) => {
  button.addEventListener("click", () => burstAt(button));
});

document.querySelector("#chat-input").addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.ctrlKey) {
    event.preventDefault();
    document.querySelector("#chat-form").requestSubmit();
  }
});

document.querySelector("#chat-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const input = document.querySelector("#chat-input");
  const message = input.value.trim();
  if (!message) return;

  const modelMeta = API_CONFIG.chat[state.model];
  const activeModel = state.model;
  appendMessage("user", TEXT.you, message, "assets/studio-logo.jpg", activeModel);
  input.value = "";
  const pendingMessage = appendMessage("ai", modelMeta.name, TEXT.connecting, modelMeta.icon, activeModel);

  const pending = document.querySelector("#chat-feed .message:last-child .message-content");
  try {
    const response = await callChatApi(message);
    pendingMessage.text = extractModelContent(response);
    if (state.model === activeModel) {
      pending.innerHTML = renderMarkdown(pendingMessage.text);
    }
  } catch (error) {
    pendingMessage.text = error.message;
    if (state.model === activeModel) {
      pending.innerHTML = renderMarkdown(pendingMessage.text);
    }
  }
});

function renderImagePreview(files) {
  const stage = document.querySelector("#preview-stage");
  const scanline = stage.querySelector(".scanline");
  stage.querySelectorAll("img, .preview-grid").forEach((item) => item.remove());

  const selected = Array.from(files || []).filter((file) => file.type.startsWith("image/")).slice(0, 4);
  if (selected.length === 0) {
    const image = document.createElement("img");
    image.src = "assets/studio-logo.jpg";
    image.alt = "\u843d\u843d\u5de5\u4f5c\u5ba4\u9884\u89c8";
    stage.insertBefore(image, scanline);
    return;
  }

  const container = selected.length === 1 ? stage : document.createElement("div");
  if (selected.length > 1) {
    container.className = "preview-grid";
    stage.insertBefore(container, scanline);
  }

  selected.forEach((file) => {
    const image = document.createElement("img");
    const url = URL.createObjectURL(file);
    image.src = url;
    image.alt = file.name;
    image.onload = () => URL.revokeObjectURL(url);
    if (selected.length === 1) {
      stage.insertBefore(image, scanline);
    } else {
      container.appendChild(image);
    }
  });
}

function getSelectedPreviewFiles() {
  const sourceFiles = Array.from(document.querySelector("#source-image").files || []);
  const templateFiles = Array.from(document.querySelector("#template-images").files || []);
  return sourceFiles.concat(templateFiles);
}

function renderCurrentImagePreview() {
  renderImagePreview(getSelectedPreviewFiles());
}

document.querySelector("#source-image").addEventListener("change", renderCurrentImagePreview);
document.querySelector("#template-images").addEventListener("change", renderCurrentImagePreview);

document.querySelector("#image-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = event.currentTarget.querySelector("button[type='submit']");
  const summary = summarizeImageForm(event.currentTarget);
  const content = IMAGE_MODE_CONTENT[state.imageMode] || IMAGE_MODE_CONTENT.edit;
  setImageResult(`${content.pending} \u539f\u56fe ${summary.imageCount} \u5f20\uff0c\u6a21\u677f ${summary.templateCount} \u4e2a\uff0c\u6a21\u677f\u56fe ${summary.templateImageCount} \u5f20\u3002`, content.previewLabel);
  submitButton.disabled = true;
  try {
    const response = await callImageApi(event.currentTarget);
    const images = extractGeneratedImages(response);
    if (images.length > 0) {
      renderGeneratedImages(images);
    }
    setImageResult(response.message || (images.length > 0 ? TEXT.modelReturned : TEXT.imageSubmitted), content.previewLabel);
  } catch (error) {
    setImageResult(error.message, content.previewLabel);
  } finally {
    submitButton.disabled = false;
  }
});

window.addEventListener("resize", () => {
  resizeCanvas();
  seedParticles();
  seedTwinkles();
});

function finishIntroLoading() {
  if (state.view !== "home" || document.body.dataset.loading !== "true") {
    return;
  }
  document.body.dataset.loading = "false";
  window.setTimeout(() => {
    if (document.body.dataset.loading === "false") {
      delete document.body.dataset.loading;
    }
    startParticles();
  }, INTRO_EXIT_MS);
}

function scheduleIntroLoading() {
  const startedAt = Number(document.body.dataset.loadingStartedAt || Date.now());
  const elapsed = Date.now() - startedAt;
  const remaining = Math.max(0, INTRO_DURATION_MS - elapsed);
  window.setTimeout(finishIntroLoading, remaining);
}

function attachCardEffects() {
  if (!finePointer) return;

  document
    .querySelectorAll(".feature-card, .product-card, .service-card, .studio-metrics div, .process-strip div")
    .forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        card.style.setProperty("--my", `${event.clientY - rect.top}px`);
      });
    });

  document.querySelectorAll(".feature-card, .product-card, .service-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${(-ny * 5).toFixed(2)}deg) rotateY(${(nx * 6).toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });

  const hero = document.querySelector(".hero-showcase");
  const heroLogo = document.querySelector(".meteor-logo img");
  if (hero && heroLogo) {
    hero.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      heroLogo.style.transform = `translate3d(${(nx * 14).toFixed(1)}px, ${(ny * 10).toFixed(1)}px, 0)`;
    });
    hero.addEventListener("pointerleave", () => {
      heroLogo.style.transform = "";
    });
  }
}

resizeCanvas();
seedParticles();
seedTwinkles();
attachCardEffects();
document.body.dataset.view = state.view;
switchImageMode("edit");
renderConversation(state.model);

if (document.readyState === "complete") {
  scheduleIntroLoading();
} else {
  window.addEventListener("load", () => {
    scheduleIntroLoading();
  }, { once: true });
}

if (state.view !== "home" || !document.body.dataset.loading) {
  startParticles();
}

const STORAGE_KEY = "cyberstart.links.v1";
const DB_NAME = "CyberStartDB";
const DB_STORE = "settings";
const DEFAULT_LINKS = [
  { name: "YouTube", url: "https://www.youtube.com" },
  { name: "Google", url: "https://www.google.com" },
  { name: "GitHub", url: "https://github.com" },
  { name: "Discord", url: "https://discord.com/app" }
];

const grid = document.getElementById("linksGrid");
const emptyState = document.getElementById("emptyState");
const linkDialog = document.getElementById("linkDialog");
const settingsDialog = document.getElementById("settingsDialog");
let links = loadLinks();

function loadLinks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : DEFAULT_LINKS;
  } catch {
    return DEFAULT_LINKS;
  }
}
function saveLinks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}
function getDomain(url) {
  try { return new URL(url).hostname; } catch { return ""; }
}
function renderLinks() {
  grid.replaceChildren();
  emptyState.hidden = links.length !== 0;
  links.forEach((link) => {
    const card = document.createElement("a");
    card.className = "link-card";
    card.href = link.url;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.title = `${link.name} — ${link.url}`;

    const iconWrap = document.createElement("span");
    iconWrap.className = "favicon-wrap";
    const fallback = document.createElement("span");
    fallback.textContent = (link.name || "?").trim().charAt(0).toUpperCase();
    iconWrap.appendChild(fallback);

    let parsedUrl;
    try { parsedUrl = new URL(link.url); } catch { parsedUrl = null; }
    const domain = parsedUrl ? parsedUrl.hostname : "";

    if (domain && parsedUrl.protocol.startsWith("http")) {
      const img = document.createElement("img");
      img.alt = "";
      img.className = "favicon-image";
      img.decoding = "async";
      img.loading = "eager";

      // Plusieurs sources sont testées : certaines plateformes ne publient
      // pas leur favicon à l'emplacement standard.
      const iconSources = [
        `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(parsedUrl.origin)}&sz=64`,
        `https://icons.duckduckgo.com/ip3/${encodeURIComponent(domain)}.ico`,
        `https://favicon.im/${encodeURIComponent(domain)}?larger=true`,
        `${parsedUrl.origin}/favicon.ico`,
        `${parsedUrl.origin}/apple-touch-icon.png`,
        `${parsedUrl.origin}/favicon.png`
      ];

      let sourceIndex = -1;
      let timeoutId;
      let finished = false;

      const tryNextSource = () => {
        if (finished) return;
        window.clearTimeout(timeoutId);
        sourceIndex += 1;

        if (sourceIndex >= iconSources.length) {
          finished = true;
          img.remove();
          fallback.hidden = false;
          return;
        }

        img.onload = () => {
          window.clearTimeout(timeoutId);
          if (img.naturalWidth > 0 && img.naturalHeight > 0) {
            finished = true;
            fallback.hidden = true;
            if (!img.isConnected) iconWrap.insertBefore(img, fallback);
          } else {
            tryNextSource();
          }
        };

        img.onerror = tryNextSource;
        img.src = iconSources[sourceIndex];

        // Certains serveurs ne répondent jamais : on passe à la source suivante.
        timeoutId = window.setTimeout(tryNextSource, 3500);
      };

      iconWrap.insertBefore(img, fallback);
      tryNextSource();
    }

    const name = document.createElement("span");
    name.className = "link-name";
    name.textContent = link.name;

    const remove = document.createElement("button");
    remove.className = "delete-link";
    remove.type = "button";
    remove.textContent = "×";
    remove.title = `Supprimer ${link.name}`;
    remove.setAttribute("aria-label", `Supprimer ${link.name}`);
    remove.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (confirm(`Supprimer le raccourci « ${link.name} » ?`)) {
        links.splice(links.indexOf(link), 1);
        saveLinks();
        renderLinks();
      }
    });

    card._link = link;
    card.append(iconWrap, name, remove);
    grid.appendChild(card);
  });
}

document.getElementById("addButton").addEventListener("click", () => {
  document.getElementById("linkForm").reset();
  document.getElementById("linkError").textContent = "";
  linkDialog.showModal();
  document.getElementById("siteName").focus();
});

document.getElementById("linkForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("siteName").value.trim();
  let rawUrl = document.getElementById("siteUrl").value.trim();
  const error = document.getElementById("linkError");
  if (!name || !rawUrl) {
    error.textContent = "Renseigne un nom et une adresse.";
    return;
  }
  if (!/^https?:\/\//i.test(rawUrl)) rawUrl = "https://" + rawUrl;
  let parsed;
  try { parsed = new URL(rawUrl); } catch {
    error.textContent = "Cette adresse URL ne semble pas valide.";
    return;
  }
  if (!["http:", "https:"].includes(parsed.protocol) || !parsed.hostname.includes(".")) {
    error.textContent = "Utilise une adresse de site valide (https://...).";
    return;
  }
  links.push({ name, url: parsed.href });
  saveLinks();
  renderLinks();
  linkDialog.close();
});

document.getElementById("searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const query = document.getElementById("searchInput").value.trim();
  if (query) {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(searchUrl, "_blank", "noopener,noreferrer");
  }
});

document.getElementById("settingsButton").addEventListener("click", () => settingsDialog.showModal());
document.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", () => document.getElementById(button.dataset.close).close());
});
[linkDialog, settingsDialog].forEach(dialog => {
  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });
});

const WALLPAPER_PREFIX = "wp:";
const LAST_WALLPAPER_KEY = "cyberstart.lastWallpaper.v1";
const wallpaperList = document.getElementById("wallpaperList");
let wallpapers = [];          // [{ key, blob }]
let currentWallpaperKey = null;
let currentWallpaperUrl = null;
let thumbUrls = [];

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(DB_STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function loadWallpapers() {
  try {
    const db = await openDatabase();
    return await new Promise((resolve, reject) => {
      const items = [];
      const request = db.transaction(DB_STORE, "readonly").objectStore(DB_STORE).openCursor();
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          const key = String(cursor.key);
          // "wallpaper" = ancien format (une seule image), conservé pour ne rien perdre
          if (cursor.value instanceof Blob && (key === "wallpaper" || key.startsWith(WALLPAPER_PREFIX))) {
            items.push({ key, blob: cursor.value });
          }
          cursor.continue();
        } else { db.close(); resolve(items); }
      };
      request.onerror = () => { db.close(); reject(request.error); };
    });
  } catch { return []; }
}
async function addWallpapers(files) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(DB_STORE, "readwrite");
    const store = transaction.objectStore(DB_STORE);
    files.forEach(file => {
      store.put(file, WALLPAPER_PREFIX + Date.now() + "-" + Math.random().toString(36).slice(2, 8));
    });
    transaction.oncomplete = () => { db.close(); resolve(); };
    transaction.onerror = () => { db.close(); reject(transaction.error); };
  });
}
async function deleteWallpapers(keys) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(DB_STORE, "readwrite");
    keys.forEach(key => transaction.objectStore(DB_STORE).delete(key));
    transaction.oncomplete = () => { db.close(); resolve(); };
    transaction.onerror = () => { db.close(); reject(transaction.error); };
  });
}
function applyWallpaper(blob) {
  if (currentWallpaperUrl) { URL.revokeObjectURL(currentWallpaperUrl); currentWallpaperUrl = null; }
  if (!blob) {
    currentWallpaperKey = null;
    document.body.classList.remove("has-wallpaper");
    document.body.style.removeProperty("--wallpaper");
    return;
  }
  currentWallpaperUrl = URL.createObjectURL(blob);
  document.body.classList.add("has-wallpaper");
  document.body.style.setProperty("--wallpaper", `url("${currentWallpaperUrl}")`);
}
// Choisit une image au hasard, en évitant de répéter la précédente quand c'est possible.
function pickRandomWallpaper() {
  if (!wallpapers.length) { applyWallpaper(null); return; }
  let last = null;
  try { last = localStorage.getItem(LAST_WALLPAPER_KEY); } catch {}
  let candidates = wallpapers.filter(item => item.key !== last);
  if (!candidates.length) candidates = wallpapers;
  const choice = candidates[Math.floor(Math.random() * candidates.length)];
  applyWallpaper(choice.blob);
  currentWallpaperKey = choice.key;
  try { localStorage.setItem(LAST_WALLPAPER_KEY, choice.key); } catch {}
}
function renderWallpaperList() {
  thumbUrls.forEach(url => URL.revokeObjectURL(url));
  thumbUrls = [];
  wallpaperList.replaceChildren();
  wallpapers.forEach(item => {
    const url = URL.createObjectURL(item.blob);
    thumbUrls.push(url);
    const thumb = document.createElement("div");
    thumb.className = "wallpaper-thumb";
    const img = document.createElement("img");
    img.src = url;
    img.alt = "";
    const del = document.createElement("button");
    del.type = "button";
    del.textContent = "×";
    del.title = "Supprimer cette image";
    del.setAttribute("aria-label", "Supprimer cette image");
    del.addEventListener("click", async () => {
      await deleteWallpapers([item.key]);
      wallpapers = wallpapers.filter(w => w.key !== item.key);
      renderWallpaperList();
      if (item.key === currentWallpaperKey) pickRandomWallpaper();
    });
    thumb.append(img, del);
    wallpaperList.appendChild(thumb);
  });
}
loadWallpapers().then(items => {
  wallpapers = items;
  renderWallpaperList();
  pickRandomWallpaper();
});

document.getElementById("wallpaperInput").addEventListener("change", async (event) => {
  const files = [...(event.target.files || [])].filter(file => file.type.startsWith("image/"));
  event.target.value = "";
  if (!files.length) { alert("Choisis un ou plusieurs fichiers image."); return; }
  try {
    await addWallpapers(files);
    wallpapers = await loadWallpapers();
    renderWallpaperList();
    if (!currentWallpaperKey) pickRandomWallpaper();
  } catch {
    alert("Impossible de sauvegarder ces images. Essaie des fichiers plus légers.");
  }
});
document.getElementById("resetWallpaper").addEventListener("click", async () => {
  if (!wallpapers.length) return;
  if (!confirm("Supprimer toutes les images de fond ?")) return;
  await deleteWallpapers(wallpapers.map(w => w.key));
  wallpapers = [];
  renderWallpaperList();
  applyWallpaper(null);
});
renderLinks();

/* ---------- Glisser-déposer pour réorganiser (souris + appui long sur mobile) ---------- */
let drag = null;
let suppressClick = false;

function startDrag() {
  const { card } = drag;
  const rect = card.getBoundingClientRect();
  drag.active = true;
  drag.offX = drag.x - rect.left;
  drag.offY = drag.y - rect.top;
  const ghost = card.cloneNode(true);
  ghost.classList.add("drag-ghost");
  ghost.style.width = rect.width + "px";
  ghost.style.height = rect.height + "px";
  document.body.appendChild(ghost);
  drag.ghost = ghost;
  card.classList.add("dragging");
  document.body.classList.add("is-dragging");
  moveDrag();
}
function moveDrag() {
  const { ghost, card } = drag;
  ghost.style.left = (drag.x - drag.offX) + "px";
  ghost.style.top = (drag.y - drag.offY) + "px";
  const target = document.elementFromPoint(drag.x, drag.y)?.closest(".link-card");
  if (target && target !== card && grid.contains(target)) {
    const cards = [...grid.children];
    if (cards.indexOf(target) > cards.indexOf(card)) target.after(card);
    else target.before(card);
  }
}
function endDrag() {
  if (!drag) return;
  window.clearTimeout(drag.timer);
  if (drag.active) {
    drag.ghost.remove();
    drag.card.classList.remove("dragging");
    document.body.classList.remove("is-dragging");
    const order = [...grid.children].map(el => el._link).filter(Boolean);
    if (order.length === links.length) {
      links = order;
      saveLinks();
    }
    suppressClick = true;
    window.setTimeout(() => { suppressClick = false; }, 60);
  }
  drag = null;
}

grid.addEventListener("dragstart", event => event.preventDefault());
grid.addEventListener("contextmenu", event => { if (drag) event.preventDefault(); });
grid.addEventListener("click", event => {
  if (suppressClick) { event.preventDefault(); event.stopPropagation(); }
}, true);
grid.addEventListener("pointerdown", event => {
  if (event.button !== 0 || event.target.closest(".delete-link")) return;
  const card = event.target.closest(".link-card");
  if (!card) return;
  drag = { card, startX: event.clientX, startY: event.clientY, x: event.clientX, y: event.clientY,
           active: false, touch: event.pointerType !== "mouse", timer: null };
  if (drag.touch) drag.timer = window.setTimeout(() => { if (drag) startDrag(); }, 350);
});
window.addEventListener("pointermove", event => {
  if (!drag) return;
  drag.x = event.clientX;
  drag.y = event.clientY;
  if (!drag.active) {
    const moved = Math.hypot(drag.x - drag.startX, drag.y - drag.startY);
    if (drag.touch && moved > 10) { window.clearTimeout(drag.timer); drag = null; }
    else if (!drag.touch && moved > 5) startDrag();
    return;
  }
  moveDrag();
});
window.addEventListener("pointerup", endDrag);
window.addEventListener("pointercancel", endDrag);
document.addEventListener("touchmove", event => { if (drag?.active) event.preventDefault(); }, { passive: false });

/* ---------- Couleur d'accentuation ---------- */
const ACCENT_KEY = "cyberstart.accent.v1";
const DEFAULT_ACCENT = "#53f5b5";
const accentPicker = document.getElementById("accentPicker");
const accentHex = document.getElementById("accentHex");
let currentAccent = DEFAULT_ACCENT;

function normalizeHex(value) {
  let v = value.trim().replace(/^#?/, "#");
  if (/^#[0-9a-f]{3}$/i.test(v)) v = "#" + [...v.slice(1)].map(ch => ch + ch).join("");
  return /^#[0-9a-f]{6}$/i.test(v) ? v.toLowerCase() : null;
}
function applyAccent(hex) {
  currentAccent = hex;
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const root = document.documentElement.style;
  root.setProperty("--green", hex);
  root.setProperty("--green-rgb", `${r}, ${g}, ${b}`);
  root.setProperty("--on-accent", luminance > 0.55 ? "#06110e" : "#ffffff");
  accentPicker.value = hex;
}
function saveAccent(hex) {
  try { localStorage.setItem(ACCENT_KEY, hex); } catch {}
}
try {
  const saved = normalizeHex(localStorage.getItem(ACCENT_KEY) || "");
  if (saved) applyAccent(saved);
} catch {}
accentHex.value = currentAccent.toUpperCase();

accentPicker.addEventListener("input", () => {
  applyAccent(accentPicker.value);
  accentHex.value = currentAccent.toUpperCase();
  saveAccent(currentAccent);
});
accentHex.addEventListener("input", () => {
  const hex = normalizeHex(accentHex.value);
  accentHex.setCustomValidity(hex ? "" : "Code invalide");
  if (hex) { applyAccent(hex); saveAccent(hex); }
});
accentHex.addEventListener("blur", () => { accentHex.value = currentAccent.toUpperCase(); });
document.getElementById("resetAccent").addEventListener("click", () => {
  applyAccent(DEFAULT_ACCENT);
  accentHex.value = DEFAULT_ACCENT.toUpperCase();
  try { localStorage.removeItem(ACCENT_KEY); } catch {}
});

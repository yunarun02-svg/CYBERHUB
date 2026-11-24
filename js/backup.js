import {
  MAX_IMAGE_BYTES,
  STORAGE,
  DB_NAME,
  DB_STORE,
  WALLPAPER_PREFIX
} from "./config.js";
import { t, SUPPORTED_LANGS } from "./i18n.js";

// Identifiant et version du format de fichier. Si le format change un jour,
// on incrémente VERSION et on ajoute une migration dans prepareImport().
const FORMAT = "cyberhub-backup";
const VERSION = 1;

/* ---------- Utilitaires ---------- */

function safeGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(DB_STORE)) {
        request.result.createObjectStore(DB_STORE);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// "wallpaper" est l'ancienne clé unique, conservée pour la compatibilité.
const isWallpaperKey = (key) =>
  key === "wallpaper" || key.startsWith(WALLPAPER_PREFIX);

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function download(filename, text) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ---------- Export ---------- */

async function readWallpaperBlobs() {
  const database = await openDb();

  return new Promise((resolve, reject) => {
    const blobs = [];
    const request = database
      .transaction(DB_STORE, "readonly")
      .objectStore(DB_STORE)
      .openCursor();

    request.onsuccess = () => {
      const cursor = request.result;

      if (cursor) {
        if (cursor.value instanceof Blob && isWallpaperKey(String(cursor.key))) {
          blobs.push(cursor.value);
        }
        cursor.continue();
      } else {
        database.close();
        resolve(blobs);
      }
    };

    request.onerror = () => {
      database.close();
      reject(request.error);
    };
  });
}

async function exportWallpapers() {
  const blobs = await readWallpaperBlobs();
  return Promise.all(blobs.map(async (blob) => ({ data: await blobToDataUrl(blob) })));
}

/* ---------- Import : validation ----------
   Un fichier importé est une entrée non fiable : tout est revérifié
   avant la moindre écriture dans le stockage. */

function cleanLinks(list) {
  if (!Array.isArray(list)) return [];

  return list.flatMap((item) => {
    const name = typeof item?.name === "string" ? item.name.trim().slice(0, 32) : "";

    try {
      const url = new URL(item?.url);
      if (name && ["http:", "https:"].includes(url.protocol)) {
        return [{ name, url: url.href }];
      }
    } catch {
      // URL invalide : le lien est ignoré.
    }

    return [];
  });
}

async function prepareImport(data) {
  if (data?.format !== FORMAT || data.version !== VERSION) {
    throw new Error("Format de sauvegarde inconnu");
  }

  const wallpapers = [];
  for (const item of Array.isArray(data.wallpapers) ? data.wallpapers : []) {
    if (typeof item?.data !== "string" || !item.data.startsWith("data:image/")) continue;

    const blob = await (await fetch(item.data)).blob();
    if (blob.size <= MAX_IMAGE_BYTES) wallpapers.push(blob);
  }

  return {
    links: cleanLinks(data.links),
    accent: /^#[0-9a-f]{6}$/i.test(data.accent ?? "") ? data.accent.toLowerCase() : null,
    lang: SUPPORTED_LANGS.includes(data.lang) ? data.lang : null,
    wallpapers
  };
}

/* ---------- Import : application ---------- */

async function replaceWallpapers(blobs) {
  const database = await openDb();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(DB_STORE, "readwrite");
    const store = transaction.objectStore(DB_STORE);
    const request = store.openKeyCursor();

    // Une seule transaction : on supprime les anciens fonds puis on ajoute
    // les nouveaux. Si quelque chose échoue, rien n'est modifié.
    request.onsuccess = () => {
      const cursor = request.result;

      if (cursor) {
        if (isWallpaperKey(String(cursor.key))) store.delete(cursor.key);
        cursor.continue();
      } else {
        blobs.forEach((blob) => {
          const key = WALLPAPER_PREFIX +
            Date.now() + "-" + Math.random().toString(36).slice(2, 8);
          store.put(blob, key);
        });
      }
    };

    transaction.oncomplete = () => {
      database.close();
      resolve();
    };

    transaction.onerror = transaction.onabort = () => {
      database.close();
      reject(transaction.error);
    };
  });
}

async function applyImport({ links, accent, lang, wallpapers }) {
  // Si la sauvegarde ne contient pas de fonds, on garde ceux de l'utilisateur.
  if (wallpapers.length) await replaceWallpapers(wallpapers);

  localStorage.setItem(STORAGE.links, JSON.stringify(links));

  if (accent) localStorage.setItem(STORAGE.accent, accent);
  else localStorage.removeItem(STORAGE.accent);

  if (lang) localStorage.setItem(STORAGE.lang, lang);

  localStorage.removeItem(STORAGE.lastWallpaper);
}

/* ---------- Branchement ---------- */

export function initBackup({ getLinks }) {
  const exportButton = document.getElementById("exportButton");
  const importInput = document.getElementById("importInput");
  const includeWallpapers = document.getElementById("backupWallpapers");

  exportButton.addEventListener("click", async () => {
    try {
      const backup = {
        format: FORMAT,
        version: VERSION,
        exportedAt: new Date().toISOString(),
        links: getLinks(),
        accent: safeGet(STORAGE.accent),
        lang: safeGet(STORAGE.lang),
        wallpapers: includeWallpapers.checked ? await exportWallpapers() : []
      };

      const day = new Date().toISOString().slice(0, 10);
      download(`cyberhub-backup-${day}.json`, JSON.stringify(backup));
    } catch (error) {
      console.error("Export impossible :", error);
      alert(t("backup.exportFailed"));
    }
  });

  importInput.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const prepared = await prepareImport(JSON.parse(await file.text()));

      const message = t("backup.importConfirm", {
        links: prepared.links.length,
        wallpapers: prepared.wallpapers.length
      });
      if (!confirm(message)) return;

      await applyImport(prepared);

      // Chaque module relit son stockage au démarrage : on recharge la page
      // pour que tout (liens, couleur, langue, fond) soit à jour.
      location.reload();
    } catch (error) {
      console.error("Import impossible :", error);
      alert(t("backup.importInvalid"));
    }
  });
}

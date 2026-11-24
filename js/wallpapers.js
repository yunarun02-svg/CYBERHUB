import { MAX_IMAGE_BYTES, STORAGE, DB_NAME, DB_STORE, WALLPAPER_PREFIX } from "./config.js";
import { t, onLanguageChange } from "./i18n.js";

const LAST_WALLPAPER_KEY = STORAGE.lastWallpaper;

export function initWallpapers() {
  const wallpaperList = document.getElementById("wallpaperList");
  const wallpaperInput = document.getElementById("wallpaperInput");
  const resetWallpaper = document.getElementById("resetWallpaper");

  let wallpapers = [];
  let currentWallpaperKey = null;
  let currentWallpaperUrl = null;
  let thumbnailUrls = [];

  function openDatabase() {
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

  async function loadWallpapers() {
    try {
      const database = await openDatabase();

      return await new Promise((resolve, reject) => {
        const items = [];
        const request = database
          .transaction(DB_STORE, "readonly")
          .objectStore(DB_STORE)
          .openCursor();

        request.onsuccess = () => {
          const cursor = request.result;

          if (cursor) {
            const key = String(cursor.key);
            if (
              cursor.value instanceof Blob &&
              (key === "wallpaper" || key.startsWith(WALLPAPER_PREFIX))
            ) {
              items.push({ key, blob: cursor.value });
            }
            cursor.continue();
          } else {
            database.close();
            resolve(items);
          }
        };

        request.onerror = () => {
          database.close();
          reject(request.error);
        };
      });
    } catch {
      return [];
    }
  }

  async function addWallpapers(files) {
    const database = await openDatabase();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(DB_STORE, "readwrite");
      const store = transaction.objectStore(DB_STORE);

      files.forEach((file) => {
        const key = WALLPAPER_PREFIX +
          Date.now() + "-" + Math.random().toString(36).slice(2, 8);
        store.put(file, key);
      });

      transaction.oncomplete = () => {
        database.close();
        resolve();
      };

      transaction.onerror = () => {
        database.close();
        reject(transaction.error);
      };
    });
  }

  async function deleteWallpapers(keys) {
    const database = await openDatabase();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(DB_STORE, "readwrite");
      const store = transaction.objectStore(DB_STORE);

      keys.forEach((key) => store.delete(key));

      transaction.oncomplete = () => {
        database.close();
        resolve();
      };

      transaction.onerror = () => {
        database.close();
        reject(transaction.error);
      };
    });
  }

  function applyWallpaper(blob) {
    if (currentWallpaperUrl) {
      URL.revokeObjectURL(currentWallpaperUrl);
      currentWallpaperUrl = null;
    }

    if (!blob) {
      currentWallpaperKey = null;
      document.body.classList.remove("has-wallpaper");
      document.body.style.removeProperty("--wallpaper");
      return;
    }

    currentWallpaperUrl = URL.createObjectURL(blob);
    document.body.classList.add("has-wallpaper");
    document.body.style.setProperty(
      "--wallpaper",
      `url("${currentWallpaperUrl}")`
    );
  }

  function pickRandomWallpaper() {
    if (!wallpapers.length) {
      applyWallpaper(null);
      return;
    }

    let lastWallpaper = null;
    try {
      lastWallpaper = localStorage.getItem(LAST_WALLPAPER_KEY);
    } catch {
      // La sélection aléatoire fonctionne aussi sans stockage local.
    }

    let candidates = wallpapers.filter((item) => item.key !== lastWallpaper);
    if (!candidates.length) candidates = wallpapers;

    const choice = candidates[Math.floor(Math.random() * candidates.length)];
    applyWallpaper(choice.blob);
    currentWallpaperKey = choice.key;

    try {
      localStorage.setItem(LAST_WALLPAPER_KEY, choice.key);
    } catch {
      // Le fond reste affiché même si sa dernière utilisation n'est pas mémorisée.
    }
  }

  function renderWallpaperList() {
    thumbnailUrls.forEach((url) => URL.revokeObjectURL(url));
    thumbnailUrls = [];
    wallpaperList.replaceChildren();

    wallpapers.forEach((item) => {
      const url = URL.createObjectURL(item.blob);
      thumbnailUrls.push(url);

      const thumbnail = document.createElement("div");
      thumbnail.className = "wallpaper-thumb";

      const image = document.createElement("img");
      image.src = url;
      image.alt = t("wallpapers.alt");

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.textContent = "×";
      removeButton.title = t("wallpapers.remove");
      removeButton.setAttribute("aria-label", removeButton.title);

      removeButton.addEventListener("click", async () => {
        try {
          await deleteWallpapers([item.key]);
          wallpapers = wallpapers.filter((wallpaper) => wallpaper.key !== item.key);
          renderWallpaperList();

          if (item.key === currentWallpaperKey) pickRandomWallpaper();
        } catch {
          alert(t("wallpapers.deleteFailed"));
        }
      });

      thumbnail.append(image, removeButton);
      wallpaperList.appendChild(thumbnail);
    });
  }

  wallpaperInput.addEventListener("change", async (event) => {
    const selected = [...(event.target.files || [])];
    event.target.value = "";

    const images = selected.filter((file) => file.type.startsWith("image/"));
    if (!images.length) {
      alert(t("wallpapers.noImage"));
      return;
    }

    // Les images trop lourdes sont refusées ; les autres sont ajoutées.
    const tooBig = images.filter((file) => file.size > MAX_IMAGE_BYTES);
    const files = images.filter((file) => file.size <= MAX_IMAGE_BYTES);

    if (tooBig.length) {
      const shown = tooBig.slice(0, 5).map((file) => file.name).join(", ");
      const names = tooBig.length > 5 ? `${shown}…` : shown;

      alert(t(tooBig.length === 1 ? "wallpapers.tooBig.one" : "wallpapers.tooBig.many",
        { count: tooBig.length, names }));
    }

    if (!files.length) return;

    try {
      await addWallpapers(files);
      wallpapers = await loadWallpapers();
      renderWallpaperList();
      if (!currentWallpaperKey) pickRandomWallpaper();
    } catch {
      alert(t("wallpapers.saveFailed"));
    }
  });

  resetWallpaper.addEventListener("click", async () => {
    if (!wallpapers.length) return;
    if (!confirm(t("wallpapers.resetConfirm"))) return;

    try {
      await deleteWallpapers(wallpapers.map((item) => item.key));
      wallpapers = [];
      renderWallpaperList();
      applyWallpaper(null);
    } catch {
      alert(t("wallpapers.deleteFailed"));
    }
  });

  onLanguageChange(renderWallpaperList);

  loadWallpapers().then((items) => {
    wallpapers = items;
    renderWallpaperList();
    pickRandomWallpaper();
  });
}

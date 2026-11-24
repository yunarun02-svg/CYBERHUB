import { t } from "./i18n.js";
import { STORAGE } from "./config.js";

const ACCENT_KEY = STORAGE.accent;
const DEFAULT_ACCENT = "#53f5b5";

export function initSettings() {
  const accentPicker = document.getElementById("accentPicker");
  const accentHex = document.getElementById("accentHex");
  let currentAccent = DEFAULT_ACCENT;

  function normalizeHex(value) {
    let hex = value.trim().replace(/^#?/, "#");

    if (/^#[0-9a-f]{3}$/i.test(hex)) {
      hex = "#" + [...hex.slice(1)].map((char) => char + char).join("");
    }

    return /^#[0-9a-f]{6}$/i.test(hex) ? hex.toLowerCase() : null;
  }

  function applyAccent(hex) {
    currentAccent = hex;

    const red = parseInt(hex.slice(1, 3), 16);
    const green = parseInt(hex.slice(3, 5), 16);
    const blue = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

    const root = document.documentElement.style;
    root.setProperty("--green", hex);
    root.setProperty("--green-rgb", `${red}, ${green}, ${blue}`);
    root.setProperty("--on-accent", luminance > 0.55 ? "#06110e" : "#ffffff");

    accentPicker.value = hex;
    accentHex.value = hex.toUpperCase();
  }

  function saveAccent(hex) {
    try {
      localStorage.setItem(ACCENT_KEY, hex);
    } catch (error) {
      console.error("Impossible d'enregistrer la couleur :", error);
    }
  }

  try {
    const savedAccent = normalizeHex(localStorage.getItem(ACCENT_KEY) || "");
    if (savedAccent) applyAccent(savedAccent);
  } catch {
    // Le réglage par défaut est conservé si le stockage est indisponible.
  }

  accentPicker.addEventListener("input", () => {
    applyAccent(accentPicker.value);
    saveAccent(currentAccent);
  });

  accentHex.addEventListener("input", () => {
    const hex = normalizeHex(accentHex.value);
    accentHex.setCustomValidity(hex ? "" : t("settings.accent.invalid"));

    if (hex) {
      applyAccent(hex);
      saveAccent(hex);
    }
  });

  accentHex.addEventListener("blur", () => {
    accentHex.value = currentAccent.toUpperCase();
  });

  document.getElementById("resetAccent").addEventListener("click", () => {
    applyAccent(DEFAULT_ACCENT);
    try {
      localStorage.removeItem(ACCENT_KEY);
    } catch {
      // Rien à faire si le stockage est indisponible.
    }
  });
}

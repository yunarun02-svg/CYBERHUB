import { initLinks } from "./links.js";
import { initWallpapers } from "./wallpapers.js";
import { initSettings } from "./settings.js";
import { initDrag } from "./drag.js";
import { initBackup } from "./backup.js";
import { initI18n, t } from "./i18n.js";

initI18n();

const links = initLinks();

initWallpapers();
initSettings();
initBackup({ getLinks: links.getLinks });

const linkDialog = document.getElementById("linkDialog");
const settingsDialog = document.getElementById("settingsDialog");
const linkForm = document.getElementById("linkForm");
const linkError = document.getElementById("linkError");

document.getElementById("addButton").addEventListener("click", () => {
  linkForm.reset();
  linkError.textContent = "";
  linkDialog.showModal();
  document.getElementById("siteName").focus();
});

linkForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("siteName").value.trim();
  let rawUrl = document.getElementById("siteUrl").value.trim();

  if (!name || !rawUrl) {
    linkError.textContent = t("link.error.required");
    return;
  }

  if (!/^https?:\/\//i.test(rawUrl)) {
    rawUrl = `https://${rawUrl}`;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    linkError.textContent = t("link.error.invalid");
    return;
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol) ||
      !parsedUrl.hostname.includes(".")) {
    linkError.textContent = t("link.error.invalidSite");
    return;
  }

  links.addLink(name, parsedUrl.href);
  linkDialog.close();
});

document.getElementById("searchForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const query = document.getElementById("searchInput").value.trim();
  if (!query) return;

  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  window.open(searchUrl, "_blank", "noopener,noreferrer");
});

document.getElementById("settingsButton").addEventListener("click", () => {
  settingsDialog.showModal();
});

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => {
    document.getElementById(button.dataset.close).close();
  });
});

[linkDialog, settingsDialog].forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

initDrag(
  document.getElementById("linksGrid"),
  links.getLinks,
  links.setLinks
);

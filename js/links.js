import { t, onLanguageChange } from "./i18n.js";
import { STORAGE } from "./config.js";

const STORAGE_KEY = STORAGE.links;

const DEFAULT_LINKS = [
  { name: "Google", url: "https://www.google.com" },
  { name: "YouTube", url: "https://www.youtube.com" },
  { name: "GitHub", url: "https://github.com" }
];

function loadLinks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [...DEFAULT_LINKS];
  } catch {
    return [...DEFAULT_LINKS];
  }
}

export function initLinks() {
  const grid = document.getElementById("linksGrid");
  const emptyState = document.getElementById("emptyState");
  let links = loadLinks();

  function saveLinks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
    } catch (error) {
      console.error("Impossible d'enregistrer les raccourcis :", error);
    }
  }

  function renderLinks() {
    grid.replaceChildren();
    emptyState.hidden = links.length > 0;

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
      try {
        parsedUrl = new URL(link.url);
      } catch {
        parsedUrl = null;
      }

      if (parsedUrl && ["http:", "https:"].includes(parsedUrl.protocol)) {
        const img = document.createElement("img");
        img.alt = "";
        img.className = "favicon-image";
        img.decoding = "async";
        img.loading = "lazy";

        const domain = parsedUrl.hostname;
        const iconSources = [
          `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(parsedUrl.origin)}&sz=64`,
          `https://icons.duckduckgo.com/ip3/${encodeURIComponent(domain)}.ico`,
          `https://favicon.im/${encodeURIComponent(domain)}?larger=true`,
          `${parsedUrl.origin}/favicon.ico`,
          `${parsedUrl.origin}/apple-touch-icon.png`
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
            if (img.naturalWidth > 0) {
              finished = true;
              fallback.hidden = true;
            } else {
              tryNextSource();
            }
          };

          img.onerror = tryNextSource;
          img.src = iconSources[sourceIndex];
          timeoutId = window.setTimeout(tryNextSource, 3000);
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
      remove.title = t("link.delete.title", { name: link.name });
      remove.setAttribute("aria-label", remove.title);
      remove.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (confirm(t("link.delete.confirm", { name: link.name }))) {
          links = links.filter((item) => item !== link);
          saveLinks();
          renderLinks();
        }
      });

      card._link = link;
      card.append(iconWrap, name, remove);
      grid.appendChild(card);
    });
  }

  function addLink(name, url) {
    links.push({ name, url });
    saveLinks();
    renderLinks();
  }

  function setLinks(nextLinks) {
    links = nextLinks;
    saveLinks();
    renderLinks();
  }

  renderLinks();
  onLanguageChange(renderLinks);

  return {
    addLink,
    getLinks: () => links,
    setLinks,
    renderLinks
  };
}

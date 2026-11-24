import { MAX_IMAGE_MB, STORAGE } from "./config.js";

const LANG_KEY = STORAGE.lang;

export const DEFAULT_LANG = "fr";
export const SUPPORTED_LANGS = ["en", "fr", "es"];

const translations = {
  fr: {
    "unit.mb": "Mo",
    "meta.title": "CyberHub — Accueil",
    "meta.description": "CyberHub, une page d'accueil personnalisable pour retrouver tes sites préférés.",
    "brand.aria": "CyberHub, accueil",
    "settings.open": "Ouvrir les paramètres",
    "settings.openTitle": "Paramètres",
    "common.close": "Fermer",

    "hero.eyebrow": "TON ESPACE PERSONNEL",
    "hero.title": "BON <span>RETOUR.</span>",
    "search.placeholder": "Rechercher sur le Web...",
    "search.aria": "Recherche Google",

    "links.title": "MES <span>RACCOURCIS</span>",
    "links.add": "<span>＋</span> AJOUTER UN LIEN",
    "links.empty": "Aucun raccourci pour le moment. Ajoute ton premier site.",
    "footer.left": "CYBERHUB <span class=\"muted\">/ PAGE D'ACCUEIL</span>",
    "footer.right": "FAIT POUR TOI <b>■</b>",

    "linkDialog.eyebrow": "// NOUVEAU RACCOURCI",
    "linkDialog.title": "AJOUTER UN <span>LIEN</span>",
    "linkDialog.nameLabel": "NOM DU SITE",
    "linkDialog.namePlaceholder": "Ex. YouTube",
    "linkDialog.urlLabel": "ADRESSE DU SITE",
    "linkDialog.urlPlaceholder": "https://www.exemple.com",
    "linkDialog.cancel": "ANNULER",
    "linkDialog.save": "ENREGISTRER ↗",
    "link.error.required": "Renseigne le nom et l'adresse du site.",
    "link.error.invalid": "Cette adresse ne semble pas valide.",
    "link.error.invalidSite": "Entre une adresse de site valide (https://...).",
    "link.delete.title": "Supprimer {name}",
    "link.delete.confirm": "Supprimer le raccourci « {name} » ?",

    "settings.eyebrow": "// PARAMÈTRES",
    "settings.title": "MES <span>PRÉFÉRENCES</span>",
    "settings.language.title": "LANGUE",
    "settings.language.desc": "Choisis la langue de l'interface.",
    "settings.language.aria": "Langue",
    "settings.wallpapers.title": "FONDS D'ÉCRAN",
    "settings.wallpapers.desc": "Ajoute tes images préférées. Un fond sera choisi à chaque ouverture de la page. Taille maximale : {maxSize} par image.",
    "settings.wallpapers.choose": "CHOISIR DES IMAGES",
    "settings.wallpapers.deleteAll": "SUPPRIMER TOUS LES FONDS",
    "settings.accent.title": "COULEUR PRINCIPALE",
    "settings.accent.desc": "Choisis la couleur des éléments mis en évidence.",
    "settings.accent.pickerAria": "Choisir une couleur",
    "settings.accent.hexAria": "Code couleur hexadécimal",
    "settings.accent.reset": "RÉTABLIR LA COULEUR PAR DÉFAUT",
    "settings.accent.invalid": "Code couleur invalide",
    "settings.note": "Tes raccourcis, tes fonds, ta couleur et ta langue sont enregistrés dans ce navigateur.",
    "settings.closeButton": "FERMER",
    "settings.backup.title": "SAUVEGARDE",
    "settings.backup.desc": "Exporte tes raccourcis et réglages dans un fichier, ou restaure-les depuis une sauvegarde.",
    "settings.backup.includeWallpapers": "Inclure les fonds d'écran",
    "settings.backup.export": "EXPORTER",
    "settings.backup.import": "IMPORTER",
    "backup.importConfirm": "Importer {links} raccourci(s) et {wallpapers} fond(s) d'écran ? Tes raccourcis actuels seront remplacés.",
    "backup.importInvalid": "Ce fichier n'est pas une sauvegarde CyberHub valide.",
    "backup.exportFailed": "L'export a échoué.",

    "wallpapers.alt": "Aperçu du fond d'écran",
    "wallpapers.remove": "Supprimer ce fond",
    "wallpapers.deleteFailed": "La suppression n'a pas pu être effectuée.",
    "wallpapers.noImage": "Choisis au moins une image.",
    "wallpapers.saveFailed": "Impossible d'enregistrer ces images. Essaie avec des fichiers plus légers.",
    "wallpapers.tooBig.one": "L'image « {names} » dépasse {maxSize} et n'a pas été ajoutée.",
    "wallpapers.tooBig.many": "{count} images dépassent {maxSize} et n'ont pas été ajoutées : {names}",
    "wallpapers.resetConfirm": "Supprimer tous les fonds d'écran ?"
  },

  en: {
    "unit.mb": "MB",
    "meta.title": "CyberHub — Home",
    "meta.description": "CyberHub, a customizable start page to get to your favorite sites.",
    "brand.aria": "CyberHub, home",
    "settings.open": "Open settings",
    "settings.openTitle": "Settings",
    "common.close": "Close",

    "hero.eyebrow": "YOUR PERSONAL SPACE",
    "hero.title": "WELCOME <span>BACK.</span>",
    "search.placeholder": "Search the web...",
    "search.aria": "Google search",

    "links.title": "MY <span>SHORTCUTS</span>",
    "links.add": "<span>＋</span> ADD A LINK",
    "links.empty": "No shortcuts yet. Add your first site.",
    "footer.left": "CYBERHUB <span class=\"muted\">/ START PAGE</span>",
    "footer.right": "MADE FOR YOU <b>■</b>",

    "linkDialog.eyebrow": "// NEW SHORTCUT",
    "linkDialog.title": "ADD A <span>LINK</span>",
    "linkDialog.nameLabel": "SITE NAME",
    "linkDialog.namePlaceholder": "E.g. YouTube",
    "linkDialog.urlLabel": "SITE ADDRESS",
    "linkDialog.urlPlaceholder": "https://www.example.com",
    "linkDialog.cancel": "CANCEL",
    "linkDialog.save": "SAVE ↗",
    "link.error.required": "Enter the site name and address.",
    "link.error.invalid": "This address doesn't look valid.",
    "link.error.invalidSite": "Enter a valid site address (https://...).",
    "link.delete.title": "Delete {name}",
    "link.delete.confirm": "Delete the shortcut “{name}”?",

    "settings.eyebrow": "// SETTINGS",
    "settings.title": "MY <span>PREFERENCES</span>",
    "settings.language.title": "LANGUAGE",
    "settings.language.desc": "Choose the interface language.",
    "settings.language.aria": "Language",
    "settings.wallpapers.title": "WALLPAPERS",
    "settings.wallpapers.desc": "Add your favorite images. One will be picked each time the page opens. Maximum size: {maxSize} per image.",
    "settings.wallpapers.choose": "CHOOSE IMAGES",
    "settings.wallpapers.deleteAll": "DELETE ALL WALLPAPERS",
    "settings.accent.title": "MAIN COLOR",
    "settings.accent.desc": "Choose the color of highlighted elements.",
    "settings.accent.pickerAria": "Pick a color",
    "settings.accent.hexAria": "Hexadecimal color code",
    "settings.accent.reset": "RESTORE DEFAULT COLOR",
    "settings.accent.invalid": "Invalid color code",
    "settings.note": "Your shortcuts, wallpapers, color and language are saved in this browser.",
    "settings.closeButton": "CLOSE",
    "settings.backup.title": "BACKUP",
    "settings.backup.desc": "Export your shortcuts and settings to a file, or restore them from a backup.",
    "settings.backup.includeWallpapers": "Include wallpapers",
    "settings.backup.export": "EXPORT",
    "settings.backup.import": "IMPORT",
    "backup.importConfirm": "Import {links} shortcut(s) and {wallpapers} wallpaper(s)? Your current shortcuts will be replaced.",
    "backup.importInvalid": "This file is not a valid CyberHub backup.",
    "backup.exportFailed": "Export failed.",

    "wallpapers.alt": "Wallpaper preview",
    "wallpapers.remove": "Delete this wallpaper",
    "wallpapers.deleteFailed": "The deletion could not be completed.",
    "wallpapers.noImage": "Choose at least one image.",
    "wallpapers.saveFailed": "Unable to save these images. Try with smaller files.",
    "wallpapers.tooBig.one": "The image “{names}” exceeds {maxSize} and was not added.",
    "wallpapers.tooBig.many": "{count} images exceed {maxSize} and were not added: {names}",
    "wallpapers.resetConfirm": "Delete all wallpapers?"
  },

  es: {
    "unit.mb": "MB",
    "meta.title": "CyberHub — Inicio",
    "meta.description": "CyberHub, una página de inicio personalizable para acceder a tus sitios favoritos.",
    "brand.aria": "CyberHub, inicio",
    "settings.open": "Abrir los ajustes",
    "settings.openTitle": "Ajustes",
    "common.close": "Cerrar",

    "hero.eyebrow": "TU ESPACIO PERSONAL",
    "hero.title": "¡HOLA <span>DE NUEVO!</span>",
    "search.placeholder": "Buscar en la web...",
    "search.aria": "Búsqueda en Google",

    "links.title": "MIS <span>ACCESOS</span>",
    "links.add": "<span>＋</span> AÑADIR UN ENLACE",
    "links.empty": "Aún no hay accesos directos. Añade tu primer sitio.",
    "footer.left": "CYBERHUB <span class=\"muted\">/ PÁGINA DE INICIO</span>",
    "footer.right": "HECHO PARA TI <b>■</b>",

    "linkDialog.eyebrow": "// NUEVO ACCESO",
    "linkDialog.title": "AÑADIR UN <span>ENLACE</span>",
    "linkDialog.nameLabel": "NOMBRE DEL SITIO",
    "linkDialog.namePlaceholder": "Ej. YouTube",
    "linkDialog.urlLabel": "DIRECCIÓN DEL SITIO",
    "linkDialog.urlPlaceholder": "https://www.ejemplo.com",
    "linkDialog.cancel": "CANCELAR",
    "linkDialog.save": "GUARDAR ↗",
    "link.error.required": "Indica el nombre y la dirección del sitio.",
    "link.error.invalid": "Esta dirección no parece válida.",
    "link.error.invalidSite": "Introduce una dirección de sitio válida (https://...).",
    "link.delete.title": "Eliminar {name}",
    "link.delete.confirm": "¿Eliminar el acceso directo «{name}»?",

    "settings.eyebrow": "// AJUSTES",
    "settings.title": "MIS <span>PREFERENCIAS</span>",
    "settings.language.title": "IDIOMA",
    "settings.language.desc": "Elige el idioma de la interfaz.",
    "settings.language.aria": "Idioma",
    "settings.wallpapers.title": "FONDOS DE PANTALLA",
    "settings.wallpapers.desc": "Añade tus imágenes favoritas. Se elegirá un fondo cada vez que se abra la página. Tamaño máximo: {maxSize} por imagen.",
    "settings.wallpapers.choose": "ELEGIR IMÁGENES",
    "settings.wallpapers.deleteAll": "ELIMINAR TODOS LOS FONDOS",
    "settings.accent.title": "COLOR PRINCIPAL",
    "settings.accent.desc": "Elige el color de los elementos destacados.",
    "settings.accent.pickerAria": "Elegir un color",
    "settings.accent.hexAria": "Código de color hexadecimal",
    "settings.accent.reset": "RESTABLECER EL COLOR PREDETERMINADO",
    "settings.accent.invalid": "Código de color no válido",
    "settings.note": "Tus accesos, fondos, color e idioma se guardan en este navegador.",
    "settings.closeButton": "CERRAR",
    "settings.backup.title": "COPIA DE SEGURIDAD",
    "settings.backup.desc": "Exporta tus accesos directos y ajustes a un archivo, o restáuralos desde una copia.",
    "settings.backup.includeWallpapers": "Incluir fondos de pantalla",
    "settings.backup.export": "EXPORTAR",
    "settings.backup.import": "IMPORTAR",
    "backup.importConfirm": "¿Importar {links} acceso(s) directo(s) y {wallpapers} fondo(s)? Tus accesos directos actuales se reemplazarán.",
    "backup.importInvalid": "Este archivo no es una copia de seguridad válida de CyberHub.",
    "backup.exportFailed": "La exportación ha fallado.",

    "wallpapers.alt": "Vista previa del fondo",
    "wallpapers.remove": "Eliminar este fondo",
    "wallpapers.deleteFailed": "No se pudo completar la eliminación.",
    "wallpapers.noImage": "Elige al menos una imagen.",
    "wallpapers.saveFailed": "No se pudieron guardar estas imágenes. Prueba con archivos más ligeros.",
    "wallpapers.tooBig.one": "La imagen «{names}» supera {maxSize} y no se ha añadido.",
    "wallpapers.tooBig.many": "{count} imágenes superan {maxSize} y no se han añadido: {names}",
    "wallpapers.resetConfirm": "¿Eliminar todos los fondos de pantalla?"
  }
};

const listeners = [];

function readSavedLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    return SUPPORTED_LANGS.includes(saved) ? saved : DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}

let currentLang = readSavedLang();

export function getLang() {
  return currentLang;
}

function lookup(key) {
  return translations[currentLang]?.[key] ?? translations[DEFAULT_LANG][key] ?? key;
}

// Retourne le texte traduit. Les {variables} sont remplacées par `params`.
// {maxSize} est toujours disponible (ex. « 5 Mo » ou « 5 MB »).
export function t(key, params = {}) {
  const vars = { maxSize: `${MAX_IMAGE_MB} ${lookup("unit.mb")}`, ...params };

  return lookup(key).replace(/\{(\w+)\}/g, (match, name) =>
    name in vars ? String(vars[name]) : match
  );
}

// Appelle `callback` à chaque changement de langue (pour les textes créés en JS).
export function onLanguageChange(callback) {
  listeners.push(callback);
}

// Traduit tous les éléments marqués avec un attribut data-i18n-*.
export function applyTranslations() {
  document.documentElement.lang = currentLang;
  document.title = t("meta.title");
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", t("meta.description"));

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  // Textes contenant du balisage (<span>, <b>) : ils viennent uniquement
  // du dictionnaire ci-dessus, jamais d'une saisie de l'utilisateur.
  document.querySelectorAll("[data-i18n-html]").forEach((element) => {
    element.innerHTML = t(element.dataset.i18nHtml);
  });

  const attributes = {
    "data-i18n-placeholder": "placeholder",
    "data-i18n-aria-label": "aria-label",
    "data-i18n-title": "title"
  };

  Object.entries(attributes).forEach(([dataAttribute, attribute]) => {
    document.querySelectorAll(`[${dataAttribute}]`).forEach((element) => {
      element.setAttribute(attribute, t(element.getAttribute(dataAttribute)));
    });
  });
}

export function setLang(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return;

  currentLang = lang;

  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (error) {
    console.error("Impossible d'enregistrer la langue :", error);
  }

  applyTranslations();
  listeners.forEach((callback) => callback(lang));
}

export function initI18n() {
  const select = document.getElementById("languageSelect");

  applyTranslations();

  if (select) {
    select.value = currentLang;
    select.addEventListener("change", () => setLang(select.value));
  }
}

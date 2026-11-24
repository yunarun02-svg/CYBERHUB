// Réglages partagés par plusieurs modules.

// Taille maximale d'une image de fond d'écran (en Mo).
export const MAX_IMAGE_MB = 5;
export const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;

// Clés de stockage (localStorage). Centralisées ici : la sauvegarde
// (backup.js) doit lire et écrire exactement les mêmes clés que les modules.
export const STORAGE = {
  links: "cyberstart.links.v1",
  accent: "cyberstart.accent.v1",
  lang: "cyberstart.lang.v1",
  lastWallpaper: "cyberstart.lastWallpaper.v1"
};

// Base IndexedDB qui contient les fonds d'écran.
export const DB_NAME = "CyberStartDB";
export const DB_STORE = "settings";
export const WALLPAPER_PREFIX = "wp:";

# CyberHub

## ENGLISH

## Organization

\- `index.html` : page structure and dialog windows.
\- `style.css` : styles, colors and responsive layout.
\- `js/main.js` : website initialization and general events.
\- `js/links.js` : adding, deleting, displaying and saving shortcuts.
\- `js/wallpapers.js` : adding, deleting and selecting wallpapers.
\- `js/settings.js` : selecting and saving the primary color.
\- `js/i18n.js` : translations (English, French, Spanish), language selection and saving.
\- `js/config.js` : shared settings (maximum wallpaper image size: 5 MB, storage keys).
\- `js/drag.js` : rearranging shortcuts using drag and drop.
\- `js/backup.js` : export and import of shortcuts and settings (JSON file).

## Running the project

Since JavaScript uses ES modules (`type="module"`), open the folder using a small local server rather than double-clicking `index.html`.

For example, using the **Live Server** extension in VS Code:
1\. Open the `CyberHub` folder in VS Code.
2\. Right-click on `index.html`.
3\. Select **Open with Live Server**.

Settings and shortcuts are saved in the browser being used.

## Adding or modifying text

\- Static text in `index.html` : add `data-i18n="key"` (or `data-i18n-html`, `data-i18n-placeholder`, `data-i18n-aria-label`, `data-i18n-title`), then add the key in all three languages in `js/i18n.js`.
\- Text created in JavaScript : use `t("key")` imported from `js/i18n.js`.

**## Image limit**

Each wallpaper is limited to 5 MB. This value can be changed in `js/config.js` (`MAX_IMAGE_MB`), and the text displayed in the settings automatically updates.

## Backup (export / import)

Settings > **Backup** lets you export your shortcuts, color, language and (optionally) wallpapers to a `cyberhub-backup-YYYY-MM-DD.json` file, and import it again later or in another browser. Importing replaces the current shortcuts (after confirmation). If the backup contains no wallpapers, the existing ones are kept. Wallpapers make the file larger (images are stored inside it).


## FRANCAIS

## Organisation

- `index.html` : structure de la page et fenêtres de dialogue.
- `style.css` : styles, couleurs et affichage responsive.
- `js/main.js` : démarrage du site et événements généraux.
- `js/links.js` : ajout, suppression, affichage et sauvegarde des raccourcis.
- `js/wallpapers.js` : ajout, suppression et sélection des fonds d'écran.
- `js/settings.js` : choix et sauvegarde de la couleur principale.
- `js/i18n.js` : traductions (anglais, français, espagnol), choix de la langue et sauvegarde.
- `js/config.js` : réglages partagés (taille maximale des images de fond : 5 Mo, clés de stockage).
- `js/drag.js` : réorganisation des raccourcis par glisser-déposer.
- `js/backup.js` : export et import des raccourcis et réglages (fichier JSON).

## Lancer le projet

Comme le JavaScript utilise des modules ES (`type="module"`), ouvre le dossier avec un petit serveur local plutôt qu'en double-cliquant sur `index.html`.

Par exemple, avec l'extension **Live Server** de VS Code :
1. Ouvre le dossier `CyberHub` dans VS Code.
2. Fais un clic droit sur `index.html`.
3. Choisis **Open with Live Server**.

Les réglages et raccourcis sont conservés dans le navigateur utilisé.

## Ajouter ou modifier un texte

- Texte fixe dans `index.html` : ajoute `data-i18n="cle"` (ou `data-i18n-html`, `data-i18n-placeholder`, `data-i18n-aria-label`, `data-i18n-title`), puis ajoute la clé dans les trois langues de `js/i18n.js`.
- Texte créé en JavaScript : utilise `t("cle")` importé depuis `js/i18n.js`.

## Limite des images

Chaque fond d'écran est limité à 5 Mo. La valeur se change dans `js/config.js` (`MAX_IMAGE_MB`) et le texte affiché dans les paramètres suit automatiquement.

## Sauvegarde (export / import)

Paramètres > **Sauvegarde** permet d'exporter tes raccourcis, ta couleur, ta langue et (en option) tes fonds d'écran dans un fichier `cyberhub-backup-AAAA-MM-JJ.json`, puis de le réimporter plus tard ou dans un autre navigateur. L'import remplace les raccourcis actuels (après confirmation). Si la sauvegarde ne contient pas de fonds, ceux déjà présents sont conservés. Les fonds d'écran alourdissent le fichier (les images sont stockées dedans).


## ESPANOL

## Organización

\- `index.html` : estructura de la página y ventanas de diálogo.
\- `style.css` : estilos, colores y diseño adaptable.
\- `js/main.js` : inicialización del sitio y eventos generales.
\- `js/links.js` : añadir, eliminar, mostrar y guardar accesos directos.
\- `js/wallpapers.js` : añadir, eliminar y seleccionar fondos de pantalla.
\- `js/settings.js` : selección y guardado del color principal.
\- `js/i18n.js` : traducciones (inglés, francés, español), selección y guardado del idioma.
\- `js/config.js` : ajustes compartidos (tamaño máximo de las imágenes de fondo: 5 MB, claves de almacenamiento).
\- `js/drag.js` : reorganización de los accesos directos mediante arrastrar y soltar.
\- `js/backup.js` : exportación e importación de accesos directos y ajustes (archivo JSON).

## Ejecutar el proyecto

Como JavaScript utiliza módulos ES (`type="module"`), abre la carpeta con un pequeño servidor local en lugar de hacer doble clic en `index.html`.

Por ejemplo, con la extensión **Live Server** de VS Code:
1\. Abre la carpeta `CyberHub` en VS Code.
2\. Haz clic derecho en `index.html`.
3\. Selecciona **Open with Live Server**.

Los ajustes y accesos directos se conservan en el navegador utilizado.

## Añadir o modificar texto

\- Texto fijo en `index.html` : añade `data-i18n="clave"` (o `data-i18n-html`, `data-i18n-placeholder`, `data-i18n-aria-label`, `data-i18n-title`) y luego añade la clave en los tres idiomas en `js/i18n.js`.
\- Texto creado en JavaScript : utiliza `t("clave")` importado desde `js/i18n.js`.

## Límite de las imágenes

Cada fondo de pantalla tiene un límite de 5 MB. Este valor se puede cambiar en `js/config.js` (`MAX_IMAGE_MB`), y el texto mostrado en los ajustes se actualiza automáticamente.

## Copia de seguridad (exportar / importar)

Ajustes > **Copia de seguridad** permite exportar tus accesos directos, color, idioma y (opcionalmente) fondos de pantalla a un archivo `cyberhub-backup-AAAA-MM-DD.json`, y volver a importarlo más tarde o en otro navegador. La importación reemplaza los accesos directos actuales (tras confirmación). Si la copia no contiene fondos, se conservan los existentes. Los fondos de pantalla aumentan el tamaño del archivo (las imágenes se guardan dentro).

import type { Handler } from '@/core/types';

/**
 * Nettoie ce que la page met dans le presse-papier :
 * - boutons « Copier le lien » (`navigator.clipboard.writeText`) ;
 * - copie asynchrone (`navigator.clipboard.write` + `ClipboardItem`), utilisée quand le lien
 *   est obtenu par une requête avant la copie (ex. jeton de partage `?a=` de X connecté) ;
 * - handlers `copy` de la page (`clipboardData.setData`) ;
 * - copie native d'une sélection (Ctrl+C).
 */
export const clipboard: Handler = ({ cleanText }) => {
  // Patch du prototype : couvre aussi les références à la méthode capturées par la page.
  if (typeof Clipboard !== 'undefined') {
    const { writeText, write } = Clipboard.prototype;

    Clipboard.prototype.writeText = function (text) {
      return writeText.call(this, cleanText(text));
    };

    Clipboard.prototype.write = function (items) {
      return write.call(this, items.map((item) => cleanItem(item, cleanText)));
    };
  }

  const setData = DataTransfer.prototype.setData;
  DataTransfer.prototype.setData = function (format, data) {
    return setData.call(this, format, format.startsWith('text') ? cleanText(data) : data);
  };

  document.addEventListener(
    'copy',
    (event) => {
      const text = selectedText();
      const cleaned = cleanText(text);
      if (cleaned === text || !event.clipboardData) return;
      event.clipboardData.setData('text/plain', cleaned);
      event.preventDefault();
    },
    true,
  );
};

// Le contenu reste une promesse : `write()` est appelé de façon synchrone et garde l'activation utilisateur.
function cleanItem(item: ClipboardItem, cleanText: (text: string) => string): ClipboardItem {
  const data = Object.fromEntries(
    item.types.map((type) => [
      type,
      type.startsWith('text/')
        ? item
            .getType(type)
            .then((blob) => blob.text())
            .then((text) => new Blob([cleanText(text)], { type }))
        : item.getType(type),
    ]),
  );
  return new ClipboardItem(data, { presentationStyle: item.presentationStyle });
}

function selectedText(): string {
  const el = document.activeElement;
  // Firefox ne renvoie pas la sélection d'un champ via getSelection().
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    return el.value.slice(el.selectionStart ?? 0, el.selectionEnd ?? 0);
  }
  return window.getSelection()?.toString() ?? '';
}

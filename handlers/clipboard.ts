import type { Handler } from '@/core/types';

/**
 * Cleans what the page puts in the clipboard:
 * - "Copy link" buttons (`navigator.clipboard.writeText`);
 * - async copy (`navigator.clipboard.write` + `ClipboardItem`), used when the link is
 *   fetched before being copied (e.g. X's `?a=` share token when logged in);
 * - the page's `copy` handlers (`clipboardData.setData`);
 * - native copy of a selection (Ctrl+C).
 */
export const clipboard: Handler = ({ cleanText }) => {
  // Patching the prototype also covers references to the method captured by the page.
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

// Content stays a promise: `write()` is called synchronously and keeps the user activation.
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
  // Firefox does not return a form field's selection through getSelection().
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    return el.value.slice(el.selectionStart ?? 0, el.selectionEnd ?? 0);
  }
  return window.getSelection()?.toString() ?? '';
}

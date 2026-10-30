/**
 * Report of a cleaned link, from the MAIN world to the background:
 * MAIN content script → CustomEvent → bridge (isolated world) → runtime message → background.
 * The payload travels as JSON: only strings cross worlds cleanly (Firefox Xray vision).
 */
export const CLEANED_EVENT = 'x-clear-urls:cleaned';

export interface CleanedReport {
  site: string;
  original: string;
  cleaned: string;
}

/** The payload comes from the page, which can forge it: validate it before storing. */
export function parseReport(raw: unknown): CleanedReport | null {
  if (typeof raw !== 'string') return null;
  try {
    const { site, original, cleaned } = JSON.parse(raw);
    if (typeof site !== 'string' || !isHttpUrl(original) || !isHttpUrl(cleaned)) return null;
    return { site, original, cleaned };
  } catch {
    return null;
  }
}

function isHttpUrl(value: unknown): value is string {
  if (typeof value !== 'string' || value.length > 2048) return false;
  try {
    return /^https?:$/.test(new URL(value).protocol);
  } catch {
    return false;
  }
}

/**
 * Signalement d'un lien nettoyé, du monde MAIN jusqu'au background :
 * content script MAIN → CustomEvent → bridge (monde isolé) → runtime message → background.
 * Le payload circule en JSON : seules les chaînes traversent proprement les mondes (Xray de Firefox).
 */
export const CLEANED_EVENT = 'x-clear-urls:cleaned';

export interface CleanedReport {
  site: string;
  original: string;
  cleaned: string;
}

/** Le payload vient de la page, qui peut le falsifier : on le valide avant de l'enregistrer. */
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

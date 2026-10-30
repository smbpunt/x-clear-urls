import type { Site } from './types';

// S'arrête avant la ponctuation finale : « voir https://x.com/…/1?a=b. »
const URL_IN_TEXT = /https?:\/\/[^\s<>"'`]*[^\s<>"'`.,;:!?)\]}]/g;

export function hostMatches(hostname: string, hosts: string[]): boolean {
  return hosts.some((host) => hostname === host || hostname.endsWith(`.${host}`));
}

export function findSite(sites: Site[], hostname: string): Site | undefined {
  return sites.find((site) => hostMatches(hostname, site.hosts));
}

/** `*.host` couvre aussi le domaine nu dans les match patterns. */
export function toMatchPatterns(hosts: string[]): string[] {
  return hosts.map((host) => `*://*.${host}/*`);
}

export function stripParams(url: URL, names: string[]): URL {
  for (const name of names) url.searchParams.delete(name);
  return url;
}

export type OnCleaned = (original: string, cleaned: string, site: Site) => void;

export function cleanUrl(raw: string, sites: Site[], onCleaned?: OnCleaned): string {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return raw;
  }

  const site = findSite(sites, url.hostname);
  if (!site) return raw;

  const cleaned = site.clean(new URL(url)).href;
  // `href` normalise l'URL : on ne touche au texte que si le nettoyage a changé quelque chose.
  if (cleaned === url.href) return raw;

  onCleaned?.(raw, cleaned, site);
  return cleaned;
}

export function cleanText(text: string, sites: Site[], onCleaned?: OnCleaned): string {
  return text.replace(URL_IN_TEXT, (raw) => cleanUrl(raw, sites, onCleaned));
}

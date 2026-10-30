import { CLEANED_EVENT } from '@/core/report';
import type { Site } from '@/core/types';
import { cleanText, findSite, toMatchPatterns } from '@/core/url';
import { sites } from '@/sites';

export default defineContentScript({
  matches: sites.flatMap((site) => toMatchPatterns(site.hosts)),
  // Monde MAIN : nécessaire pour remplacer les API de la page (presse-papier, etc.).
  world: 'MAIN',
  runAt: 'document_start',
  main() {
    const site = findSite(sites, location.hostname);
    if (!site) return;

    // Pas d'API `browser` dans le monde MAIN : le bridge relaie au background.
    const report = (original: string, cleaned: string, { id }: Site) =>
      window.dispatchEvent(
        new CustomEvent(CLEANED_EVENT, { detail: JSON.stringify({ site: id, original, cleaned }) }),
      );

    const ctx = { site, cleanText: (text: string) => cleanText(text, sites, report) };
    for (const handler of site.handlers) handler(ctx);
  },
});

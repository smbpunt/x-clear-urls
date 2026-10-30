import { CLEANED_EVENT } from '@/core/report';
import type { Site } from '@/core/types';
import { cleanText, findSite, toMatchPatterns } from '@/core/url';
import { sites } from '@/core/sites';

export default defineContentScript({
  matches: sites.flatMap((site) => toMatchPatterns(site.hosts)),
  // MAIN world: required to replace the page's APIs (clipboard, etc.).
  world: 'MAIN',
  runAt: 'document_start',
  main() {
    const site = findSite(sites, location.hostname);
    if (!site) return;

    // No `browser` API in the MAIN world: the bridge relays to the background.
    const report = (original: string, cleaned: string, { id }: Site) =>
      window.dispatchEvent(
        new CustomEvent(CLEANED_EVENT, { detail: JSON.stringify({ site: id, original, cleaned }) }),
      );

    const ctx = { site, cleanText: (text: string) => cleanText(text, sites, report) };
    for (const handler of site.handlers) handler(ctx);
  },
});

import { CLEANED_EVENT } from '@/core/report';
import { toMatchPatterns } from '@/core/url';
import { sites } from '@/core/sites';

// Isolated world: relays reports from the MAIN content script to the background.
export default defineContentScript({
  matches: sites.flatMap((site) => toMatchPatterns(site.hosts)),
  runAt: 'document_start',
  main() {
    window.addEventListener(CLEANED_EVENT, (event) => {
      const { detail } = event as CustomEvent<unknown>;
      if (typeof detail !== 'string') return;
      browser.runtime.sendMessage({ type: CLEANED_EVENT, report: detail }).catch(() => {});
    });
  },
});

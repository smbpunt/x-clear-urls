import { CLEANED_EVENT } from '@/core/report';
import { toMatchPatterns } from '@/core/url';
import { sites } from '@/sites';

// Monde isolé : relaie au background les signalements du content script MAIN.
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

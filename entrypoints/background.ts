import { record } from '@/core/history';
import { CLEANED_EVENT, parseReport } from '@/core/report';

export default defineBackground(() => {
  // Écritures sérialisées : plusieurs onglets peuvent signaler en même temps.
  let queue = Promise.resolve();

  browser.runtime.onMessage.addListener((message) => {
    if (message?.type !== CLEANED_EVENT) return;
    const report = parseReport(message.report);
    if (!report) return;
    queue = queue.then(() => record(report)).catch(console.error);
  });
});

import { storage } from '#imports';
import type { CleanedReport } from './report';

export interface CleanedLink extends CleanedReport {
  at: number;
}

const HISTORY_LIMIT = 100;
// Une même copie peut passer par plusieurs chemins (writeText, setData…) : on ne la compte qu'une fois.
const DEDUPE_MS = 2000;

export const history = storage.defineItem<CleanedLink[]>('local:history', { fallback: [] });
export const cleanedCount = storage.defineItem<number>('local:cleanedCount', { fallback: 0 });

export async function record(report: CleanedReport): Promise<void> {
  const entries = await history.getValue();
  const now = Date.now();
  const last = entries[0];
  if (last && last.original === report.original && now - last.at < DEDUPE_MS) return;

  await history.setValue([{ ...report, at: now }, ...entries].slice(0, HISTORY_LIMIT));
  await cleanedCount.setValue((await cleanedCount.getValue()) + 1);
}

/** Vide l'historique ; le compteur, lui, reste un total depuis l'installation. */
export async function clearHistory(): Promise<void> {
  await history.setValue([]);
}

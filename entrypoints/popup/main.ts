import './style.css';
import { cleanedCount, clearHistory, history, type CleanedLink } from '@/core/history';
import { sites } from '@/core/sites';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const countEl = $('count');
const countLabelEl = $('count-label');
const entriesEl = $<HTMLOListElement>('entries');
const emptyEl = $('empty');
const clearEl = $<HTMLButtonElement>('clear');
const siteListEl = $('site-list');

const siteNames = new Map(sites.map((site) => [site.id, site.name]));
const numberFormat = new Intl.NumberFormat('en');
const relativeFormat = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

function renderCount(count: number) {
  countEl.textContent = numberFormat.format(count);
  countLabelEl.textContent = count === 1 ? 'link cleaned' : 'links cleaned';
}

function renderHistory(entries: CleanedLink[]) {
  entriesEl.replaceChildren(...entries.map(renderEntry));
  emptyEl.hidden = entries.length > 0;
  clearEl.hidden = entries.length === 0;
}

// Entries come from third-party pages: render through textContent only, never innerHTML.
function renderEntry(entry: CleanedLink): HTMLLIElement {
  const li = el('li', 'entry');

  const meta = el('div', 'entry-meta');
  meta.append(
    el('span', 'entry-site', siteNames.get(entry.site) ?? entry.site),
    el('time', 'entry-time', timeAgo(entry.at)),
  );
  (meta.lastChild as HTMLTimeElement).dateTime = new Date(entry.at).toISOString();

  const link = el('a', 'entry-url', displayUrl(entry.cleaned));
  link.href = entry.cleaned;
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.title = entry.cleaned;

  const removed = el('div', 'entry-removed');
  for (const param of removedParams(entry)) removed.append(el('code', 'param', param));

  const copy = el('button', 'copy', 'Copy');
  copy.type = 'button';
  copy.addEventListener('click', async () => {
    await navigator.clipboard.writeText(entry.cleaned);
    copy.textContent = 'Copied';
    setTimeout(() => (copy.textContent = 'Copy'), 1200);
  });

  const body = el('div', 'entry-body');
  body.append(meta, link);
  if (removed.childElementCount) body.append(removed);
  li.append(body, copy);
  return li;
}

function removedParams({ original, cleaned }: CleanedLink): string[] {
  const kept = new URL(cleaned).searchParams;
  return [...new URL(original).searchParams]
    .filter(([key]) => !kept.has(key))
    .map(([key, value]) => (value ? `${key}=${truncate(value, 16)}` : key));
}

function displayUrl(url: string): string {
  const { host, pathname, search } = new URL(url);
  return host.replace(/^www\./, '') + pathname + search;
}

function timeAgo(at: number): string {
  const seconds = Math.round((at - Date.now()) / 1000);
  if (seconds > -60) return 'just now';
  const minutes = Math.round(seconds / 60);
  if (minutes > -60) return relativeFormat.format(minutes, 'minute');
  const hours = Math.round(minutes / 60);
  if (hours > -24) return relativeFormat.format(hours, 'hour');
  return relativeFormat.format(Math.round(hours / 24), 'day');
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text?: string) {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

siteListEl.textContent = new Intl.ListFormat('en', { type: 'disjunction' }).format(
  sites.map((site) => site.name),
);
clearEl.addEventListener('click', () => clearHistory());

renderCount(await cleanedCount.getValue());
renderHistory(await history.getValue());
cleanedCount.watch(renderCount);
history.watch(renderHistory);

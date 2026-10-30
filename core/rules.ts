import { handlers, type HandlerName } from '@/handlers';
import type { Site } from './types';
import { keepParams, stripParams } from './url';

/** One supported site, as declared in `rules.ts`. */
export interface Rule {
  /** Stable identifier, stored in the history: never rename it. */
  id: string;
  /** Name shown in the popup. */
  name: string;
  /** Covered domains, subdomains included (`youtube.com` also covers `m.youtube.com`). */
  hosts: string[];
  /** How links are intercepted on this site, see `handlers/`. */
  handlers: HandlerName[];
  /** Tracking params to remove, each with where it comes from. */
  strip: Record<string, string>;
  /** On matching paths, every param not listed is removed (`strip` is ignored). */
  allowOnly?: { path: RegExp; params: string[] }[];
  /** `[copied link, expected cleaned link]` pairs, replayed by the tests. */
  examples: [before: string, after: string][];
}

/** Identity function: gives type checking and autocompletion in `rules.ts`. */
export function defineRules(rules: Rule[]): Rule[] {
  return rules;
}

export function toSite(rule: Rule): Site {
  const strip = Object.keys(rule.strip);
  return {
    id: rule.id,
    name: rule.name,
    hosts: rule.hosts,
    handlers: rule.handlers.map((name) => handlers[name]),
    clean(url) {
      const allowed = rule.allowOnly?.find(({ path }) => path.test(url.pathname));
      return allowed ? keepParams(url, allowed.params) : stripParams(url, strip);
    },
  };
}

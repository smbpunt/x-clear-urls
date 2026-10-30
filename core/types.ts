/** A supported site, compiled from its entry in `rules.ts`. */
export interface Site {
  /** Stable identifier, stored in the history. */
  id: string;
  /** Name shown in the popup. */
  name: string;
  /** Covered domains, subdomains included (`youtube.com` also covers `m.youtube.com`). */
  hosts: string[];
  /** Cleans a URL of this site. Receives a copy, which may be modified in place. */
  clean: (url: URL) => URL;
  /** Behaviors installed on this site's pages. */
  handlers: Handler[];
}

export interface HandlerContext {
  site: Site;
  /** Cleans every known URL (from any supported site) found in a text. */
  cleanText: (text: string) => string;
}

/** Runs in the page's JS context (MAIN world), at `document_start`. */
export type Handler = (ctx: HandlerContext) => void;

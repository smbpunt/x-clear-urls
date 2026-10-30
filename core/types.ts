export interface Site {
  /** Identifiant stable, utilisé dans les logs. */
  id: string;
  /** Nom affiché dans l'interface. */
  name: string;
  /** Domaines couverts, sous-domaines inclus (ex. `youtube.com` couvre `m.youtube.com`). */
  hosts: string[];
  /** Nettoie une URL de ce site. Reçoit une copie, qui peut être modifiée en place. */
  clean: (url: URL) => URL;
  /** Comportements installés sur les pages de ce site. */
  handlers: Handler[];
}

export interface HandlerContext {
  site: Site;
  /** Nettoie toutes les URLs connues (tous sites confondus) contenues dans un texte. */
  cleanText: (text: string) => string;
}

/** S'exécute dans le contexte JS de la page (monde MAIN), au `document_start`. */
export type Handler = (ctx: HandlerContext) => void;

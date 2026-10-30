import type { Site } from '@/core/types';
import { stripParams } from '@/core/url';
import { clipboard } from '@/handlers/clipboard';

// Anciens paramètres de partage (`?s=20&t=…`) et de provenance.
const TRACKING = ['a', 's', 't', 'cn', 'src', 'ref_src', 'ref_url'];

export const x: Site = {
  id: 'x',
  name: 'X',
  hosts: ['x.com', 'twitter.com'],
  clean(url) {
    // Un lien de post n'a besoin d'aucun paramètre : on vide tout pour suivre les changements de X.
    if (/\/status\/\d+/.test(url.pathname)) {
      url.search = '';
      return url;
    }
    return stripParams(url, TRACKING);
  },
  handlers: [clipboard],
};

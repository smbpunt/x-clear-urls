import type { Site } from '@/core/types';
import { stripParams } from '@/core/url';
import { clipboard } from '@/handlers/clipboard';

// `si` : identifiant du partageur, ajouté par le bouton « Partager ».
// On garde `v`, `t`, `list`, `index`, nécessaires à la lecture.
const TRACKING = ['si', 'pp', 'feature', 'kw', 'gclid'];

export const youtube: Site = {
  id: 'youtube',
  name: 'YouTube',
  hosts: ['youtube.com', 'youtu.be'],
  clean: (url) => stripParams(url, TRACKING),
  handlers: [clipboard],
};

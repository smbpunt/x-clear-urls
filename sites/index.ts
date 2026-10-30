import type { Site } from '@/core/types';
import { x } from './x';
import { youtube } from './youtube';

/**
 * Registre des sites pris en charge.
 * Ajouter un site : créer `sites/<id>.ts` sur le modèle de `x.ts`, puis l'ajouter ici.
 * Le content script et ses `matches` sont dérivés de cette liste.
 */
export const sites: Site[] = [x, youtube];

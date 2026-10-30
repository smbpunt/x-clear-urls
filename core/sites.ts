import { rules } from '@/rules';
import { toSite } from './rules';
import type { Site } from './types';

/** Supported sites. Content script `matches` are derived from this list. */
export const sites: Site[] = rules.map(toSite);

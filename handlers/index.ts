import type { Handler } from '@/core/types';
import { clipboard } from './clipboard';

/**
 * Available handlers, referenced by name in `rules.ts`.
 * To add one: create `handlers/<name>.ts` exporting a `Handler`, then register it here.
 */
export const handlers = { clipboard } satisfies Record<string, Handler>;

export type HandlerName = keyof typeof handlers;

/**
 * @module StoveSanitizer
 *
 * @description Sanitizers for Stove model.
 */

import { HydratedDocument } from 'mongoose';
import { resolveRef, listSanitizer, storeSanitizer, userSanitizer } from '@/sanitizers/index.js';
import { IStove } from './index.js';

/**
 * ----------------- Stove -----------------
 */
export const stoveSanitizer = (stove: IStove | HydratedDocument<IStove>) => ({
  id: String(stove._id),
  store: resolveRef(stove.store, storeSanitizer),

  name: stove.name,
  stoveImage: stove.stoveImage ?? null,
  burnerCount: stove.burnerCount,
  price: stove.price,
  stockCount: stove.stockCount,
  defectedCount: stove.defectedCount,

  createdBy: resolveRef(stove.createdBy, userSanitizer),
  updatedBy: resolveRef(stove.updatedBy, userSanitizer),
  createdAt: stove.createdAt,
  updatedAt: stove.updatedAt,
});

export type SanitizedStove = ReturnType<typeof stoveSanitizer>;

/**
 * ----------------- Stove List -----------------
 * Can optionally select only specific fields
 */
export const allStoveSanitizer = (
  stoves: IStove[] | HydratedDocument<IStove>[],
  fields?: (keyof SanitizedStove)[]
) => ({
  stoves: listSanitizer(stoves, stoveSanitizer, fields),
});

export type SanitizedStoves = ReturnType<typeof allStoveSanitizer>;

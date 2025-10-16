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
  burnerType: stove.burnerType,
  price: stove.price,
  stockCount: stove.stockCount,
  problemCount: stove.problemCount,

  createdBy: resolveRef(stove.createdBy, userSanitizer),
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

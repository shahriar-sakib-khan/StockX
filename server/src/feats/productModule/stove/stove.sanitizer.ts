import { HydratedDocument } from 'mongoose';

import { IStove } from './index.js';

import { listSanitizer, resolveRef, userSanitizer, storeSanitizer } from '@/sanitizers/index.js';

export const stoveSanitizer = (doc: IStove | HydratedDocument<IStove>) => ({
  id: String(doc._id),
  store: resolveRef(doc.store, storeSanitizer),
  name: doc.name,
  image: doc.image || null,
  burnerCount: doc.burnerCount,

  price: doc.price,
  stockCount: doc.stockCount,
  defectedCount: doc.defectedCount,

  updatedBy: resolveRef(doc.updatedBy, userSanitizer),
  createdBy: resolveRef(doc.createdBy, userSanitizer),
  updatedAt: doc.updatedAt,
});

export type SanitizedStove = ReturnType<typeof stoveSanitizer>;

export const allStoveSanitizer = (
  docs: IStove[] | HydratedDocument<IStove>[],
  fields?: (keyof SanitizedStove)[]
) => ({
  stoves: listSanitizer(docs, stoveSanitizer, fields),
});

export type SanitizedStoves = ReturnType<typeof allStoveSanitizer>;

import { HydratedDocument } from 'mongoose';

import { IRegulator } from './index.js';

import { listSanitizer, resolveRef, userSanitizer, storeSanitizer } from '@/sanitizers/index.js';

export const regulatorSanitizer = (doc: IRegulator | HydratedDocument<IRegulator>) => ({
  id: String(doc._id),
  store: resolveRef(doc.store, storeSanitizer),
  name: doc.name,
  image: doc.image || null,
  regulatorType: doc.regulatorType,

  price: doc.price,
  stockCount: doc.stockCount,
  defectedCount: doc.defectedCount,

  updatedBy: resolveRef(doc.updatedBy, userSanitizer),
  createdBy: resolveRef(doc.createdBy, userSanitizer),
  updatedAt: doc.updatedAt,
});

export type SanitizedRegulator = ReturnType<typeof regulatorSanitizer>;

export const allRegulatorSanitizer = (
  docs: IRegulator[] | HydratedDocument<IRegulator>[],
  fields?: (keyof SanitizedRegulator)[]
) => ({
  regulators: listSanitizer(docs, regulatorSanitizer, fields),
});
export type SanitizedRegulators = ReturnType<typeof allRegulatorSanitizer>;

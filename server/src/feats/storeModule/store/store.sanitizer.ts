import { HydratedDocument } from 'mongoose';

import { IStore } from './index.js';

import { listSanitizer, resolveRef, userSanitizer } from '@/sanitizers/index.js';

export const storeSanitizer = (doc: IStore | HydratedDocument<IStore>) => ({
  id: String(doc._id),
  name: doc.name,
  storeCode: doc.storeCode,
  description: doc.description || null,
  image: doc.image || null,
  location: doc.location,
  phone: doc.phone,
  createdBy: resolveRef(doc.createdBy, userSanitizer),
  storeRoles: doc.storeRoles ? doc.storeRoles.map(r => r.name) : [],
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export type SanitizedStore = ReturnType<typeof storeSanitizer>;

export const allStoreSanitizer = (
  docs: IStore[] | HydratedDocument<IStore>[],
  fields?: (keyof SanitizedStore)[]
) => ({
  stores: listSanitizer(docs, storeSanitizer, fields),
});

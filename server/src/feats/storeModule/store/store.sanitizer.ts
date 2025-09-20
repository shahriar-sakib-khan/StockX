import { HydratedDocument } from 'mongoose';

import { resolveRef, listSanitizer, userSanitizer } from '@/sanitizers/index.js';

import { IStore } from './index.js';

/**
 * ----------------- Store -----------------
 */
export const storeSanitizer = (store: IStore | HydratedDocument<IStore>) => ({
  id: String(store._id),
  name: store.name,
  description: store.description ?? null,
  image: store.image ?? null,
  location: store.location,
  phone: store.phone,
  createdBy: resolveRef(store.createdBy ?? null, userSanitizer),
  storeRoles: store.storeRoles ?? [],
  createdAt: store.createdAt,
  updatedAt: store.updatedAt,
});

export type SanitizedStore = ReturnType<typeof storeSanitizer>;

/**
 * ----------------- Store List -----------------
 * Can optionally select only specific fields
 */
export const allStoreSanitizer = (
  stores: IStore[] | HydratedDocument<IStore>[],
  fields?: (keyof SanitizedStore)[]
) => ({
  stores: listSanitizer(stores, storeSanitizer, fields),
});

export type SanitizedStores = ReturnType<typeof allStoreSanitizer>;

import { HydratedDocument } from 'mongoose';

import { IStore } from '@/models/index.js';
import {
  resolveRef,
  listSanitizer,
  workspaceSanitizer,
  divisionSanitizer,
} from '@/sanitizers/index.js';

/**
 * ----------------- Store -----------------
 */
export const storeSanitizer = (store: IStore | HydratedDocument<IStore>) => ({
  id: String(store._id),
  name: store.name,
  contactName: store.contactName ?? null,
  phone: store.phone ?? null,
  address: store.address ?? null,
  image: store.image ?? null,
  balance: store.balance,
  workspace: resolveRef(store.workspace ?? null, workspaceSanitizer),
  division: resolveRef(store.division ?? null, divisionSanitizer),
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

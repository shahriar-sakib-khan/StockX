import { HydratedDocument } from 'mongoose';

import { IStore } from '@/models';
import resolveRef from './resolveRef';
import listSanitizer from './listSanitizer';
import { workspaceSanitizer } from './workspaceSanitizers';
import { divisionSanitizer } from './divisionSanitizers';

/**
 * ----------------- Store -----------------
 */
export const storeSanitizer = (store: IStore | HydratedDocument<IStore>) => ({
  id: String(store._id),
  name: store.name,
  contactName: store.contactName ?? null,
  phone: store.phone ?? null,
  address: store.address ?? null,
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

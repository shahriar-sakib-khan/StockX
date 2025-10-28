import { HydratedDocument } from 'mongoose';

import {
  resolveRef,
  listSanitizer,
  storeSanitizer,
  userSanitizer,
  globalBrandSanitizer,
} from '@/sanitizers/index.js';

import { ILocalBrand } from './index.js';

/**
 * ----------------- LocalBrand -----------------
 */
export const localBrandSanitizer = (localBrand: ILocalBrand | HydratedDocument<ILocalBrand>) => ({
  id: String(localBrand._id),
  store: resolveRef(localBrand.store, storeSanitizer),
  globalBrand: resolveRef(localBrand.globalBrand ?? null, globalBrandSanitizer),

  name: localBrand.name,
  brandImage: localBrand.brandImage ?? null,
  brandImagePublicId: localBrand.brandImagePublicId ?? null,
  cylinderImage: localBrand.cylinderImage ?? null,
  cylinderImagePublicId: localBrand.cylinderImagePublicId ?? null,
  regulatorTypes: localBrand.regulatorTypes ?? [],
  sizes: localBrand.sizes ?? [],
  prices:
    localBrand.prices?.map(price => ({
      size: price.size,
      regulatorType: price.regulatorType,
      price: price.price,
    })) ?? [],

  isActive: localBrand.isActive,

  createdBy: resolveRef(localBrand.createdBy, userSanitizer),
  selectedBy: resolveRef(localBrand.selectedBy, userSanitizer),
  createdAt: localBrand.createdAt,
  updatedAt: localBrand.updatedAt,
});

export type SanitizedLocalBrand = ReturnType<typeof localBrandSanitizer>;

/**
 * ----------------- LocalBrand List -----------------
 * Can optionally select only specific fields
 */
export const allLocalBrandSanitizer = (
  localBrands: ILocalBrand[] | HydratedDocument<ILocalBrand>[],
  fields?: (keyof SanitizedLocalBrand)[]
) => ({
  localBrands: listSanitizer(localBrands, localBrandSanitizer, fields),
});

export type SanitizedLocalBrands = ReturnType<typeof allLocalBrandSanitizer>;

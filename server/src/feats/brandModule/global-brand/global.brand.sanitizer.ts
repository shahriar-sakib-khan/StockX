import { HydratedDocument } from 'mongoose';

import { listSanitizer } from '@/sanitizers/index.js';

import { IGlobalBrand } from './index.js';

/**
 * ----------------- GlobalBrand -----------------
 */
export const globalBrandSanitizer = (
  globalBrand: IGlobalBrand | HydratedDocument<IGlobalBrand>
) => ({
  id: String(globalBrand._id),
  name: globalBrand.name,
  brandImage: globalBrand.brandImage ?? null,
  brandImagePublicId: globalBrand.brandImagePublicId ?? null,
  cylinderImage: globalBrand.cylinderImage ?? null,
  cylinderImagePublicId: globalBrand.cylinderImagePublicId ?? null,
  regulatorTypes: globalBrand.regulatorTypes ?? [],
  sizes: globalBrand.sizes ?? [],
  prices:
    globalBrand.prices?.map(price => ({
      size: price.size,
      regulatorType: price.regulatorType,
      price: price.price,
    })) ?? [],
  createdAt: globalBrand.createdAt,
  updatedAt: globalBrand.updatedAt,
});

export type SanitizedGlobalBrand = ReturnType<typeof globalBrandSanitizer>;

/**
 * ----------------- GlobalBrand List -----------------
 * Can optionally select only specific fields
 */
export const allGlobalBrandSanitizer = (
  globalBrands: IGlobalBrand[] | HydratedDocument<IGlobalBrand>[],
  fields?: (keyof SanitizedGlobalBrand)[]
) => ({
  globalBrands: listSanitizer(globalBrands, globalBrandSanitizer, fields),
});

export type SanitizedGlobalBrands = ReturnType<typeof allGlobalBrandSanitizer>;

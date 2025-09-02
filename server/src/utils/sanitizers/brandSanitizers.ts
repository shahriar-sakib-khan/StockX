import { HydratedDocument } from 'mongoose';

import { IGlobalBrand, ILocalBrand } from '@/models';
import resolveRef from './resolveRef';
import listSanitizer from './listSanitizer';
import { divisionSanitizer } from './divisionSanitizers';
import { workspaceSanitizer } from './workspaceSanitizers';
import { userSanitizer } from './userSanitizers';

/**
 * ----------------- Global Brand -----------------
 */
export const globalBrandSanitizer = (
  globalBrand: IGlobalBrand | HydratedDocument<IGlobalBrand>
) => ({
  id: String(globalBrand._id),
  name: globalBrand.name,
  image: globalBrand.image,
  regulatorTypes: globalBrand.regulatorTypes ?? [],
  sizes: globalBrand.sizes ?? [],
  prices: globalBrand.prices ?? [],
});

export type SanitizedGlobalBrand = ReturnType<typeof globalBrandSanitizer>;

/**
 * ----------------- Global Brand List -----------------
 * Optional field selection supported
 */
export const allGlobalBrandSanitizer = (
  globalBrands: IGlobalBrand[] | HydratedDocument<IGlobalBrand>[],
  fields?: (keyof SanitizedGlobalBrand)[]
) => ({
  globalBrands: listSanitizer(globalBrands, globalBrandSanitizer, fields),
});

export type SanitizedAllGlobalBrands = ReturnType<typeof allGlobalBrandSanitizer>;

/**
 * ----------------- Local Brand -----------------
 */
export const localBrandSanitizer = (localBrand: ILocalBrand | HydratedDocument<ILocalBrand>) => ({
  id: String(localBrand._id),
  name: localBrand.name,
  image: localBrand.image,
  globalBrand: resolveRef(localBrand.globalBrand ?? null, globalBrandSanitizer),
  division: resolveRef(localBrand.division ?? null, divisionSanitizer),
  workspace: resolveRef(localBrand.workspace ?? null, workspaceSanitizer),
  selectedBy: resolveRef(localBrand.selectedBy ?? null, userSanitizer),
  isActive: localBrand.isActive,
  totalFullCount: localBrand.totalFullCount,
  totalEmptyCount: localBrand.totalEmptyCount,
});

export type SanitizedLocalBrand = ReturnType<typeof localBrandSanitizer>;

/**
 * ----------------- Local Brand List -----------------
 * Optional field selection supported
 */
export const allLocalBrandSanitizer = (
  localBrands: ILocalBrand[] | HydratedDocument<ILocalBrand>[],
  fields?: (keyof SanitizedLocalBrand)[]
) => ({
  localBrands: listSanitizer(localBrands, localBrandSanitizer, fields),
});

export type SanitizedAllLocalBrands = ReturnType<typeof allLocalBrandSanitizer>;

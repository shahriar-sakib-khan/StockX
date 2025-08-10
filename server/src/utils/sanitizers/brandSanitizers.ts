import { HydratedDocument } from 'mongoose';

import { IGlobalBrand, ILocalBrand } from '@/models';
import resolveRef from './resolveRef';
import { divisionSanitizer } from './divisionSanitizers';
import { workspaceSanitizer } from './workspaceSanitizers';
import { userSanitizer } from './userSanitizers';

// ----------------- Global Brands -----------------
export const globalBrandSanitizer = (
  globalBrands: IGlobalBrand | HydratedDocument<IGlobalBrand>
) => ({
  id: String(globalBrands._id),
  name: globalBrands.name,
  regulatorTypes: globalBrands.regulatorTypes,
  sizes: globalBrands.sizes,
  prices: globalBrands.prices,
});
export type SanitizedGlobalBrand = ReturnType<typeof globalBrandSanitizer>;

export const allGlobalBrandSanitizer = (globalBrands: IGlobalBrand[]) => ({
  globalBrands: globalBrands.map(globalBrand => ({
    id: String(globalBrand._id),
    name: globalBrand.name,
  })),
});
export type SanitizedAllGlobalBrands = ReturnType<typeof allGlobalBrandSanitizer>;

// ----------------- Local Brands -----------------

export const localBrandSanitizer = (localBrand: ILocalBrand | HydratedDocument<ILocalBrand>) => ({
  id: String(localBrand._id),
  globalBrand: localBrand.globalBrand
    ? resolveRef(localBrand.globalBrand, globalBrandSanitizer)
    : localBrand.globalBrand,
  division: localBrand.division
    ? resolveRef(localBrand.division, divisionSanitizer)
    : localBrand.division,
  workspace: localBrand.workspace
    ? resolveRef(localBrand.workspace, workspaceSanitizer)
    : localBrand.workspace,
  selectedBy: localBrand.selectedBy
    ? resolveRef(localBrand.selectedBy, userSanitizer)
    : localBrand.selectedBy,
  isActive: localBrand.isActive,
});
export type SanitizedLocalBrand = ReturnType<typeof localBrandSanitizer>;

export const allLocalBrandSanitizer = (localBrands: ILocalBrand[]) => ({
  localBrands: localBrands.map(localBrand => ({
    id: String(localBrand._id),
    globalBrand: localBrand.globalBrand
      ? resolveRef(localBrand.globalBrand, globalBrandSanitizer).name
      : localBrand.globalBrand,
  })),
});
export type SanitizedAllLocalBrands = ReturnType<typeof allLocalBrandSanitizer>;

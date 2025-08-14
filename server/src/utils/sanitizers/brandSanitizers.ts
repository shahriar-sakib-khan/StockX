import { HydratedDocument } from 'mongoose';

import { IGlobalBrand, ILocalBrand } from '@/models';
import resolveRef from './resolveRef';
import { divisionSanitizer } from './divisionSanitizers';
import { workspaceSanitizer } from './workspaceSanitizers';
import { userSanitizer } from './userSanitizers';

// ----------------- Global Brands -----------------
export const globalBrandSanitizer = (
  globalBrand: IGlobalBrand | HydratedDocument<IGlobalBrand>
) => ({
  id: String(globalBrand._id),
  name: globalBrand.name,
  regulatorTypes: globalBrand.regulatorTypes,
  sizes: globalBrand.sizes,
  prices: globalBrand.prices,
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
  totalFullCount: localBrand.totalFullCount,
  totalEmptyCount: localBrand.totalEmptyCount,
});
export type SanitizedLocalBrand = ReturnType<typeof localBrandSanitizer>;

export const allLocalBrandSanitizer = (localBrands: ILocalBrand[]) => ({
  localBrands: localBrands.map(localBrand => ({
    id: String(localBrand._id),
    globalBrand: localBrand.globalBrand
      ? resolveRef(localBrand.globalBrand, globalBrandSanitizer).name
      : localBrand.globalBrand,
    totalFullCount: localBrand.totalFullCount,
    totalEmptyCount: localBrand.totalEmptyCount,
  })),
});
export type SanitizedAllLocalBrands = ReturnType<typeof allLocalBrandSanitizer>;

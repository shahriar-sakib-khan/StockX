import { HydratedDocument } from 'mongoose';

import {
  resolveRef,
  listSanitizer,
  storeSanitizer,
  localBrandSanitizer,
  userSanitizer,
} from '@/sanitizers/index.js';

import { ICylinder } from './index.js';

/**
 * ----------------- Cylinder -----------------
 */
export const cylinderSanitizer = (cylinder: ICylinder | HydratedDocument<ICylinder>) => ({
  id: String(cylinder._id),
  store: resolveRef(cylinder.store, storeSanitizer),
  brand: resolveRef(cylinder.brand, localBrandSanitizer),

  sku: cylinder.sku,
  brandName: cylinder.brandName,
  name: `${cylinder.brandName} ${cylinder.size}${cylinder.unit} ${cylinder.regulatorType}`,

  cylinderImage: cylinder.cylinderImage ?? null,
  regulatorType: cylinder.regulatorType,
  size: cylinder.size,
  unit: cylinder.unit ?? null,
  price: cylinder.price,

  fullCount: cylinder.fullCount,
  emptyCount: cylinder.emptyCount,
  defectedCount: cylinder.defectedCount,

  isActive: cylinder.isActive,

  createdBy: resolveRef(cylinder.createdBy, userSanitizer),
  updatedBy: resolveRef(cylinder.updatedBy, userSanitizer),

  createdAt: cylinder.createdAt,
  updatedAt: cylinder.updatedAt,
});

export type SanitizedCylinder = ReturnType<typeof cylinderSanitizer>;

/**
 * ----------------- Cylinder List -----------------
 * Can optionally select only specific fields
 */
export const allCylinderSanitizer = (
  cylinders: ICylinder[] | HydratedDocument<ICylinder>[],
  fields?: (keyof SanitizedCylinder)[]
) => ({
  cylinders: listSanitizer(cylinders, cylinderSanitizer, fields),
});

export type SanitizedCylinders = ReturnType<typeof allCylinderSanitizer>;

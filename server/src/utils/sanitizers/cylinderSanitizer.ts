import { HydratedDocument } from 'mongoose';

import { ICylinder } from '@/models';
import resolveRef from './resolveRef';
import listSanitizer from './listSanitizer';
import { localBrandSanitizer } from './brandSanitizers';
import { workspaceSanitizer } from './workspaceSanitizers';
import { divisionSanitizer } from './divisionSanitizers';
import { userSanitizer } from './userSanitizers';

/**
 * ----------------- Cylinder -----------------
 */
export const cylinderSanitizer = (cylinder: ICylinder | HydratedDocument<ICylinder>) => ({
  id: String(cylinder._id),
  name: cylinder.name,
  image: cylinder.image,
  sku: cylinder.sku,
  count: cylinder.count,
  regulatorType: cylinder.regulatorType,
  size: cylinder.size,
  unit: cylinder.unit,
  isFull: cylinder.isFull,
  brand: resolveRef(cylinder.brand ?? null, localBrandSanitizer),
  workspace: resolveRef(cylinder.workspace ?? null, workspaceSanitizer),
  division: resolveRef(cylinder.division ?? null, divisionSanitizer),
  createdBy: resolveRef(cylinder.createdBy ?? null, userSanitizer),
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

export type SanitizedAllCylinders = ReturnType<typeof allCylinderSanitizer>;

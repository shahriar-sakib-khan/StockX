import { HydratedDocument } from 'mongoose';

import { ICylinder } from '@/models/index.js';
import resolveRef from './resolveRef.js';
import listSanitizer from './listSanitizer.js';
import { localBrandSanitizer } from './brandSanitizers.js';
import { workspaceSanitizer } from './workspaceSanitizers.js';
import { divisionSanitizer } from './divisionSanitizers.js';
import { userSanitizer } from './userSanitizers.js';

/**
 * ----------------- Cylinder -----------------
 */
export const cylinderSanitizer = (cylinder: ICylinder | HydratedDocument<ICylinder>) => ({
  id: String(cylinder._id),
  name: cylinder.name,
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

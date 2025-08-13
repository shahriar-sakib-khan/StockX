import { HydratedDocument } from 'mongoose';

import { ICylinder } from '@/models';
import resolveRef from './resolveRef';
import { localBrandSanitizer } from './brandSanitizers';
import { workspaceSanitizer } from './workspaceSanitizers';
import { divisionSanitizer } from './divisionSanitizers';
import { userSanitizer } from './userSanitizers';

export const cylinderSanitizer = (cylinder: ICylinder | HydratedDocument<ICylinder>) => ({
  id: String(cylinder._id),
  name: cylinder.name,
  sku: cylinder.sku,
  count: cylinder.count,
  regulatorType: cylinder.regulatorType,
  size: cylinder.size,
  unit: cylinder.unit,
  isFull: cylinder.isFull,
  brand: cylinder.brand ? resolveRef(cylinder.brand, localBrandSanitizer) : cylinder.brand,
  workspace: cylinder.workspace
    ? resolveRef(cylinder.workspace, workspaceSanitizer)
    : cylinder.workspace,
  division: cylinder.division
    ? resolveRef(cylinder.division, divisionSanitizer)
    : cylinder.division,
  createdBy: cylinder.createdBy
    ? resolveRef(cylinder.createdBy, userSanitizer)
    : cylinder.createdBy,
});
export type SanitizedCylinder = ReturnType<typeof cylinderSanitizer>;

export const allCylinderSanitizer = (cylinders: any) => ({
  cylinders: cylinders.map((cylinder: any) => ({
    id: String(cylinder._id),
    name: cylinder.name,
    sku: cylinder.sku,
    count: cylinder.count,
    regulatorType: cylinder.regulatorType,
    size: cylinder.size,
    unit: cylinder.unit,
    isFull: cylinder.isFull,
  })),
});
export type SanitizedAllCylinders = ReturnType<typeof allCylinderSanitizer>;

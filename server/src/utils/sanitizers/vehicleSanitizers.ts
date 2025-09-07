import { HydratedDocument } from 'mongoose';

import { IVehicle } from '@/models';
import resolveRef from './resolveRef';
import listSanitizer from './listSanitizer';
import { workspaceSanitizer } from './workspaceSanitizers';
import { divisionSanitizer } from './divisionSanitizers';

/**
 * ----------------- Vehicle -----------------
 */
export const vehicleSanitizer = (vehicle: IVehicle | HydratedDocument<IVehicle>) => ({
  id: String(vehicle._id),
  regNumber: vehicle.regNumber,
  vehicleBrand: vehicle.vehicleBrand ?? null,
  vehicleModel: vehicle.vehicleModel ?? null,
  image: vehicle.image ?? null,
  totalFuelCost: vehicle.totalFuelCost,
  totalRepairCost: vehicle.totalRepairCost,
  createdAt: vehicle.createdAt,
  workspace: resolveRef(vehicle.workspace ?? null, workspaceSanitizer),
  division: resolveRef(vehicle.division ?? null, divisionSanitizer),
  updatedAt: vehicle.updatedAt,
});

export type SanitizedVehicle = ReturnType<typeof vehicleSanitizer>;

/**
 * ----------------- Vehicle List -----------------
 * Can optionally select only specific fields
 */
export const allVehicleSanitizer = (
  vehicles: IVehicle[] | HydratedDocument<IVehicle>[],
  fields?: (keyof SanitizedVehicle)[]
) => ({
  vehicles: listSanitizer(vehicles, vehicleSanitizer, fields),
});

export type SanitizedVehicles = ReturnType<typeof allVehicleSanitizer>;

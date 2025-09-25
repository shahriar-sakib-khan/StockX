import { HydratedDocument } from 'mongoose';

import { resolveRef, listSanitizer, storeSanitizer, userSanitizer } from '@/sanitizers/index.js';

import { IVehicle } from './index.js';

/**
 * ----------------- Vehicle -----------------
 * Sanitizes a single vehicle document
 */
export const vehicleSanitizer = (vehicle: IVehicle | HydratedDocument<IVehicle>) => ({
  id: String(vehicle._id),
  store: resolveRef(vehicle.store ?? null, storeSanitizer),

  regNumber: vehicle.regNumber,
  vehicleBrand: vehicle.vehicleBrand ?? null,
  vehicleModel: vehicle.vehicleModel ?? null,
  image: vehicle.image ?? null,

  totalFuelCost: vehicle.totalFuelCost,
  totalRepairCost: vehicle.totalRepairCost,

  createdBy: resolveRef(vehicle.createdBy, userSanitizer),
  createdAt: vehicle.createdAt,
  updatedAt: vehicle.updatedAt,
});

export type SanitizedVehicle = ReturnType<typeof vehicleSanitizer>;

/**
 * ----------------- Vehicle List -----------------
 * Sanitizes an array of vehicles with optional field selection
 */
export const allVehicleSanitizer = (
  vehicles: IVehicle[] | HydratedDocument<IVehicle>[],
  fields?: (keyof SanitizedVehicle)[]
) => ({
  vehicles: listSanitizer(vehicles, vehicleSanitizer, fields),
});

export type SanitizedVehicles = ReturnType<typeof allVehicleSanitizer>;

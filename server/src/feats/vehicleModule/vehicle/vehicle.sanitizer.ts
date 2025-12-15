import { HydratedDocument } from 'mongoose';

import { IVehicle } from './index.js';

import { listSanitizer, resolveRef, userSanitizer, storeSanitizer } from '@/sanitizers/index.js';

export const vehicleSanitizer = (doc: IVehicle | HydratedDocument<IVehicle>) => ({
  id: String(doc._id),
  store: resolveRef(doc.store, storeSanitizer),
  regNumber: doc.regNumber,
  vehicleBrand: doc.vehicleBrand || null,
  vehicleModel: doc.vehicleModel || null,
  image: doc.image || null,

  totalFuelCost: doc.totalFuelCost,
  totalRepairCost: doc.totalRepairCost,

  createdBy: resolveRef(doc.createdBy, userSanitizer),
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export type SanitizedVehicle = ReturnType<typeof vehicleSanitizer>;

export const allVehicleSanitizer = (
  docs: IVehicle[] | HydratedDocument<IVehicle>[],
  fields?: (keyof SanitizedVehicle)[]
) => ({
  vehicles: listSanitizer(docs, vehicleSanitizer, fields),
});

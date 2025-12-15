import { Types, ClientSession } from 'mongoose';

import { Vehicle, IVehicle, vehicleSanitizers, vehicleValidator } from './index.js';

import { Errors } from '@/error/index.js';
import { logger } from '@/utils/index.js';

/**
 * @function createVehicle
 * @description Create a new vehicle under a specific store.
 */
export const createVehicle = async (
  data: vehicleValidator.CreateVehicleInput,
  userId: string,
  storeId: string,
  session?: ClientSession
): Promise<vehicleSanitizers.SanitizedVehicle> => {
  const existing = await Vehicle.exists({ store: storeId, regNumber: data.regNumber }).session(
    session || null
  );
  if (existing) {
    throw new Errors.BadRequestError(`Vehicle '${data.regNumber}' already exists in this store`);
  }

  const [vehicle] = await Vehicle.create(
    [
      {
        ...data,
        store: new Types.ObjectId(storeId),
        createdBy: new Types.ObjectId(userId),
      },
    ],
    { session }
  );

  logger.info(`Vehicle created: ${vehicle.regNumber} (${vehicle._id})`);

  return vehicleSanitizers.vehicleSanitizer(vehicle);
};

/**
 * @function getAllVehicles
 * @description Get all vehicles for a specific store with pagination.
 */
export const getAllVehicles = async (
  storeId: string,
  page: number,
  limit: number
): Promise<{ vehicles: Partial<vehicleSanitizers.SanitizedVehicle>[]; total: number }> => {
  const total = await Vehicle.countDocuments({ store: storeId });
  const vehicles = await Vehicle.find({ store: storeId })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return {
    vehicles: vehicleSanitizers.allVehicleSanitizer(vehicles as unknown as IVehicle[]).vehicles,
    total,
  };
};

/**
 * @function getVehicleById
 * @description Get a vehicle by its ID.
 */
export const getVehicleById = async (
  vehicleId: string,
  storeId: string
): Promise<vehicleSanitizers.SanitizedVehicle> => {
  const vehicle = await Vehicle.findOne({ _id: vehicleId, store: storeId }).lean();
  if (!vehicle) throw new Errors.NotFoundError('Vehicle not found');

  return vehicleSanitizers.vehicleSanitizer(vehicle as unknown as IVehicle);
};

/**
 * @function updateVehicle
 * @description Update a vehicle by its ID.
 */
export const updateVehicle = async (
  vehicleId: string,
  storeId: string,
  data: vehicleValidator.UpdateVehicleInput,
  session?: ClientSession
): Promise<vehicleSanitizers.SanitizedVehicle> => {
  const vehicle = await Vehicle.findOneAndUpdate(
    { _id: vehicleId, store: storeId },
    { $set: data },
    { new: true, session, runValidators: true }
  ).lean();

  if (!vehicle) throw new Errors.NotFoundError('Vehicle not found');

  logger.info(`Vehicle updated: ${vehicle.regNumber} (${vehicle._id})`);

  return vehicleSanitizers.vehicleSanitizer(vehicle as unknown as IVehicle);
};

/**
 * @function deleteVehicle
 * @description Delete a vehicle by its ID.
 */
export const deleteVehicle = async (
  vehicleId: string,
  storeId: string,
  session?: ClientSession
): Promise<vehicleSanitizers.SanitizedVehicle> => {
  const vehicle = await Vehicle.findOneAndDelete(
    { _id: vehicleId, store: storeId },
    { session }
  ).lean();

  if (!vehicle) throw new Errors.NotFoundError('Vehicle not found');

  logger.info(`Vehicle deleted: ${vehicle.regNumber} (${vehicle._id})`);

  return vehicleSanitizers.vehicleSanitizer(vehicle as unknown as IVehicle);
};

/**
 * @function removeAllVehicles
 * @description Deletes all vehicles for a specific store (Cascading Delete).
 */
export const removeAllVehicles = async (
  storeId: string,
  session?: ClientSession
): Promise<void> => {
  const result = await Vehicle.deleteMany({ store: storeId }, { session });
  logger.info(`[Cleanup] Deleted ${result.deletedCount} vehicles for store ${storeId}`);
};

export default {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  removeAllVehicles,
};

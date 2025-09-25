/**
 * @module vehicle.service
 *
 * @description Services for vehicle management within a store.
 */

import { Types } from 'mongoose';
import { Errors } from '@/error/index.js';

import { Vehicle, vehicleSanitizers, vehicleValidator } from './index.js';

/**
 * @function createVehicle
 * @description Creates a new vehicle for a store.
 *
 * @param {vehicleValidator.CreateVehicleInput} payload - Vehicle creation data.
 * @param {string} userId - ID of the user creating the vehicle.
 * @param {string} storeId - ID of the store.
 * @returns {Promise<vehicleSanitizers.SanitizedVehicle>} The created vehicle.
 */
export const createVehicle = async (
  payload: vehicleValidator.CreateVehicleInput,
  userId: string,
  storeId: string
): Promise<vehicleSanitizers.SanitizedVehicle> => {
  const { regNumber, vehicleBrand, vehicleModel, image } = payload;

  // Ensure unique registration number per store
  const existingVehicle = await Vehicle.exists({ store: storeId, regNumber });
  if (existingVehicle) {
    throw new Errors.BadRequestError(
      'Vehicle with this registration number already exists in this store'
    );
  }

  const vehicle = await Vehicle.create({
    store: new Types.ObjectId(storeId),
    regNumber,
    vehicleBrand,
    vehicleModel,
    image,
    totalFuelCost: 0,
    totalRepairCost: 0,
    createdBy: new Types.ObjectId(userId),
  });

  return vehicleSanitizers.vehicleSanitizer(vehicle);
};

/**
 * @function getAllVehicles
 * @description Retrieves all vehicles for a store with pagination.
 *
 * @param {string} storeId - Store ID.
 * @param {number} page - Page number.
 * @param {number} limit - Items per page.
 * @returns {Promise<vehicleSanitizers.SanitizedVehicles & { total: number }>}
 */
export const getAllVehicles = async (
  storeId: string,
  page: number,
  limit: number
): Promise<vehicleSanitizers.SanitizedVehicles & { total: number }> => {
  const total = await Vehicle.countDocuments({ store: storeId });
  if (total === 0) return { vehicles: [], total };

  const skip = (page - 1) * limit;
  const vehicles = await Vehicle.find({ store: storeId }).skip(skip).limit(limit).lean();

  return {
    vehicles: vehicleSanitizers.allVehicleSanitizer(vehicles, [
      'id',
      'regNumber',
      'vehicleBrand',
      'totalFuelCost',
      'totalRepairCost',
    ]).vehicles,
    total,
  };
};

/**
 * @function getVehicleById
 * @description Retrieves a single vehicle by ID within a store.
 *
 * @param {string} storeId - Store ID.
 * @param {string} vehicleId - Vehicle ID.
 * @returns {Promise<vehicleSanitizers.SanitizedVehicle>} The requested vehicle.
 * @throws {Errors.NotFoundError} If vehicle is not found.
 */
export const getVehicleById = async (
  storeId: string,
  vehicleId: string
): Promise<vehicleSanitizers.SanitizedVehicle> => {
  const vehicle = await Vehicle.findOne({ _id: vehicleId, store: storeId }).lean();
  if (!vehicle) throw new Errors.NotFoundError('Vehicle not found');

  return vehicleSanitizers.vehicleSanitizer(vehicle);
};

/**
 * @function updateVehicle
 * @description Updates a vehicle's details.
 *
 * @param {vehicleValidator.UpdateVehicleInput} payload - Updated vehicle data.
 * @param {string} storeId - Store ID.
 * @param {string} vehicleId - Vehicle ID.
 * @returns {Promise<vehicleSanitizers.SanitizedVehicle>} Updated vehicle.
 * @throws {Errors.NotFoundError} If vehicle is not found.
 */
export const updateVehicle = async (
  payload: vehicleValidator.UpdateVehicleInput,
  storeId: string,
  vehicleId: string
): Promise<vehicleSanitizers.SanitizedVehicle> => {
  const updatedVehicle = await Vehicle.findOneAndUpdate(
    { _id: vehicleId, store: storeId },
    { ...payload, updatedAt: new Date() },
    { new: true, runValidators: true }
  ).lean();

  if (!updatedVehicle) throw new Errors.NotFoundError('Vehicle not found');

  return vehicleSanitizers.vehicleSanitizer(updatedVehicle);
};

/**
 * @function deleteVehicle
 * @description Deletes a vehicle from a store.
 *
 * @param {string} storeId - Store ID.
 * @param {string} vehicleId - Vehicle ID.
 * @returns {Promise<vehicleSanitizers.SanitizedVehicle>} Deleted vehicle.
 * @throws {Errors.NotFoundError} If vehicle is not found.
 */
export const deleteVehicle = async (
  storeId: string,
  vehicleId: string
): Promise<vehicleSanitizers.SanitizedVehicle> => {
  const vehicle = await Vehicle.findOneAndDelete({ _id: vehicleId, store: storeId }).lean();
  if (!vehicle) throw new Errors.NotFoundError('Vehicle not found');

  return vehicleSanitizers.vehicleSanitizer(vehicle);
};

/**
 * ----------------- Default Exports (vehicleService) -----------------
 */
export default {
  createVehicle, // Create a new vehicle
  getAllVehicles, // Get all vehicles for a store
  getVehicleById, // Get a single vehicle by ID
  updateVehicle, // Update vehicle details
  deleteVehicle, // Delete a vehicle
};

/**
 * @module vehicle.service
 *
 * @description Services for vehicle-related operations within workspace divisions.
 * Handles CRUD, sanitization, and pagination.
 */

import { Types } from 'mongoose';
import { Vehicle, IVehicle } from '@/models';
import { Errors } from '@/error';
import { vehicle } from '@/validations';
import { vehicleSanitizers } from '@/utils';

/**
 * @function createVehicle
 * @description Create a new vehicle under a specific workspace and division.
 *
 * @param {vehicle.VehicleInput} vehicleData - Vehicle creation data.
 * @param {string} workspaceId - Workspace ID.
 * @param {string} divisionId - Division ID.
 * @returns {Promise<vehicleSanitizers.SanitizedVehicle>} Created vehicle.
 */
export const createVehicle = async (
  vehicleData: vehicle.VehicleInput,
  workspaceId: string,
  divisionId: string
): Promise<vehicleSanitizers.SanitizedVehicle> => {
  const { regNumber, brand, vehicleModel } = vehicleData;

  // Check for duplicate regNumber in the same workspace & division
  const existing = await Vehicle.exists({
    regNumber,
    workspace: workspaceId,
    division: divisionId,
  });
  if (existing)
    throw new Errors.BadRequestError('Vehicle with this registration number already exists');

  const newVehicle = await Vehicle.create({
    regNumber,
    brand,
    vehicleModel,
    workspace: new Types.ObjectId(workspaceId),
    division: new Types.ObjectId(divisionId),
  });

  return vehicleSanitizers.vehicleSanitizer(newVehicle);
};

/**
 * @function getSingleVehicle
 * @description Get a single vehicle by ID within a workspace and division.
 *
 * @param {string} vehicleId - Vehicle ID.
 * @param {string} workspaceId - Workspace ID.
 * @param {string} divisionId - Division ID.
 * @returns {Promise<vehicleSanitizers.SanitizedVehicle>} Vehicle document.
 */
export const getSingleVehicle = async (
  vehicleId: string,
  workspaceId: string,
  divisionId: string
): Promise<vehicleSanitizers.SanitizedVehicle> => {
  const vehicleDoc = await Vehicle.findOne({
    _id: vehicleId,
    workspace: workspaceId,
    division: divisionId,
  }).lean();

  if (!vehicleDoc) throw new Errors.NotFoundError('Vehicle not found');

  return vehicleSanitizers.vehicleSanitizer(vehicleDoc);
};

/**
 * @function updateVehicle
 * @description Update vehicle fields.
 *
 * @param {string} vehicleId - Vehicle ID.
 * @param {Partial<IVehicle>} vehicleData - Fields to update.
 * @param {string} workspaceId - Workspace ID.
 * @param {string} divisionId - Division ID.
 * @returns {Promise<vehicleSanitizers.SanitizedVehicle>} Updated vehicle document.
 */
export const updateVehicle = async (
  vehicleId: string,
  vehicleData: Partial<IVehicle>,
  workspaceId: string,
  divisionId: string
): Promise<vehicleSanitizers.SanitizedVehicle> => {
  const updatedVehicle = await Vehicle.findOneAndUpdate(
    { _id: vehicleId, workspace: workspaceId, division: divisionId },
    vehicleData,
    { new: true, runValidators: true }
  ).lean();

  if (!updatedVehicle) throw new Errors.NotFoundError('Vehicle not found');

  return vehicleSanitizers.vehicleSanitizer(updatedVehicle);
};

/**
 * @function deleteVehicle
 * @description Delete a vehicle by ID within a workspace and division.
 *
 * @param {string} vehicleId - Vehicle ID.
 * @param {string} workspaceId - Workspace ID.
 * @param {string} divisionId - Division ID.
 * @returns {Promise<vehicleSanitizers.SanitizedVehicle>} Deleted vehicle.
 */
export const deleteVehicle = async (
  vehicleId: string,
  workspaceId: string,
  divisionId: string
): Promise<vehicleSanitizers.SanitizedVehicle> => {
  const deletedVehicle = await Vehicle.findOneAndDelete({
    _id: vehicleId,
    workspace: workspaceId,
    division: divisionId,
  }).lean();

  if (!deletedVehicle) throw new Errors.NotFoundError('Vehicle not found');

  return vehicleSanitizers.vehicleSanitizer(deletedVehicle);
};

/**
 * @function getAllVehicles
 * @description Get paginated vehicles for a workspace and division.
 *
 * @param {string} workspaceId - Workspace ID.
 * @param {string} divisionId - Division ID.
 * @param {number} page - Page number.
 * @param {number} limit - Records per page.
 * @returns {Promise<vehicleSanitizers.SanitizedVehicles & { total: number }>} Paginated vehicles.
 */
export const getAllVehicles = async (
  workspaceId: string,
  divisionId: string,
  page: number,
  limit: number
): Promise<vehicleSanitizers.SanitizedVehicles & { total: number }> => {
  const total = await Vehicle.countDocuments({ workspace: workspaceId, division: divisionId });
  if (total === 0) return { vehicles: [], total };

  const skip: number = (page - 1) * limit;
  const vehicles = await Vehicle.find({ workspace: workspaceId, division: divisionId })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    vehicles: vehicleSanitizers.allVehicleSanitizer(vehicles, [
      'id',
      'regNumber',
      'brand',
      'vehicleModel',
    ]).vehicles,
    total,
  };
};

export default {
  createVehicle,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
  getAllVehicles,
};

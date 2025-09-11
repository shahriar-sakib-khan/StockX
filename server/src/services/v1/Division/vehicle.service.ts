/**
 * @module vehicle.service
 *
 * @description Services for vehicle-related operations within workspace divisions.
 * Handles CRUD, sanitization, and pagination.
 */

import { Types } from 'mongoose';

import { Vehicle, IVehicle, Transaction, ITransaction } from '@/models';
import { Errors } from '@/error';
import { vehicle } from '@/validations';
import { transactionSanitizers, vehicleSanitizers } from '@/utils';
import { transactionService } from '@/services/v1';

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
  const { regNumber, vehicleBrand, vehicleModel } = vehicleData;

  // Check for duplicate regNumber in the same workspace & division
  const existing = await Vehicle.exists({
    regNumber,
    workspace: workspaceId,
    division: divisionId,
  });
  if (existing) {
    throw new Errors.BadRequestError('Vehicle with this registration number already exists');
  }

  const newVehicle = await Vehicle.create({
    regNumber,
    vehicleBrand,
    vehicleModel,
    workspace: new Types.ObjectId(workspaceId),
    division: new Types.ObjectId(divisionId),
    totalFuelCost: 0,
    totalRepairCost: 0,
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
  const vehicleDoc = await Vehicle.findById({
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
  const { regNumber, vehicleBrand, vehicleModel } = vehicleData;

  // Check for duplicate regNumber in the same workspace & division
  const existing = await Vehicle.exists({
    regNumber,
    workspace: workspaceId,
    division: divisionId,
    _id: { $ne: vehicleId },
  });
  if (existing)
    throw new Errors.BadRequestError('Vehicle with this registration number already exists');

  const updatedVehicle = await Vehicle.findOneAndUpdate(
    { _id: vehicleId, workspace: workspaceId, division: divisionId },
    { regNumber, vehicleBrand, vehicleModel },
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
      'vehicleBrand',
      'vehicleModel',
      'totalFuelCost',
      'totalRepairCost',
    ]).vehicles,
    total,
  };
};

/**
 * ----------------- Vehicle Transactions -----------------
 */

/**
 * @function recordVehicleTransaction
 * @description Record a repair cost for a vehicle.
 *
 * @param {string} userId - User ID.
 * @param {string} workspaceId - Workspace ID.
 * @param {string} divisionId - Division ID.
 * @param {number} vehicleId - Vehicle ID.
 * @param {any} userData - User data.
 * @returns {Promise<void>}
 */
export const recordVehicleTransaction = async (
  userId: string,
  workspaceId: string,
  divisionId: string,
  vehicleId: string,
  userData: vehicle.VehicleTransactionInput
): Promise<any> => {
  const { amount, category, paymentMethod, ref, details } = userData;

  // Map category to vehicle field
  const categoryFieldMap: Record<string, keyof IVehicle> = {
    fuel_payment: 'totalFuelCost',
    repair_payment: 'totalRepairCost',
  };

  // Update vehicle states
  const vehicle = await Vehicle.findOneAndUpdate(
    { _id: vehicleId, workspace: workspaceId, division: divisionId },
    { $inc: { [categoryFieldMap[category]]: amount } },
    { new: true } // return updated document
  )
    .select('id regNumber vehicleBrand vehicleModel totalRepairCost totalFuelCost')
    .lean();

  if (!vehicle) throw new Errors.NotFoundError('Vehicle not found');

  // Record the transaction
  const transaction = await transactionService.recordTransaction(userId, workspaceId, divisionId, {
    amount,
    category,
    paymentMethod: paymentMethod !== null ? paymentMethod : undefined,
    counterpartyType: 'vehicle',
    vehicleId,
    ref,
    details,
  });

  return {
    vehicle: vehicleSanitizers.vehicleSanitizer(vehicle),
    transaction: transactionSanitizers.transactionSanitizer(transaction),
  };
};

/**
 * @function getVehicleTransactions
 * @description Get all transactions for a vehicle.
 *
 * @param {number} page - Page number.
 * @param {number} limit - Records per page.
 * @param {string} workspaceId - Workspace ID.
 * @param {string} divisionId - Division ID.
 * @param {string} vehicleId - Vehicle ID.
 * @returns {Promise<any>} Transactions.
 */
export const getVehicleTransactions = async (
  page: number,
  limit: number,
  workspaceId: string,
  divisionId: string,
  vehicleId: string
): Promise<transactionSanitizers.SanitizedTransactions & { total: number }> => {
  const total = await Transaction.countDocuments({
    vehicleId: vehicleId,
    workspace: workspaceId,
    division: divisionId,
  });
  if (total === 0) return { transactions: [], total };

  const skip: number = (page - 1) * limit;
  const transactions = await Transaction.find({
    vehicleId: vehicleId,
    workspace: workspaceId,
    division: divisionId,
  })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    transactions: transactionSanitizers.allTransactionSanitizer(transactions, [
      'id',
      'amount',
      'category',
      'paymentMethod',
      'createdAt',
    ]).transactions,
    total,
  };
};

/**
 * ----------------- Default Export (vehicleService) -----------------
 */
export default {
  createVehicle,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
  getAllVehicles,

  recordVehicleTransaction,
  getVehicleTransactions,
};

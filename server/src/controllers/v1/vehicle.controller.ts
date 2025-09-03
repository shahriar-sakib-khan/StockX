/**
 * @module VehicleController
 *
 * @description Controller for vehicle related operations within workspace divisions.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { vehicleService } from '@/services/v1';
import { assertAuth } from '@/common';

/**
 * ----------------- Vehicle CRUD Controllers -----------------
 */

/**
 * @function createVehicle
 * @desc Create a new vehicle in a division
 * @route POST /:workspaceId/divisions/:divisionId/vehicles
 * @access Admin (division)
 */
export const createVehicle = async (req: Request, res: Response) => {
  const { workspaceId, divisionId } = req.params;
  const vehicle = await vehicleService.createVehicle(req.body, workspaceId, divisionId);

  res.status(StatusCodes.CREATED).json({ message: 'Vehicle created successfully', vehicle });
};

/**
 * @function getAllVehicles
 * @desc Get all vehicles in a division with pagination
 * @route GET /:workspaceId/divisions/:divisionId/vehicles
 * @access Authenticated
 */
export const getAllVehicles = async (req: Request, res: Response) => {
  const { workspaceId, divisionId } = req.params;
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { vehicles, total } = await vehicleService.getAllVehicles(
    workspaceId,
    divisionId,
    page,
    limit
  );

  res.status(StatusCodes.OK).json({ total, page, limit, vehicles });
};

/**
 * @function getSingleVehicle
 * @desc Get a single vehicle by ID
 * @route GET /:workspaceId/divisions/:divisionId/vehicles/:vehicleId
 * @access Authenticated
 */
export const getSingleVehicle = async (req: Request, res: Response) => {
  const { workspaceId, divisionId, vehicleId } = req.params;

  const vehicle = await vehicleService.getSingleVehicle(vehicleId, workspaceId, divisionId);

  res.status(StatusCodes.OK).json({ vehicle });
};

/**
 * @function updateVehicle
 * @desc Update vehicle details
 * @route PUT /:workspaceId/divisions/:divisionId/vehicles/:vehicleId
 * @access Admin (division)
 */
export const updateVehicle = async (req: Request, res: Response) => {
  const { workspaceId, divisionId, vehicleId } = req.params;

  const vehicle = await vehicleService.updateVehicle(vehicleId, req.body, workspaceId, divisionId);

  res.status(StatusCodes.OK).json({ message: 'Vehicle updated successfully', vehicle });
};

/**
 * @function deleteVehicle
 * @desc Delete a vehicle
 * @route DELETE /:workspaceId/divisions/:divisionId/vehicles/:vehicleId
 * @access Admin (division)
 */
export const deleteVehicle = async (req: Request, res: Response) => {
  const { workspaceId, divisionId, vehicleId } = req.params;

  const vehicle = await vehicleService.deleteVehicle(vehicleId, workspaceId, divisionId);

  res.status(StatusCodes.OK).json({ message: 'Vehicle deleted successfully', vehicle });
};

/**
 * ----------------- Vehicle Transaction Controllers -----------------
 */

/**
 * @function recordVehicleTransaction
 * @desc Record a transaction for a vehicle (repair, fuel refill etc)
 * @route POST /:workspaceId/divisions/:divisionId/vehicles/:vehicleId/transactions
 * @access Admin (division)
 */
export const recordVehicleTransaction = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { workspaceId, divisionId, vehicleId } = req.params;

  const { vehicle, tsRecords } = await vehicleService.recordVehicleTransaction(
    userId,
    workspaceId,
    divisionId,
    vehicleId,
    req.body
  );

  res.status(StatusCodes.OK).json({ vehicle, tsRecords });
};

/**
 * @function getVehicleTransactions
 * @desc Get all transactions for a vehicle with pagination
 * @route GET /:workspaceId/divisions/:divisionId/vehicles/:vehicleId/transactions
 * @access Authenticated
 */
export const getVehicleTransactions = async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const { workspaceId, divisionId, vehicleId } = req.params;

  const { transactions, total } = await vehicleService.getVehicleTransactions(
    page,
    limit,
    workspaceId,
    divisionId,
    vehicleId
  );

  res.status(StatusCodes.OK).json({ total, page, limit, transactions });
};

/**
 * ----------------- Default Exports (vehicleController) -----------------
 */
export default {
  createVehicle, // Create a new vehicle
  getAllVehicles, // Get all vehicles in a division
  getSingleVehicle, // Get a single vehicle by ID
  updateVehicle, // Update vehicle details
  deleteVehicle, // Delete a vehicle

  recordVehicleTransaction, // Record a transaction for a vehicle (repair, fuel refill etc)
  getVehicleTransactions, // Get all transactions for a vehicle
};

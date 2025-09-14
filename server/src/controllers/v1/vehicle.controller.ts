/**
 * @module VehicleController
 *
 * @description Controller for vehicle related operations within workspace divisions.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { vehicleService } from '@/services/v1/index.js';
import { assertAuth } from '@/common/index.js';

/**
 * ----------------- Vehicle CRUD Controllers -----------------
 */

export const createVehicle = async (req: Request, res: Response) => {
  const { workspaceId, divisionId } = req.params;
  const vehicle = await vehicleService.createVehicle(req.body, workspaceId, divisionId);

  res.status(StatusCodes.CREATED).json({ message: 'Vehicle created successfully', vehicle });
};

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

export const getSingleVehicle = async (req: Request, res: Response) => {
  const { workspaceId, divisionId, vehicleId } = req.params;

  const vehicle = await vehicleService.getSingleVehicle(vehicleId, workspaceId, divisionId);

  res.status(StatusCodes.OK).json({ vehicle });
};

export const updateVehicle = async (req: Request, res: Response) => {
  const { workspaceId, divisionId, vehicleId } = req.params;

  const vehicle = await vehicleService.updateVehicle(vehicleId, req.body, workspaceId, divisionId);

  res.status(StatusCodes.OK).json({ message: 'Vehicle updated successfully', vehicle });
};

export const deleteVehicle = async (req: Request, res: Response) => {
  const { workspaceId, divisionId, vehicleId } = req.params;

  const vehicle = await vehicleService.deleteVehicle(vehicleId, workspaceId, divisionId);

  res.status(StatusCodes.OK).json({ message: 'Vehicle deleted successfully', vehicle });
};

/**
 * ----------------- Vehicle Transaction Controllers -----------------
 */

export const recordVehicleTransaction = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { workspaceId, divisionId, vehicleId } = req.params;

  const { vehicle, transaction } = await vehicleService.recordVehicleTransaction(
    userId,
    workspaceId,
    divisionId,
    vehicleId,
    req.body
  );

  res.status(StatusCodes.OK).json({ vehicle, transaction });
};

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

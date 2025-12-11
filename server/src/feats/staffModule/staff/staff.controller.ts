/**
 * @module StaffController
 *
 * @description Controller for managing staff (memberships) within a store.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { staffService } from './index.js';

/**
 * ----------------- Staff CRUD Controllers -----------------
 */

export const getAllStaff = async (req: Request, res: Response) => {
  const { storeId } = req.params;
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { staffDocs, total } = await staffService.getAllStaffs(storeId, page, limit);

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Staff members fetched successfully`,
    meta: { page, limit, total },
    data: staffDocs,
  });
};

export const getSingleStaff = async (req: Request, res: Response) => {
  const { storeId, staffId } = req.params;

  const staff = await staffService.getSingleStaff(storeId, staffId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Staff member fetched successfully',
    data: staff,
  });
};

export const updateStaff = async (req: Request, res: Response) => {
  const { storeId, staffId } = req.params;
  const { storeRoles, status } = req.body;

  const updatedStaff = await staffService.updateStaff(storeId, staffId, storeRoles, status);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Staff member updated successfully',
    data: updatedStaff,
  });
};

export const deleteStaff = async (req: Request, res: Response) => {
  const { storeId, staffId } = req.params;

  const deletedStaff = await staffService.deleteStaff(storeId, staffId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Staff member removed successfully',
    data: deletedStaff,
  });
};

/**
 * ----------------- Default Exports (staffController) -----------------
 */

export default {
  getAllStaff,
  getSingleStaff,
  updateStaff,
  deleteStaff,
};

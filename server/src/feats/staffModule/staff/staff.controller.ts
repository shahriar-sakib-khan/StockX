/**
 * @module StaffController
 *
 * @description Controller for managing staff members within divisions.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { staffService } from './index.js';

/**
 * ----------------- Staff CRUD Controllers -----------------
 */

export const createStaff = async (req: Request, res: Response) => {
  const { workspaceId, divisionId } = req.params;

  const staff = await staffService.createStaff(req.body, workspaceId, divisionId);

  res.status(StatusCodes.CREATED).json({ message: 'Staff member created successfully', staff });
};

export const getAllStaff = async (req: Request, res: Response) => {
  const { workspaceId, divisionId } = req.params;
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { staff, total } = await staffService.getAllStaffs(workspaceId, divisionId, page, limit);

  res.status(StatusCodes.OK).json({ total, page, limit, staff });
};

export const getSingleStaff = async (req: Request, res: Response) => {
  const { workspaceId, divisionId, staffId } = req.params;

  const staff = await staffService.getSingleStaff(workspaceId, divisionId, staffId);

  res.status(StatusCodes.OK).json({ staff });
};

export const updateStaff = async (req: Request, res: Response) => {
  const { workspaceId, divisionId, staffId } = req.params;

  const updatedStaff = await staffService.updateStaff(req.body, workspaceId, divisionId, staffId);

  res.status(StatusCodes.OK).json({ message: 'Staff member updated successfully', updatedStaff });
};

export const deleteStaff = async (req: Request, res: Response) => {
  const { workspaceId, divisionId, staffId } = req.params;

  const deletedStaff = await staffService.deleteStaff(workspaceId, divisionId, staffId);

  res.status(StatusCodes.OK).json({ message: 'Staff member deleted successfully', deletedStaff });
};

/**
 * ----------------- Default Exports (staffController) -----------------
 */

export default {
  createStaff, // Create a new staff member
  getAllStaff, // Get all staff members in a division
  getSingleStaff, // Get details of a single staff member
  updateStaff, // Update staff member details
  deleteStaff, // Delete a staff member
};

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { staffService } from './index.js';

import { assertAuth, withTransaction } from '@/common/index.js';

export const login = async (req: Request, res: Response) => {
  const { token, staff } = await staffService.loginStaff(req.body);
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Staff login successful',
    data: { token, staff },
  });
};

export const createStaff = async (req: Request, res: Response) => {
  assertAuth(req);
  const { storeId } = req.params;

  const staff = await withTransaction(async session => {
    // Pass req.user as the 'actor'
    return await staffService.createStaff(storeId, req.user, req.body, session);
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Staff account created successfully',
    data: { staff },
  });
};

export const getAllStaffs = async (req: Request, res: Response) => {
  assertAuth(req);
  const { storeId } = req.params;
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { staffs, total } = await staffService.getAllStaffs(storeId, page, limit);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Staff list fetched successfully',
    meta: { page, limit, total },
    data: { staffs },
  });
};

export const updateStaff = async (req: Request, res: Response) => {
  assertAuth(req);
  const { storeId, staffId } = req.params;

  const staff = await withTransaction(async session => {
    return await staffService.updateStaff(storeId, staffId, req.user, req.body, session);
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Staff profile updated successfully',
    data: { staff },
  });
};

export const deleteStaff = async (req: Request, res: Response) => {
  assertAuth(req);
  const { storeId, staffId } = req.params;

  const staff = await withTransaction(async session => {
    return await staffService.deleteStaff(storeId, staffId, req.user, session);
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Staff account deleted successfully',
    data: { staff },
  });
};

export default { login, createStaff, getAllStaffs, updateStaff, deleteStaff };

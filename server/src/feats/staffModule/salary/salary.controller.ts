import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { salaryService } from './index.js';

import { assertAuth, withTransaction } from '@/common/index.js';

/**
 * ----------------- Read Operations -----------------
 */
export const getPayrollList = async (req: Request, res: Response) => {
  assertAuth(req);
  const { storeId } = req.params;
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { salaries, total } = await salaryService.getPayrollList(storeId, page, limit);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Payroll list fetched successfully',
    meta: { page, limit, total },
    data: { salaries },
  });
};

export const getStaffSalary = async (req: Request, res: Response) => {
  const { storeId, staffId } = req.params;

  const salary = await salaryService.getStaffSalary(storeId, staffId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Staff salary details fetched successfully',
    data: { salary },
  });
};

/**
 * ----------------- Write Operations -----------------
 */
export const setSalary = async (req: Request, res: Response) => {
  assertAuth(req);
  const { storeId, staffId } = req.params;

  const salary = await withTransaction(async session => {
    return await salaryService.setSalary(storeId, staffId, req.user, req.body, session);
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Staff salary set successfully',
    data: { salary },
  });
};

export const removeSalary = async (req: Request, res: Response) => {
  assertAuth(req);
  const { storeId, staffId } = req.params;

  const salary = await withTransaction(async session => {
    return await salaryService.removeSalary(storeId, staffId, req.user, session);
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Staff salary removed successfully',
    data: { salary },
  });
};

export default {
  getPayrollList,
  getStaffSalary,
  setSalary,
  removeSalary,
};

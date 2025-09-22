/**
 * @module salaryController
 *
 * @description Controller for managing division member salaries within cycles.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { assertCycle } from '@/common/assertions.js';

import { salaryService } from '../salary/index.js';

/**
 * ----------------- Salary CRUD Controllers -----------------
 */

export const createSalary = async (req: Request, res: Response) => {
  assertCycle(req);
  const { cycleId } = req.cycle;
  const { workspaceId, divisionId, memberId } = req.params;

  const salary = await salaryService.createSalary(
    req.body,
    workspaceId,
    divisionId,
    memberId,
    cycleId
  );

  res.status(StatusCodes.CREATED).json({
    message: 'Division member salary created successfully',
    salary,
  });
};

export const getAllSalaries = async (req: Request, res: Response) => {
  const { workspaceId, divisionId } = req.params;
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { salaries, total } = await salaryService.getAllSalaries(
    workspaceId,
    divisionId,
    page,
    limit
  );

  res.status(StatusCodes.OK).json({ total, page, limit, salaries });
};

export const getAllSalariesPerMember = async (req: Request, res: Response) => {
  const { workspaceId, divisionId, memberId } = req.params;
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { salaries, total } = await salaryService.getAllSalariesPerMember(
    workspaceId,
    divisionId,
    memberId,
    page,
    limit
  );

  res.status(StatusCodes.OK).json({ total, page, limit, salaries });
};

export const getSingleSalary = async (req: Request, res: Response) => {
  const { workspaceId, divisionId, salaryId } = req.params;

  const salary = await salaryService.getSingleSalary(workspaceId, divisionId, salaryId);

  res.status(StatusCodes.OK).json({ salary });
};

export const updateSalary = async (req: Request, res: Response) => {
  const { workspaceId, divisionId, salaryId } = req.params;

  const updatedSalary = await salaryService.updateSalary(
    req.body,
    workspaceId,
    divisionId,
    salaryId
  );

  res.status(StatusCodes.OK).json({
    message: 'Division member salary updated successfully',
    updatedSalary,
  });
};

export const deleteSalary = async (req: Request, res: Response) => {
  const { workspaceId, divisionId, salaryId } = req.params;

  const deletedSalary = await salaryService.deleteSalary(workspaceId, divisionId, salaryId);

  res.status(StatusCodes.OK).json({
    message: 'Division member salary deleted successfully',
    deletedSalary,
  });
};

/**
 * ----------------- Salary Payment Controller -----------------
 */

// export const paySalary = async (req: Request, res: Response) => {
//   const { workspaceId, divisionId, salaryId } = req.params;

//   const payment = await salaryService.paySalary(req.body, workspaceId, divisionId, salaryId);

//   res.status(StatusCodes.OK).json({
//     message: 'Salary payment recorded successfully',
//     payment,
//   });
// };

/**
 * ----------------- Default Export -----------------
 */

export default {
  createSalary, // Create a new division member salary
  getAllSalaries, // Get all division member salaries
  getAllSalariesPerMember, // Get all division member salaries per member
  getSingleSalary, // Get details of a single division member salary
  updateSalary, // Update a division member salary
  deleteSalary, // Delete a division member salary
  // paySalary, // Record a payment for a division member salary
};

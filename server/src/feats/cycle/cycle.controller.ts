/**
 * @module CycleController
 *
 * @description Controller for managing salary cycles within divisions.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { cycleService } from '../cycle/index.js';

/**
 * ----------------- Cycle CRUD Controllers -----------------
 */

export const createCycle = async (req: Request, res: Response) => {
  const { workspaceId, divisionId } = req.params;

  const cycle = await cycleService.createCycle(req.body, workspaceId, divisionId);

  res.status(StatusCodes.CREATED).json({ message: 'Cycle created successfully', cycle });
};

export const getAllCycles = async (req: Request, res: Response) => {
  const { workspaceId, divisionId } = req.params;
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { cycles, total } = await cycleService.getAllCycles(workspaceId, divisionId, page, limit);

  res.status(StatusCodes.OK).json({ total, page, limit, cycles });
};

export const getActiveCycle = async (req: Request, res: Response) => {
  const { workspaceId, divisionId } = req.params;

  const cycle = await cycleService.getActiveCycle(workspaceId, divisionId);

  res.status(StatusCodes.OK).json({ cycle });
};

export const closeCycle = async (req: Request, res: Response) => {
  const { workspaceId, divisionId, cycleId } = req.params;

  const closedCycle = await cycleService.closeCycle(workspaceId, divisionId, cycleId);

  res.status(StatusCodes.OK).json({ message: 'Cycle closed successfully', closedCycle });
};

export const reopenCycle = async (req: Request, res: Response) => {
  const { workspaceId, divisionId, cycleId } = req.params;

  const reopenedCycle = await cycleService.reopenCycle(workspaceId, divisionId, cycleId);

  res.status(StatusCodes.OK).json({ message: 'Cycle reopened successfully', reopenedCycle });
};

/**
 * ----------------- Default Export (cycleController) -----------------
 */
export default {
  createCycle, // Start a new salary cycle
  getAllCycles, // List all cycles
  getActiveCycle, // Get currently active cycle
  closeCycle, // Close a cycle
  reopenCycle, // Reopen a closed cycles
};

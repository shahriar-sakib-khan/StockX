import { Request, Response, NextFunction } from 'express';

import { Cycle } from '@/feats/cycle/index.js';
import { Errors } from '@/error/index.js';

/**
 * Middleware to require an active cycle for a division.
 */
export const requireActiveCycle = async (req: Request, res: Response, next: NextFunction) => {
  const { workspaceId, divisionId } = req.params;

  // Fetch active cycle
  const cycle = await Cycle.findOne({
    workspace: workspaceId,
    division: divisionId,
    isClosed: false,
  }).lean();

  if (!cycle) {
    throw new Errors.NotFoundError('No active cycle found for this division.');
  }

  // Attach to request object
  req.cycle = {
    cycleId: String(cycle._id),
    month: cycle.month,
    year: cycle.year,
    isClosed: cycle.isClosed,
  };

  next();
};
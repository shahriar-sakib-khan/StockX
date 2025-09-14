import { Router } from 'express';

import { validateRequest, divisionScope } from '@/middlewares/index.js';
import { cycleController, cycleValidator } from '@/feats/cycle/index.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Cycles
 *   description: Manage monthly salary cycles for a division
 */

/**
 * ----------------- Create a new Cycle -----------------
 * @route   POST /:workspaceId/divisions/:divisionId/cycles
 * @desc    Start a new salary cycle for the division
 * @access  Admin (division)
 */
router.post(
  '/cycle',
  divisionScope(['division_admin']),
  validateRequest(cycleValidator.createCycleSchema),
  cycleController.createCycle
);

/**
 * ----------------- Get Active Cycle -----------------
 * @route   GET /:workspaceId/divisions/:divisionId/cycles/active
 * @desc    Get the currently active salary cycle
 * @access  Authenticated
 */
router.get('/cycle/active', cycleController.getActiveCycle);

/**
 * ----------------- Get All Cycles -----------------
 * @route   GET /:workspaceId/divisions/:divisionId/cycles
 * @desc    List all cycles for the division
 * @access  Authenticated
 */
router.get('/cycle', cycleController.getAllCycles);

/**
 * ----------------- Close Cycle -----------------
 * @route   PATCH /:workspaceId/divisions/:divisionId/cycles/:cycleId/close
 * @desc    Close an existing salary cycle
 * @access  Admin (division)
 */
router.patch(
  '/cycle/:cycleId/close',
  divisionScope(['division_admin']),
  validateRequest(cycleValidator.closeCycleSchema),
  cycleController.closeCycle
);

/**
 * ----------------- Reopen Cycle -----------------
 * @route   PATCH /:workspaceId/divisions/:divisionId/cycles/:cycleId/reopen
 * @desc    Reopen a closed cycle (admin only)
 * @access  Admin
 */
router.patch(
  '/cycle/:cycleId/reopen',
  divisionScope(['division_admin']),
  cycleController.reopenCycle
);

export default router;

import { Router } from 'express';

import { validateRequest, divisionScope } from '@/middlewares/index.js';
import { staffController, staffValidator } from '@/feats/staff/index.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Staff
 *   description: Manage staff members within divisions
 */

/**
 * ----------------- Staff CRUD -----------------
 */

/**
 * @route   POST /:workspaceId/divisions/:divisionId/staff
 * @desc    Add a new staff member to a division
 * @access  Admin (division)
 */
router.post(
  '/staff',
  divisionScope(['division_admin']),
  validateRequest(staffValidator.staffInputSchema),
  staffController.createStaff
);

/**
 * @route   GET /:workspaceId/divisions/:divisionId/staff
 * @desc    Get all staff members in a division
 * @access  Authenticated
 */
router.get('/staff', staffController.getAllStaff);

/**
 * @route   GET /:workspaceId/divisions/:divisionId/staff/:staffId
 * @desc    Get details of a single staff member
 * @access  Authenticated
 */
router.get('/staff/:staffId', staffController.getSingleStaff);

/**
 * @route   PUT /:workspaceId/divisions/:divisionId/staff/:staffId
 * @desc    Update staff member details
 * @access  Admin (division)
 */
router.put(
  '/staff/:staffId',
  divisionScope(['division_admin']),
  validateRequest(staffValidator.updateStaffSchema),
  staffController.updateStaff
);

/**
 * @route   DELETE /:workspaceId/divisions/:divisionId/staff/:staffId
 * @desc    Remove a staff member
 * @access  Admin (division)
 */
router.delete('/staff/:staffId', divisionScope(['division_admin']), staffController.deleteStaff);

export default router;

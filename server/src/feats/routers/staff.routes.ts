import { Router } from 'express';

import { validateRequest, divisionScope } from '@/middlewares';
import { staffController, staffValidator } from '@/feats/staff';

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
  '/',
  divisionScope(['division_admin']),
  validateRequest(staffValidator.staffInputSchema),
  staffController.createStaff
);

/**
 * @route   GET /:workspaceId/divisions/:divisionId/staff
 * @desc    Get all staff members in a division
 * @access  Authenticated
 */
router.get('/', staffController.getAllStaff);

/**
 * @route   GET /:workspaceId/divisions/:divisionId/staff/:staffId
 * @desc    Get details of a single staff member
 * @access  Authenticated
 */
router.get('/:staffId', staffController.getSingleStaff);

/**
 * @route   PUT /:workspaceId/divisions/:divisionId/staff/:staffId
 * @desc    Update staff member details
 * @access  Admin (division)
 */
router.put(
  '/:staffId',
  divisionScope(['division_admin']),
  validateRequest(staffValidator.updateStaffSchema),
  staffController.updateStaff
);

/**
 * @route   DELETE /:workspaceId/divisions/:divisionId/staff/:staffId
 * @desc    Remove a staff member
 * @access  Admin (division)
 */
router.delete('/:staffId', divisionScope(['division_admin']), staffController.deleteStaff);

export default router;

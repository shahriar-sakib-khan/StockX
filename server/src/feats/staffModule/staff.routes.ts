import { Router } from 'express';

import { validateRequest } from '@/middlewares/index.js';
import { staffController, staffValidator } from '@/feats/staffModule/staff/index.js';

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
 * @route   GET /:workspaceId/divisions/:divisionId/staffs
 * @desc    Get all staff members in a division
 * @access  Authenticated
 */
router.get('/staffs', staffController.getAllStaff);

/**
 * @route   GET /:workspaceId/divisions/:divisionId/staffs/:staffId
 * @desc    Get details of a single staff member
 * @access  Authenticated
 */
router.get('/staffs/:staffId', staffController.getSingleStaff);

/**
 * @route   PUT /:workspaceId/divisions/:divisionId/staffs/:staffId
 * @desc    Update staff member details
 * @access  Admin (division)
 */
router.patch('/staffs/:staffId', staffController.updateStaff);

/**
 * @route   DELETE /:workspaceId/divisions/:divisionId/staffs/:staffId
 * @desc    Remove a staff member
 * @access  Admin (division)
 */
router.delete('/staffs/:staffId', staffController.deleteStaff);

export default router;

import { Router } from 'express';

import { staffController, staffValidator, staffMiddleware } from './staff/index.js';

import { validateRequest } from '@/middlewares/index.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 * name: Staff
 * description: Store staff management
 */

// --- Mounted under /stores/:storeId/staffs ---

/**
 * @route   GET /stores/:storeId/staffs
 * @desc    Get all staff members in a store
 */
router.get(
  '/staffs',
  staffMiddleware.staffScope(['owner', 'admin', 'manager']),
  staffController.getAllStaffs
);

/**
 * @route   POST /stores/:storeId/staffs
 * @desc    Create a new staff member
 */
router.post(
  '/staffs',
  staffMiddleware.staffScope(['owner', 'admin', 'manager']),
  validateRequest(staffValidator.createStaffSchema),
  staffController.createStaff
);

/**
 * @route   PATCH /stores/:storeId/staffs/:staffId
 * @desc    Update a staff member
 */
router.patch(
  '/staffs/:staffId',
  staffMiddleware.staffScope(['owner', 'admin', 'manager']),
  validateRequest(staffValidator.updateStaffSchema),
  staffController.updateStaff
);

/**
 * @route   DELETE /stores/:storeId/staffs/:staffId
 * @desc    Delete a staff member
 */
router.delete(
  '/staffs/:staffId',
  staffMiddleware.staffScope(['owner', 'admin']),
  staffController.deleteStaff
);

export default router;

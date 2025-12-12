import { Router } from 'express';

import { salaryController, salaryValidator } from './salary/index.js';
import { staffMiddleware } from './staff/index.js';

import { validateRequest } from '@/middlewares/index.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 * name: Salary
 * description: Staff salary management
 */

// --- Mounted under /stores/:storeId ---

/**
 * @route   GET /stores/:storeId/salaries
 * @desc    Get payroll list
 */
router.get(
  '/salaries',
  staffMiddleware.staffScope(['owner', 'admin', 'manager']),
  salaryController.getPayrollList
);

/**
 * @route   GET /stores/:storeId/salaries/:staffId
 * @desc    Get specific staff salary
 */
router.get(
  '/salaries/:staffId',
  staffMiddleware.staffScope(['owner', 'admin', 'manager']),
  salaryController.getStaffSalary
);

/**
 * @route   PUT /stores/:storeId/salaries/:staffId
 * @desc    Set or update staff salary
 */
router.put(
  '/salaries/:staffId',
  staffMiddleware.staffScope(['owner', 'admin']),
  validateRequest(salaryValidator.setSalarySchema),
  salaryController.setSalary
);

/**
 * @route   DELETE /stores/:storeId/salaries/:staffId
 * @desc    Reset staff salary to 0
 */
router.delete(
  '/salaries/:staffId',
  staffMiddleware.staffScope(['owner']),
  salaryController.removeSalary
);

export default router;

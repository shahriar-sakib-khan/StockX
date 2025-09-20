import { Router } from 'express';

import { validateRequest } from '@/middlewares/index.js';
import { salaryController, salaryValidator } from '@/feats/salary/index.js';
import { requireActiveCycle } from '@/feats/cycle/index.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Division Member Salary
 *   description: Manage salaries of division members within cycles
 */

/**
 * ----------------- Salary CRUD -----------------
 */

/**
 * @route   POST /:workspaceId/divisions/:divisionId/salary/:memberId
 * @desc    Create or initialize salary for a division member for a cycle
 * @access  Admin (division)
 */
router.post(
  '/salary/:memberId',
  requireActiveCycle,
  validateRequest(salaryValidator.createSalarySchema),
  salaryController.createSalary
);

/**
 * @route   GET /:workspaceId/divisions/:divisionId/salary
 * @desc    List all salaries in a division (paginated)
 * @access  Authenticated
 */
router.get('/salary', salaryController.getAllSalaries);

/**
 * @route   GET /:workspaceId/divisions/:divisionId/salary/:memberId
 * @desc    Get all salaries for a division member
 * @access  Authenticated
 */
router.get('/salary/:memberId', salaryController.getAllSalariesPerMember);

/**
 * @route   GET /:workspaceId/divisions/:divisionId/salary/:salaryId
 * @desc    Get details of a single member salary
 * @access  Authenticated
 */
router.get('/salary/:salaryId', salaryController.getSingleSalary);

/**
 * @route   PUT /:workspaceId/divisions/:divisionId/salary/:salaryId
 * @desc    Update salary details (e.g., monthlySalary or paidAmount)
 * @access  Admin (division)
 */
router.put(
  '/salary/:salaryId',
  validateRequest(salaryValidator.updateSalarySchema),
  salaryController.updateSalary
);

/**
 * @route   DELETE /:workspaceId/divisions/:divisionId/salary/:salaryId
 * @desc    Delete a salary record (rare case)
 * @access  Admin (division)
 */
router.delete(
  '/salary/:salaryId',
  salaryController.deleteSalary
);

// /**
//  * @route   POST /:workspaceId/divisions/:divisionId/salary/:salaryId/pay
//  * @desc    Record a payment for a member salary
//  * @access  Admin (division)
//  */
// router.post(
//   '/salary/:salaryId/pay',
// //   validateRequest(salaryValidator.paySalarySchema),
//   salaryController.paySalary
// );

export default router;

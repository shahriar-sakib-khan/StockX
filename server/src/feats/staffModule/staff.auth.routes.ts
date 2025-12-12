import { Router } from 'express';

import { staffController, staffValidator } from './staff/index.js';

import { validateRequest } from '@/middlewares/index.js';

const router = Router();

/**
 * @swagger
 * tags:
 * name: StaffAuth
 * description: Local staff authentication
 */

/**
 * @route   POST /staffs/login
 * @desc    Public route for staff to log in
 */
router.post(
  '/staffs/login',
  validateRequest(staffValidator.staffLoginSchema),
  staffController.login
);

export default router;

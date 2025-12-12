import { Router } from 'express';

import { membershipController } from './membership/index.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 * name: Membership
 * description: Store membership management
 */

/**
 * @route   GET /stores/:storeId/memberships/me
 * @desc    Get my membership profile for the specific store
 * @access  Authenticated (Member)
 */
router.get('/memberships/me', membershipController.myStoreProfile);

export default router;

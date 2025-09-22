import { Router } from 'express';

import { validateRequest } from '@/middlewares/validateRequest.js';

import { inviteController, inviteValidator } from './index.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Store Invite
 *   description: Store invite routes
 */

/**
 * ----------------- Store Invite CRUD -----------------
 */

/**
 * @route   POST /store/:storeId/invites
 * @desc    Send a store invite to a user
 * @access  Admin
 */
router.post(
  '/invites',
  validateRequest(inviteValidator.createInviteSchema),
  inviteController.sendInvite
);

/**
 * @route   GET /store/:storeId/invites
 * @desc    Get all invites sent for a store
 * @access  Admin
 */
router.get('/invites', inviteController.allInvites);

/**
 * @route   GET /store/:storeId/invites/:inviteId
 * @desc    Get a single invite by ID
 * @access  Admin
 */
router.get('/invites/:inviteId', inviteController.singleInvite);

/**
 * @route   DELETE /store/:storeId/invites/:inviteId
 * @desc    Delete a sent invite from a store by ID
 * @access  Admin
 */
router.delete('/invites/:inviteId', inviteController.deleteInvite);

export default router;

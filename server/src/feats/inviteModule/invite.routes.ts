import { Router } from 'express';

import { inviteController, inviteValidator } from './index.js';

import { storeScope } from '@/feats/storeModule/index.js';
import { validateRequest } from '@/middlewares/index.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 * name: Invite
 * description: Store invite management
 */

/**
 * @route   GET /stores/:storeId/invites
 * @desc    Get all invites for a store
 */
router.get('/invites', storeScope(['owner', 'admin', 'manager']), inviteController.allInvites);

/**
 * @route   POST /stores/:storeId/invites
 * @desc    Send a new invite
 */
router.post(
  '/invites',
  storeScope(['owner', 'admin']),
  validateRequest(inviteValidator.createInviteSchema),
  inviteController.sendInvite
);

/**
 * @route   GET /stores/:storeId/invites/:inviteId
 * @desc    Get a single invite
 */
router.get(
  '/invites/:inviteId',
  storeScope(['owner', 'admin', 'manager']),
  inviteController.singleInvite
);

/**
 * @route   DELETE /stores/:storeId/invites/:inviteId
 * @desc    Delete an invite
 */
router.delete('/invites/:inviteId', storeScope(['owner', 'admin']), inviteController.deleteInvite);

export default router;

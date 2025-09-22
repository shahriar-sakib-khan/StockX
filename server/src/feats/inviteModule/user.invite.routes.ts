import { Router } from 'express';

import { requireAuth } from '@/middlewares/index.js';

import { userInviteController } from './index.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Invite
 *   description: User invite management
 */

/**
 * ----------------- User Invite Routes -----------------
 */

/**
 * @route   GET /user/invites
 * @desc    Get the currently authenticated user's invites
 * @access  Private
 */
router.get('/invites', requireAuth, userInviteController.myInvites);

/**
 * @route   PUT /user/invites/:token/accept
 * @desc    Accept a user invite
 * @access  Public (via token)
 */
router.put('/invites/:token/accept', userInviteController.acceptInvite);

/**
 * @route   PUT /user/invites/:token/decline
 * @desc    Decline a user invite
 * @access  Public (via token)
 */
router.put('/invites/:token/decline', userInviteController.declineInvite);

export default router;

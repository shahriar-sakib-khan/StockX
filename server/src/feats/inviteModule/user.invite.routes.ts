import { Router } from 'express';

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
router.get('/invites', userInviteController.myInvites);

/**
 * @route   PATCH /user/invites/:token/accept
 * @desc    Accept a user invite
 * @access  Public (via token)
 */
router.patch('/invites/:token/accept', userInviteController.acceptInvite);

/**
 * @route   PATCH /user/invites/:token/decline
 * @desc    Decline a user invite
 * @access  Public (via token)
 */
router.patch('/invites/:token/decline', userInviteController.declineInvite);

export default router;

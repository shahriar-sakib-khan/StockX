import { Router } from 'express';

import { userInviteController } from './index.js';

const router = Router();

/**
 * @swagger
 * tags:
 * name: UserInvite
 * description: User personal invite management
 */

/**
 * @route   GET /users/invites
 * @desc    Get all invites sent to me
 */
router.get('/invites', userInviteController.myInvites);

/**
 * @route   POST /users/invites/:token/accept
 * @desc    Accept an invite
 */
router.post('/invites/:token/accept', userInviteController.acceptInvite);

/**
 * @route   POST /users/invites/:token/decline
 * @desc    Decline an invite
 */
router.post('/invites/:token/decline', userInviteController.declineInvite);

export default router;

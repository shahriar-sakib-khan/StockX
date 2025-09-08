import { Router } from 'express';

import { userController } from '@/controllers/v1';

/**
 * @swagger
 * tags:
 *   name: Invite
 *   description: Workspace invite routes
 */

const router = Router();

/**
 * ----------------- Invite Routes -----------------
 */

/**
 * @route   GET /user/invites
 * @desc    Get the currently authenticated user's invites
 * @access  Private
 */
router.get('/', userController.myInvites);

/**
 * @route   PUT /user/invites/:token/accept
 * @desc    Accept a workspace invite
 * @access  Public (via token)
 */
router.put('/:token/accept', userController.acceptInvite);

/**
 * @route   PUT /user/invites/:token/decline
 * @desc    Decline a workspace invite
 * @access  Public (via token)
 */
router.put('/:token/decline', userController.declineInvite);

export default router;

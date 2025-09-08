import { Router } from 'express';

import { workspaceScope, validateRequest } from '@/middlewares';
import { workspaceController } from '@/controllers/v1';
import { workspace } from '@/validations';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Workspace Invite
 *   description: Workspace invite routes
 */

/**
 * ----------------- Workspace Invite CRUD -----------------
 */

/**
 * @route   POST /workspace/:workspaceId/invites/send
 * @desc    Send a workspace invite to a user
 * @access  Admin
 */
router.post('/', validateRequest(workspace.inviteSchema), workspaceController.sendInvite);

/**
 * @route   GET /workspace/:workspaceId/invites
 * @desc    Get all invites sent for a workspace
 * @access  Admin
 */
router.get('/', workspaceController.allInvites);

/**
 * @route   GET /workspace/:workspaceId/invites/:inviteId
 * @desc    Get a single invite by ID
 * @access  Admin
 */
router.get('/:inviteId', workspaceController.singleInvite);

/**
 * @route   DELETE /workspace/:workspaceId/invites/:inviteId
 * @desc    Delete a sent invite from a workspace by ID
 * @access  Admin
 */
router.delete('/:inviteId', workspaceController.deleteInvite);

export default router;

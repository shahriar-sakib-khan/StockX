import { Router } from 'express';

import { workspaceScope } from '@/middlewares/index.js';
import { workspaceController } from '@/controllers/v1/index.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Workspace Member
 *   description: Workspace member routes
 */

/**
 * ----------------- Workspace Member CRUD -----------------
 */

/**
 * @route   GET /workspace/:workspaceId/members
 * @desc    Get all members in a workspace
 * @access  Member/Admin
 */
router.get('/', workspaceController.allMembers);

/**
 * @route   GET /workspace/:workspaceId/members/:memberId
 * @desc    Get a single member in a workspace
 * @access  Admin
 */
router.get('/:memberId', workspaceController.getMember);

/**
 * @route   DELETE /workspace/:workspaceId/members/:memberId
 * @desc    Remove a member from the workspace
 * @access  Admin
 */
router.delete('/:memberId', workspaceScope(['admin']), workspaceController.removeMember);

/**
 * ----------------- Role Assignment Routes -----------------
 */

/**
 * @route   POST /workspace/:workspaceId/members/:memberId/roles/:roleId
 * @desc    Assign a role to a user in the workspace
 * @access  Admin
 */
router.post('/:memberId/roles/:roleId', workspaceScope(['admin']), workspaceController.assignRole);

/**
 * @route   DELETE /workspace/:workspaceId/members/:memberId/roles/:roleId
 * @desc    Unassign a role from a user in the workspace
 * @access  Admin
 */
router.delete(
  '/:memberId/roles/:roleId',
  workspaceScope(['admin']),
  workspaceController.unassignRole
);

export default router;

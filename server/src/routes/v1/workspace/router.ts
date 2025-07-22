import { Router } from 'express';

import { authenticateUser, workspaceScope, validateRequest } from '@/middlewares';
import { workspaceController } from '@/controllers/v1';
import { workspace } from '@/validations';

const router = Router();

router.use('/', authenticateUser);

/**
 * General workspace routes
 */
router.post('/', validateRequest(workspace.workspaceSchema), workspaceController.createWorkspace);
router.get('/mine', workspaceController.myWorkspaces);
router.get('/:workspaceId', workspaceScope(['admin']), workspaceController.singleWorkspace);
router.put(
  '/:workspaceId',
  validateRequest(workspace.workspaceSchema),
  workspaceScope(['admin']),
  workspaceController.updateWorkspace
);
router.delete('/:workspaceId', workspaceScope(['admin']), workspaceController.deleteWorkspace);

/**
 * Invites routes
 */
// router.get('/:workspaceId/invites', workspaceScope(['admin']), workspaceController.invites);
// router.post('/:workspaceId/invites/accept', workspaceScope(['admin']), workspaceController.acceptInvite);
// router.post('/:workspaceId/invites/decline', workspaceScope(['admin']), workspaceController.declineInvite);

/**
 * Members routes
 */
router.get('/:workspaceId/members', workspaceController.members);
router.post('/:workspaceId/members', workspaceScope(['admin']), workspaceController.members);

/**
 * Roles routes
 */
router.get('/:workspaceId/roles', workspaceScope(['admin']), workspaceController.roles);
// router.put('/:workspaceId/roles', workspaceScope(['admin']), workspaceController.roles);

export default router;

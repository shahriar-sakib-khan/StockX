import { Router } from 'express';

import { workspaceScope, validateRequest } from '@/middlewares';
import { workspaceController } from '@/controllers/v1';
import { workspace } from '@/validations';
import divisionRouter from './division.router';

const router = Router();

// <============================> General Routes <============================>

router.post('/', validateRequest(workspace.workspaceSchema), workspaceController.createWorkspace);
router.get('/mine', workspaceController.myWorkspaces);

router.get('/:workspaceId', workspaceScope(['admin']), workspaceController.singleWorkspace);
router.put(
  '/:workspaceId',
  validateRequest(workspace.workspaceSchema),
  workspaceScope(['admin']),
  workspaceController.updateWorkspace
);
router.delete(
  '/:workspaceId',
  workspaceScope(['admin']),
  workspaceController.deleteWorkspace
);

// <============================> Invite Routes <============================>

router.post(
  '/:workspaceId/invites/send',
  workspaceScope(['admin']),
  workspaceController.sendInvite
);
router.get('/:workspaceId/invites', workspaceScope(['admin']), workspaceController.allInvites);
router.put('/:workspaceId/invites/:token/accept', workspaceController.acceptInvite);
router.put('/:workspaceId/invites/:token/decline', workspaceController.declineInvite);
router.delete(
  '/:workspaceId/invites/:token',
  workspaceScope(['admin']),
  workspaceController.deleteInvite
);

// <============================> Member Routes <============================>

router.get('/:workspaceId/members', workspaceController.allMembers);

// <============================> Role Routes <============================>

router.get('/:workspaceId/roles', workspaceScope(['admin']), workspaceController.roles);
// router.put('/:workspaceId/roles', workspaceScope(['admin']), workspaceController.roles);

// <============================> Division Routes <============================>

router.use('/:workspaceId/divisions', workspaceScope(), divisionRouter);

export default router;

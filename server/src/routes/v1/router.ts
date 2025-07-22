import { Router } from 'express';

import authRouter from './auth/router';
import userRouter from './user/router.js';
import paymentRouter from './payment/index.js';
import workspaceRouter from './workspace/router';

import { authenticateUser } from '@/middlewares/index.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', authenticateUser, userRouter);
router.use('/workspace', authenticateUser, workspaceRouter);
router.use('/payment', paymentRouter);

export default router;



// /** AUTH ROUTES */
// router.post('/auth/signup', authController.signup);
// router.post('/auth/login', authController.login);
// router.post('/auth/logout', auth, authController.logout);
// router.post('/auth/refresh', authController.refreshToken);

// /** USER ROUTES */
// router.get('/users/me', auth, userController.getProfile);
// router.put('/users/me', auth, userController.updateProfile);

// /** WORKSPACE ROUTES */
// router.get('/workspaces/mine', auth, workspaceController.getMyWorkspaces);
// router.post('/workspaces', auth, workspaceController.createWorkspaceController);
// router.get('/workspaces/:workspaceId', auth, workspaceScope(), workspaceController.getWorkspace);
// router.get('/workspaces/:workspaceId/members', auth, workspaceScope(), workspaceController.getWorkspaceMembers);
// router.post('/workspaces/:workspaceId/members', auth, workspaceScope(['admin']), workspaceController.addWorkspaceMember);
// router.put('/workspaces/:workspaceId/roles', auth, workspaceScope(['admin']), workspaceController.updateWorkspaceRoles);

// /** DIVISION ROUTES */
// router.get('/workspaces/:workspaceId/divisions', auth, workspaceScope(), divisionController.getDivisions);
// router.post('/workspaces/:workspaceId/divisions', auth, workspaceScope(['admin']), divisionController.createDivision);
// router.get('/workspaces/:workspaceId/divisions/:divisionId', auth, divisionScope(), divisionController.getDivision);
// router.get('/workspaces/:workspaceId/divisions/:divisionId/members', auth, divisionScope(), divisionController.getDivisionMembers);
// router.post('/workspaces/:workspaceId/divisions/:divisionId/members', auth, divisionScope(['admin']), divisionController.addDivisionMember);
// router.put('/workspaces/:workspaceId/divisions/:divisionId/roles', auth, divisionScope(['admin']), divisionController.updateDivisionRoles);

// /** INVITE ROUTES */
// router.get('/invites', auth, inviteController.getMyInvites);
// router.post('/invites/send', auth, inviteController.sendInvite);
// router.post('/invites/accept', auth, inviteController.acceptInvite);

// /** EXAMPLES OF OWNERSHIP CHECK */
// // Example: Delete workspace only if creator
// router.delete('/workspaces/:workspaceId', auth, ownershipCheck('workspace'), workspaceController.deleteWorkspace);

// // Example: Delete division only if creator
// router.delete('/workspaces/:workspaceId/divisions/:divisionId', auth, ownershipCheck('division'), divisionController.deleteDivision);

// export default router;

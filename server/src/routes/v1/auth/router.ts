import { Router } from 'express';

import validateRequest from '@/middlewares/validators/validateRequest';
import { auth } from '@/validations';
import { authController } from '@/controllers/v1';
import { authenticateUser } from '@/middlewares';

const router = Router();

router.post('/register', validateRequest(auth.registerSchema), authController.register);
router.post('/login', validateRequest(auth.loginSchema), authController.login);

router.get('/logout', authenticateUser, authController.logout);
router.get('/refresh', authController.refreshAccessToken);

export default router;

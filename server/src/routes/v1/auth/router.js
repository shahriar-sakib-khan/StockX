import { Router } from 'express';

import { authController } from '@/controllers/v1/index.js';
import { validateLoginInput, validateRegistrationInput } from '@/middlewares/index.js';

const router = Router();

router.post('/register', validateRegistrationInput, authController.register);
router.post('/login', validateLoginInput, authController.login);
router.get('/logout', authController.logout);
router.get("/refresh", authController.refreshAccessToken);

export default router;

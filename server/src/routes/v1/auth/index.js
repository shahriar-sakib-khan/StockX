import { Router } from 'express';

import { authController } from '@/controllers/v1/index.js';
import { validateLoginInput, validateRegistrationInput } from '@/middlewares/index.js';

const router = Router();

router.post('/register', validateRegistrationInput, authController.register);
router.post('/login', validateLoginInput, authController.login);
router.get('/logout', authController.logout);

// import { login, logout, register, refreshAccessToken } from "../../controllers/v1/index.js";
// router.get("/refresh", refreshAccessToken); // refresh token endpoint

export default router;

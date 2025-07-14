import { Router } from 'express';

import { login, logout, register } from '../../controllers/v1/index.js';
import {
  validateLoginInput,
  validateRegistrationInput,
} from '../../middleware/index.js';

const router = Router();

router.post('/register', validateRegistrationInput, register);
router.post('/login', validateLoginInput, login);
router.get('/logout', logout);

export default router;

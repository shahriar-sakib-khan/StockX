import { Router } from "express";
const router = Router();

import login from "./loginRouter.js";
import register from "./registerRouter.js";
import logout from "./logoutRouter.js";
import { validateLoginInput, validateRegistrationInput } from "../../middleware/index.js";

router.use("/login", validateLoginInput, login);
router.use("/register", validateRegistrationInput, register);
router.use("/logout", logout);

export default router;


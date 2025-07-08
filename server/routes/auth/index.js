import { Router } from "express";
const router = Router();

import login from "./loginRouter.js";
import register from "./registerRouter.js";
import logout from "./logoutRouter.js";

router.use("/login", login);
router.use("/register", register);
router.use("/logout", logout);

export default router;


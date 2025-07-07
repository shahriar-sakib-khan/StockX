import { Router } from "express";

const router = Router();

import loginRouter from "./loginRouter.js";
import registerRouter from "./registerRouter.js";
import logoutRouter from "./logoutRouter.js";

router.use("/login", loginRouter);
router.use("/register", registerRouter);
router.use("/logout", logoutRouter);

export default router;


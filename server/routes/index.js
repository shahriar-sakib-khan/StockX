import { Router } from "express";
const router = Router();

import authRouter from "./auth/index.js";

router.use("/auth", authRouter);

export default router;

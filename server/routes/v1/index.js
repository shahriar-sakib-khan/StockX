import { Router } from "express";

import authRouter from "./authRouter.js";
import userRouter from "./userRouter.js";
import paymentRouter from "./paymentRoutes.js";

import { authenticateUser } from "../../middleware/index.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", authenticateUser, userRouter);
router.use("/payment", paymentRouter);

export default router;

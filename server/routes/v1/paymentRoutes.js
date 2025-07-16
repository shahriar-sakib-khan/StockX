import { Router } from "express";

import {
  cancelPayment,
  createPaymentSession,
  failedPayment,
  handleIPN,
  successPayment,
} from "../../controllers/v1/index.js";
import { authenticateUser } from "../../middleware/index.js";

const router = Router();

router.post("/create-payment", authenticateUser, createPaymentSession);
router.post("/ipn", handleIPN);

router.post("/success/:tranId", successPayment);
router.post("/fail", failedPayment);
router.post("/cancel", cancelPayment);

export default router;

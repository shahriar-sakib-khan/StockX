import { Router } from "express";
const router = Router();

// controller is added here
import { login } from "../../controllers/authControllers/index.js";

router.post("/", login);

export default router;

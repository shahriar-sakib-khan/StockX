import { Router } from "express";
const router = Router();

// controller is added here
import { register } from "../../controllers/authControllers/index.js";

router.post("/", register);

export default router;

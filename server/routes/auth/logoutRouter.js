import { Router } from "express";
const router = Router()

// controller is added here
import { logout } from "../../controllers/authControllers/index.js";

router.get("/", logout);

export default router;

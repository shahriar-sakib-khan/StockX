import { Router } from "express";

import {
  adminDeleteUser,
  adminUpdateUser,
  getAllUsers,
  getApplicationStats,
  getCurrentUser,
  getSingleUser,
  updateUser,
} from "../../controllers/v1/index.js";

import { validateUpdateUserInput } from "../../middleware/index.js";

const router = Router();

/**
 * Role : user
 */
router.get("/me", getCurrentUser);
router.patch("/me", validateUpdateUserInput, updateUser);

/**
 * Role : moderator
 */
router.get("/admin/stats", getApplicationStats);
router.get("/admin/users", getAllUsers);
router.get("/admin/users/:id", getSingleUser);

/**
 * Role : admin
 */
router.patch("/admin/users/:id", validateUpdateUserInput, adminUpdateUser);
router.delete("/admin/users/:id", adminDeleteUser);

export default router;

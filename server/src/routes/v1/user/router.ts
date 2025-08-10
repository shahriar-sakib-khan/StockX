import { Router } from "express";

import {
  adminDeleteUser,
  adminUpdateUser,
  getAllUsers,
  getApplicationStats,
  getCurrentUser,
  getSingleUser,
  getUserTransactionHistory,
  updateUser,
} from "@/controllers/v1/index.js";

import {
  requireRole ,
  validateUpdateUserInput,
} from "@/middlewares/index.js";

const router = Router();

/**
 * General routes
 * Accessible by all users
 */
router.get("/me", getCurrentUser);
router.patch("/me", validateUpdateUserInput, updateUser);


router.get("/transactions", getUserTransactionHistory);

/**
 * Moderator Routes
 * Accessible by: moderator, admin
 */
router.get(
  "/admin/stats",
  requireRole ("moderator", "admin"),
  getApplicationStats
);
router.get("/admin/users", requireRole ("moderator", "admin"), getAllUsers);
router.get(
  "/admin/users/:id",
  requireRole ("moderator", "admin"),
  getSingleUser
);

/**
 * Admin Exclusive Routes
 * Accessible by: admin only
 */
router.patch(
  "/admin/users/:id",
  requireRole ("admin"),
  validateUpdateUserInput,
  adminUpdateUser
);
router.delete("/admin/users/:id", requireRole ("admin"), adminDeleteUser);
router.get(
  "/admin/:id/transactions",
  requireRole ("admin"),
  getUserTransactionHistory
);

export default router;

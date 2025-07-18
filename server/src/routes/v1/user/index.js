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
  authorizeRoles,
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
  authorizeRoles("moderator", "admin"),
  getApplicationStats
);
router.get("/admin/users", authorizeRoles("moderator", "admin"), getAllUsers);
router.get(
  "/admin/users/:id",
  authorizeRoles("moderator", "admin"),
  getSingleUser
);

/**
 * Admin Exclusive Routes
 * Accessible by: admin only
 */
router.patch(
  "/admin/users/:id",
  authorizeRoles("admin"),
  validateUpdateUserInput,
  adminUpdateUser
);
router.delete("/admin/users/:id", authorizeRoles("admin"), adminDeleteUser);
router.get(
  "/admin/:id/transactions",
  authorizeRoles("admin"),
  getUserTransactionHistory
);

export default router;

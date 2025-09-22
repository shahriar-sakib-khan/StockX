/**
 * ----------------- Exports from User -----------------
 */
export {
  User,
  type IUser,
  UserRoles,
  type UserRoleType,
  userValidator,
  userController,
  userService,
  userSanitizers,
} from './user/index.js';

/**
 * ----------------- Exports from Auth -----------------
 */
export {
  authController,
  requireAuth,
  requireRole,
  authService,
  authValidator,
} from './auth/index.js';

/**
 * ----------------- Router Exports -----------------
 */
export { default as userRouter } from './user.routes.js';
export { default as authRouter } from './auth.routes.js';

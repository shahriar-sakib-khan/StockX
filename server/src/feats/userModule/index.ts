/**
 * ----------------- Exports from User Feature -----------------
 */
export {
  User,
  type IUser,
  userConstants,
  userController,
  userService,
  userValidator,
  userSanitizers,
} from './user/index.js';

/**
 * ----------------- Exports from Auth Feature -----------------
 */
export {
  authController,
  authService,
  authValidator,
  requireAuth,
  requireRole,
} from './auth/index.js';

/**
 * ----------------- Router Exports -----------------
 */
export { default as userRouter } from './user.routes.js';
export { default as authRouter } from './auth.routes.js';

import { body } from "express-validator";

import withValidationErrors from "./withValidationErrors.js";
import { User } from "../../models/index.js";
import { ROLES } from "../../config/roles.config.js";

/**
 * Update-user input validation
 */
export const validateUpdateUserInput = withValidationErrors([
  body("firstName")
    .optional()
    .notEmpty()
    .withMessage({
      type: "BadRequestError",
      message: "First name cannot be empty",
    })
    .matches(/^[A-Za-z\s]+$/)
    .withMessage({
      type: "BadRequestError",
      message: "Name must contain only letters and spaces",
    })
    .trim(),

  body("lastName")
    .optional()
    .matches(/^[A-Za-z\s]+$/)
    .withMessage({
      type: "BadRequestError",
      message: "Last name must contain only letters and spaces",
    })
    .trim(),

  body("username")
    .optional()
    .notEmpty()
    .withMessage({
      type: "BadRequestError",
      message: "Username cannot be empty",
    })
    .isLength({ min: 3, max: 30 })
    .withMessage({
      type: "BadRequestError",
      message: "Username must be between 3 and 30 characters",
    })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage({
      type: "BadRequestError",
      message: "Username can contain only letters, numbers, and underscores",
    })
    .matches(/^(?!_)(?!.*_$).+$/)
    .withMessage({
      type: "BadRequestError",
      message: "Username cannot start or end with an underscore",
    }),

  body("email")
    .optional()
    .notEmpty()
    .withMessage({
      type: "BadRequestError",
      message: "Email cannot be empty",
    })
    .isEmail()
    .withMessage({
      type: "BadRequestError",
      message: "Invalid email format",
    })
    .custom(async (email) => {
      const user = await User.findOne({ email });
      return !user;
    })
    .withMessage({ type: "BadRequestError", message: "Email already exists" }),

  body("location").optional().notEmpty().withMessage({
    type: "BadRequestError",
    message: "Location cannot be empty",
  }),

  body("role")
    .optional()
    .custom((value, { req }) => {
      return req.user && req.user.role === "admin";
    })
    .withMessage({
      type: "UnauthorizedError",
      message: "Only admins can update roles",
    })
    .custom((value) => {
      const allowedRoles = ROLES;
      return allowedRoles.includes(value);
    })
    .withMessage({
      type: "BadRequestError",
      message: "Invalid role input",
    }),
]);

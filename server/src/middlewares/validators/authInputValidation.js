import { body } from "express-validator";

import withValidationErrors from "./withValidationErrors.js";
import { User } from "../../models/index.js";

/**
 * Registration input validation
 */
export const validateRegistrationInput = withValidationErrors([
  body("firstName")
    .notEmpty()
    .withMessage({ type: "BadRequestError", message: "First name is required" })
    .matches(/^[A-Za-z\s]+$/)
    .withMessage({
      type: "BadRequestError",
      message: "First name must contain only letters and spaces",
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
    .notEmpty()
    .withMessage({ type: "BadRequestError", message: "Username is required" })
    .isLength({ min: 3, max: 30 })
    .withMessage({
      type: "BadRequestError",
      message: "Username must be between 3 and 30 characters",
    })
    // Check for allowed chars (letters, numbers, underscores)
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage({
      type: "BadRequestError",
      message: "Username can contain only letters, numbers, and underscores",
    })
    // Check no leading/trailing underscore
    .matches(/^(?!_)(?!.*_$).+$/)
    .withMessage({
      type: "BadRequestError",
      message: "Username cannot start or end with an underscore",
    }),

  body("email")
    .notEmpty()
    .withMessage({ type: "BadRequestError", message: "Email is required" })
    .isEmail()
    .withMessage({ type: "BadRequestError", message: "Invalid email format" })
    .custom(async (email) => {
      const user = await User.findOne({ email });
      return !user;
    })
    .withMessage({ type: "BadRequestError", message: "Email already exists" }),

  body("password")
    .notEmpty()
    .withMessage({ type: "BadRequestError", message: "Password is required" })
    .isLength({ min: 8 })
    .withMessage({
      type: "BadRequestError",
      message: "Password must be at least 8 characters long",
    })
    // .isLength({ max: 100 })
    // .withMessage({
    //   type: "BadRequestError",
    //   message: "Password must be less than 100 characters",
    // })
    // .matches(/[a-z]/)
    // .withMessage({
    //   type: "BadRequestError",
    //   message: "Password must include at least one lowercase letter",
    // })
    // .matches(/[A-Z]/)
    // .withMessage({
    //   type: "BadRequestError",
    //   message: "Password must include at least one uppercase letter",
    // })
    // .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
    // .withMessage({
    //   type: "BadRequestError",
    //   message: "Password must include at least one special character",
    // })
    // .custom((value) => {
    //   const common = ["password", "123456", "qwerty", "letmein"];
    //   if (common.includes(value.toLowerCase())) {
    //     throw new Error("Password is too common");
    //   }
    //   return true;
    // })
    // .withMessage({
    //   type: "BadRequestError",
    //   message: "Password is too common",
    // }),
    .matches(/[0-9]/)
    .withMessage({
      type: "BadRequestError",
      message: "Password must include at least one number",
    }),

  body("address")
    .notEmpty()
    .withMessage({ type: "BadRequestError", message: "Address is required" }),
]);

/**
 * Login input validation
 */
export const validateLoginInput = withValidationErrors([
  body("loginIdentifier")
    .trim()
    .notEmpty()
    .withMessage({
      type: "BadRequestError",
      message: "Username or Email is required",
    })
    .custom((value) => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      const isUsername = /^[a-zA-Z0-9_]{3,30}$/.test(value);
      return isEmail || isUsername;
    })
    .withMessage({
      type: "BadRequestError",
      message: "Invalid username or email format",
    }),

  body("password")
    .notEmpty()
    .withMessage({ type: "BadRequestError", message: "Password is required" }),
]);

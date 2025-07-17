import { body } from "express-validator";
import withValidationErrors from "./withValidationErrors.js";

export const validatePaymentInput = withValidationErrors([
  body("amount")
    .exists()
    .withMessage("Amount is required")
    .customSanitizer((value) => {
      const numeric = Number(value);
      // Strip to 2 decimals max
      return Number.isNaN(numeric) ? 0 : Number(numeric.toFixed(2));
    })
    .isFloat({ min: 0 })
    .withMessage("Amount cannot be negative"),

  body("phone")
    .exists()
    .withMessage("Phone is required")
    .customSanitizer((value) => {
      if (!value) return value;
      // Remove spaces, hyphens
      let cleaned = value.replace(/[\s\-]/g, "");

      if (cleaned.startsWith("+88")) cleaned = cleaned.slice(3);
      else if (cleaned.startsWith("88")) cleaned = cleaned.slice(2);

      return cleaned;
    })
    .custom((cleaned) => {
      // Validate only 11 digit BD phone starting with 01
      return /^01\d{9}$/.test(cleaned);
    })
    .withMessage({
      type: "BadRequestError",
      message: "Phone must be a valid Bangladeshi number (e.g., 01XXXXXXXXX)",
    }),
]);

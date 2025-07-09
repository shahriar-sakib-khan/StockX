import { body, validationResult } from "express-validator";
import User from "../../models/userModel.js";

// <============================> Registration Input Middleware <============================>

export const validateRegistrationInput = async (req, res, next) => {
  try {
    await Promise.all([
      body("name").notEmpty().withMessage("Name is required").run(req),
      body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format")
        .custom(async (email) => {
          const user = await User.findOne({ email });
          if (user) throw new Error("Email already exists");
        })
        .run(req),
      body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .run(req),
      body("location").notEmpty().withMessage("Location is required").run(req),
      body("lastName").notEmpty().withMessage("Last name is required").run(req),
    ]);

    const result = validationResult(req);
    if (!result.isEmpty()) {
      const errors = result.array().map((err) => err.msg);
      return res.status(400).json({ errors });
    }

    next();
  } catch (err) {
    console.error("Validation error:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// <============================> Login Input Middleware <============================>

export const validateLoginInput = async (req, res, next) => {
  try {
    await Promise.all([
      body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format")
        .run(req),
      body("password").notEmpty().withMessage("Password is required").run(req),
    ]);

    const result = validationResult(req);
    if (!result.isEmpty()) {
      const errors = result.array().map((err) => err.msg);
      return res.status(400).json({ errors });
    }

    next();
  } catch (err) {
    console.error("Validation error:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

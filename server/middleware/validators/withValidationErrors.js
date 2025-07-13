import { body, validationResult } from "express-validator";

import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
} from "../../error/customErrors.js";

const errorMap = {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
};

const withValidationErrors = (validator) => {
  return [
    ...validator,
    (req, res, next) => {
      const result = validationResult(req);
      if (result.isEmpty()) return next();

      const rawErrors = result.array();
      const messages = rawErrors.map((e) =>
        typeof e.msg === "string" ? e.msg : e.msg.message
      );

      const firstType = rawErrors[0]?.msg?.type;
      const ErrorClass =
        typeof firstType === "string" && errorMap[firstType]
          ? errorMap[firstType]
          : BadRequestError;

      throw new ErrorClass(messages);
    },
  ];
};

export default withValidationErrors;

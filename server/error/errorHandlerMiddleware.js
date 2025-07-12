import { StatusCodes } from "http-status-codes";

export const errorHandlerMiddleware = (err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) console.error("🔥 Error:", err);

  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  
  const response = {
    success: false,
    message: err.message || "Internal Server Error",
    statusCode,
  };

  if (err.name) response.errorType = err.name;
  if (!isProduction && err.stack) response.stack = err.stack;

  return res.status(statusCode).json(response);
};

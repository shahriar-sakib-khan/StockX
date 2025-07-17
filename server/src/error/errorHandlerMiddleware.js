import { StatusCodes } from "http-status-codes";

const errorHandler = (err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) console.error("🔥 Error:", err);

  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  const response = {
    success: false,
    message: err.message || "Something went wrong, try again later...",
    statusCode,
  };

  if (err.name) response.errorType = err.name;
  if (!isProduction && err.stack) response.stack = err.stack;
  console.log(err);

  return res.status(statusCode).json(response);
};

export default errorHandler;

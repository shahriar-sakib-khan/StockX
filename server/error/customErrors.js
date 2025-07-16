import { StatusCodes } from "http-status-codes";

export class BaseError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    Error.captureStackTrace(this, this.constructor);
  }
}

// If routes don't exist
export class NotFoundError extends BaseError {
  constructor(message) {
    super(message, StatusCodes.NOT_FOUND);
  }
}

// If something broke inside a valid route
export class BadRequestError extends BaseError {
  constructor(message) {
    super(message, StatusCodes.BAD_REQUEST);
  }
}

export class UnauthenticatedError extends BaseError {
  constructor(message) {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message) {
    super(message, StatusCodes.FORBIDDEN);
  }
}

export class ServerError extends BaseError {
  constructor(message) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

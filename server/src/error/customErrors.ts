import { StatusCodes } from 'http-status-codes';

interface CustomErrorPayload {
  errors?: Array<{ field?: string; message: string }>;
  code?: string;
}

export class BaseError extends Error {
  public statusCode: number;
  public errors?: Array<{ field?: string; message: string }>;
  public code?: string;

  constructor(message: string, statusCode: number, payload: CustomErrorPayload = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errors = payload.errors;
    this.code = payload.code;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 404 - If routes or resources don't exist
export class NotFoundError extends BaseError {
  constructor(message = 'Not Found') {
    super(message, StatusCodes.NOT_FOUND);
  }
}

// 400 - If validation fails or bad input
export class BadRequestError extends BaseError {
  constructor(message = 'Bad Request', payload?: CustomErrorPayload) {
    super(message, StatusCodes.BAD_REQUEST, payload);
  }
}

// 401 - Identity Missing (Not Logged In)
export class UnauthenticatedError extends BaseError {
  constructor(message = 'Authentication required') {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

// 403 - Permission Missing (Logged In but Access Denied)
export class ForbiddenError extends BaseError {
  constructor(message = 'Access denied') {
    super(message, StatusCodes.FORBIDDEN);
  }
}

// 409 - Data Conflict (e.g. Duplicate Email)
export class ConflictError extends BaseError {
  constructor(message = 'Conflict') {
    super(message, StatusCodes.CONFLICT);
  }
}

// 500 - System Crashes
export class ServerError extends BaseError {
  constructor(message = 'Internal Server Error') {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export default {
  BaseError,
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
  ForbiddenError,
  ConflictError,
  ServerError,
};

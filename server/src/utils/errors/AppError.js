/**
 * Custom Application Error Class
 * Base class for all application errors
 */
class AppError extends Error {
  constructor(message, statusCode, errorCode = null, isOperational = true) {
    super(message);

    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    // Capture stack trace, excluding constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 - Bad Request Error
 */
class BadRequestError extends AppError {
  constructor(message = 'Bad Request', errorCode = 'BAD_REQUEST') {
    super(message, 400, errorCode);
  }
}

/**
 * 401 - Unauthorized Error
 */
class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', errorCode = 'UNAUTHORIZED') {
    super(message, 401, errorCode);
  }
}

/**
 * 403 - Forbidden Error
 */
class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', errorCode = 'FORBIDDEN') {
    super(message, 403, errorCode);
  }
}

/**
 * 404 - Not Found Error
 */
class NotFoundError extends AppError {
  constructor(message = 'Resource not found', errorCode = 'NOT_FOUND') {
    super(message, 404, errorCode);
  }
}

/**
 * 409 - Conflict Error
 */
class ConflictError extends AppError {
  constructor(message = 'Conflict', errorCode = 'CONFLICT') {
    super(message, 409, errorCode);
  }
}

/**
 * 422 - Unprocessable Entity Error
 */
class ValidationError extends AppError {
  constructor(message = 'Validation failed', errors = [], errorCode = 'VALIDATION_ERROR') {
    super(message, 422, errorCode);
    this.errors = errors;
  }
}

/**
 * 500 - Internal Server Error
 */
class InternalServerError extends AppError {
  constructor(message = 'Internal Server Error', errorCode = 'INTERNAL_ERROR') {
    super(message, 500, errorCode, false);
  }
}

/**
 * Database Error
 */
class DatabaseError extends AppError {
  constructor(message = 'Database error', errorCode = 'DATABASE_ERROR') {
    super(message, 500, errorCode, false);
  }
}

/**
 * External API Error
 */
class ExternalAPIError extends AppError {
  constructor(message = 'External API error', statusCode = 502, errorCode = 'EXTERNAL_API_ERROR') {
    super(message, statusCode, errorCode);
  }
}

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  InternalServerError,
  DatabaseError,
  ExternalAPIError,
};

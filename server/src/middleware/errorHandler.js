const { AppError } = require('../utils/errors/AppError');

/**
 * Error Handler Middleware
 * Centralized error handling for the entire application
 */

/**
 * Handles operational errors (trusted errors)
 */
const handleOperationalError = (err, res) => {
  return res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    errorCode: err.errorCode,
    ...(err.errors && { errors: err.errors }), // For validation errors
  });
};

/**
 * Handles programming or unknown errors
 */
const handleProgrammingError = (err, res) => {
  console.error('💥 PROGRAMMING ERROR:', err);

  return res.status(500).json({
    success: false,
    status: 'error',
    message: 'Something went wrong!',
    errorCode: 'INTERNAL_ERROR',
  });
};

/**
 * Handles specific database errors
 */
const handleDatabaseError = (err) => {
  // PostgreSQL unique constraint violation
  if (err.code === '23505') {
    const field = err.detail?.match(/\(([^)]+)\)/)?.[1] || 'field';
    return new AppError(`${field} already exists`, 409, 'DUPLICATE_ENTRY');
  }

  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    return new AppError('Referenced resource does not exist', 400, 'FOREIGN_KEY_VIOLATION');
  }

  // PostgreSQL not null violation
  if (err.code === '23502') {
    const field = err.column || 'field';
    return new AppError(`${field} is required`, 400, 'NULL_VIOLATION');
  }

  // PostgreSQL check constraint violation
  if (err.code === '23514') {
    return new AppError('Invalid value provided', 400, 'CHECK_VIOLATION');
  }

  // Generic database error
  return new AppError('Database error occurred', 500, 'DATABASE_ERROR');
};

/**
 * Handles JWT errors
 */
const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again.', 401, 'INVALID_TOKEN');
};

const handleJWTExpiredError = () => {
  return new AppError('Your token has expired. Please log in again.', 401, 'TOKEN_EXPIRED');
};

/**
 * Development error response (includes stack trace)
 */
const sendErrorDev = (err, res) => {
  return res.status(err.statusCode || 500).json({
    success: false,
    status: err.status || 'error',
    message: err.message,
    errorCode: err.errorCode,
    error: err,
    stack: err.stack,
    ...(err.errors && { errors: err.errors }),
  });
};

/**
 * Production error response (sanitized)
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return handleOperationalError(err, res);
  }

  // Programming or unknown error: don't leak error details
  return handleProgrammingError(err, res);
};

/**
 * Main Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  error.isOperational = err.isOperational !== undefined ? err.isOperational : false;

  // Log error for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('🔥 ERROR:', {
      message: err.message,
      statusCode: err.statusCode,
      errorCode: err.errorCode,
      stack: err.stack,
    });
  }

  // Handle specific error types
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
  if (err.code && err.code.startsWith('23')) error = handleDatabaseError(err);

  // Handle validation errors from express-validator
  if (err.statusCode === 422 && err.errors) {
    error.isOperational = true;
  }

  // Send appropriate error response
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

/**
 * Catch async errors wrapper
 * Wraps async route handlers to catch errors and pass to error handler
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Handle 404 errors
 */
const notFound = (req, res, next) => {
  const error = new AppError(
    `Route ${req.originalUrl} not found`,
    404,
    'ROUTE_NOT_FOUND'
  );
  next(error);
};

module.exports = {
  errorHandler,
  catchAsync,
  notFound,
};

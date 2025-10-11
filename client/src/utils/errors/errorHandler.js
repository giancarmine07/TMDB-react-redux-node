/**
 * Frontend Error Handler Utilities
 * Centralized error handling for the React application
 */

import { ERROR_MESSAGES, HTTP_STATUS } from '../../constants';

/**
 * Custom Error Classes
 */
export class AppError extends Error {
  constructor(message, statusCode, errorCode) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
  }
}

export class NetworkError extends AppError {
  constructor(message = ERROR_MESSAGES.NETWORK_ERROR) {
    super(message, 0, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = ERROR_MESSAGES.UNAUTHORIZED) {
    super(message, HTTP_STATUS.UNAUTHORIZED, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ValidationError extends AppError {
  constructor(message = ERROR_MESSAGES.VALIDATION_ERROR, errors = []) {
    super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

/**
 * Parse error from API response
 * @param {Error} error - Error object from axios or fetch
 * @returns {Object} - Parsed error object
 */
export const parseError = (error) => {
  // Network error (no response from server)
  if (!error.response) {
    return {
      message: error.message || ERROR_MESSAGES.NETWORK_ERROR,
      statusCode: 0,
      errorCode: 'NETWORK_ERROR',
      isNetworkError: true,
    };
  }

  // HTTP error response
  const { status, data } = error.response;

  return {
    message: data?.message || getDefaultErrorMessage(status),
    statusCode: status,
    errorCode: data?.errorCode || `HTTP_${status}`,
    errors: data?.errors || [],
    isNetworkError: false,
  };
};

/**
 * Get default error message based on HTTP status code
 * @param {number} statusCode - HTTP status code
 * @returns {string} - Error message
 */
export const getDefaultErrorMessage = (statusCode) => {
  switch (statusCode) {
    case HTTP_STATUS.BAD_REQUEST:
      return ERROR_MESSAGES.VALIDATION_ERROR;
    case HTTP_STATUS.UNAUTHORIZED:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case HTTP_STATUS.FORBIDDEN:
      return ERROR_MESSAGES.FORBIDDEN;
    case HTTP_STATUS.NOT_FOUND:
      return ERROR_MESSAGES.NOT_FOUND;
    case HTTP_STATUS.CONFLICT:
      return 'A conflict occurred. Please try again.';
    case HTTP_STATUS.UNPROCESSABLE_ENTITY:
      return ERROR_MESSAGES.VALIDATION_ERROR;
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      return ERROR_MESSAGES.SERVER_ERROR;
    default:
      if (statusCode >= 500) {
        return ERROR_MESSAGES.SERVER_ERROR;
      }
      return ERROR_MESSAGES.GENERIC;
  }
};

/**
 * Handle API error and return user-friendly message
 * @param {Error} error - Error object
 * @returns {string} - User-friendly error message
 */
export const handleApiError = (error) => {
  const parsedError = parseError(error);

  // Log error in development
  if (import.meta.env.DEV) {
    console.error('API Error:', {
      message: parsedError.message,
      statusCode: parsedError.statusCode,
      errorCode: parsedError.errorCode,
      errors: parsedError.errors,
    });
  }

  return parsedError.message;
};

/**
 * Check if error is authentication error
 * @param {Error} error - Error object
 * @returns {boolean}
 */
export const isAuthError = (error) => {
  const parsedError = parseError(error);
  return parsedError.statusCode === HTTP_STATUS.UNAUTHORIZED;
};

/**
 * Check if error is network error
 * @param {Error} error - Error object
 * @returns {boolean}
 */
export const isNetworkError = (error) => {
  return !error.response || error.code === 'ECONNABORTED' || error.message === 'Network Error';
};

/**
 * Check if error is validation error
 * @param {Error} error - Error object
 * @returns {boolean}
 */
export const isValidationError = (error) => {
  const parsedError = parseError(error);
  return parsedError.statusCode === HTTP_STATUS.UNPROCESSABLE_ENTITY;
};

/**
 * Format validation errors for display
 * @param {Array} errors - Array of validation errors
 * @returns {Object} - Formatted errors object
 */
export const formatValidationErrors = (errors) => {
  if (!Array.isArray(errors)) return {};

  return errors.reduce((acc, error) => {
    const field = error.field || error.param || 'general';
    acc[field] = error.message || error.msg;
    return acc;
  }, {});
};

/**
 * Create error object for Redux state
 * @param {Error} error - Error object
 * @returns {Object} - Redux error state
 */
export const createErrorState = (error) => {
  const parsedError = parseError(error);

  return {
    message: parsedError.message,
    statusCode: parsedError.statusCode,
    errorCode: parsedError.errorCode,
    errors: parsedError.errors,
    isNetworkError: parsedError.isNetworkError,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Clear error state for Redux
 * @returns {null}
 */
export const clearErrorState = () => null;

/**
 * Log error for debugging
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred
 */
export const logError = (error, context = 'Unknown') => {
  if (import.meta.env.DEV) {
    console.group(`🔴 Error in ${context}`);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    if (error.response) {
      console.error('Response:', error.response);
    }
    console.groupEnd();
  }
};

/**
 * Retry helper for failed API calls
 * @param {Function} fn - Async function to retry
 * @param {number} retries - Number of retries
 * @param {number} delay - Delay between retries in ms
 * @returns {Promise}
 */
export const retryAsync = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0 || !isNetworkError(error)) {
      throw error;
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryAsync(fn, retries - 1, delay * 2); // Exponential backoff
  }
};

/**
 * Safe async handler for components
 * Wraps async functions and handles errors gracefully
 * @param {Function} fn - Async function
 * @param {Function} onError - Error handler callback
 * @returns {Function}
 */
export const safeAsync = (fn, onError) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      const errorMessage = handleApiError(error);
      if (onError) {
        onError(errorMessage, error);
      }
      logError(error, 'SafeAsync');
    }
  };
};

/**
 * Extract error message from various error formats
 * @param {any} error - Error in any format
 * @returns {string} - Error message
 */
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.response?.data?.message) return error.response.data.message;
  return ERROR_MESSAGES.GENERIC;
};

export default {
  parseError,
  handleApiError,
  isAuthError,
  isNetworkError,
  isValidationError,
  formatValidationErrors,
  createErrorState,
  clearErrorState,
  logError,
  retryAsync,
  safeAsync,
  getErrorMessage,
};

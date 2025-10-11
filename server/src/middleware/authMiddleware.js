const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors/AppError');
const config = require('../config/config');

/**
 * Verify JWT Token Middleware
 * Protects routes that require authentication
 */
const verifyToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided. Please log in.', 'NO_TOKEN');
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError('Invalid token format', 'INVALID_TOKEN_FORMAT');
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Attach user info to request
    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new UnauthorizedError('Invalid token. Please log in again.', 'INVALID_TOKEN'));
    }

    if (error.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Your token has expired. Please log in again.', 'TOKEN_EXPIRED'));
    }

    next(error);
  }
};

/**
 * Optional Authentication Middleware
 * Allows access without token but attaches user if token is valid
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without user
      return next();
    }

    const token = authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, config.jwt.secret);
      req.user = {
        id: decoded.id,
        username: decoded.username,
        email: decoded.email,
      };
    }

    next();
  } catch (error) {
    // If token is invalid, continue without user (don't throw error)
    next();
  }
};

/**
 * Generate JWT Token
 */
const generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

/**
 * Verify if user owns resource
 * Used for operations like updating/deleting own reviews
 */
const verifyOwnership = (resourceUserId) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required', 'AUTH_REQUIRED'));
    }

    if (req.user.id !== resourceUserId) {
      return next(new UnauthorizedError('You do not have permission to perform this action', 'FORBIDDEN'));
    }

    next();
  };
};

module.exports = {
  verifyToken,
  optionalAuth,
  generateToken,
  verifyOwnership,
};

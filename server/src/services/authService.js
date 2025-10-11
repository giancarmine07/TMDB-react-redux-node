/**
 * Auth Service
 * Business logic for authentication operations
 */

const bcrypt = require('bcrypt');
const { ValidationError } = require('../utils/errors/AppError');

const SALT_ROUNDS = 10;

/**
 * Hash password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
const hashPassword = async (password) => {
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return hash;
  } catch (error) {
    throw new Error(`Failed to hash password: ${error.message}`);
  }
};

/**
 * Compare password with hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} - True if password matches
 */
const comparePassword = async (password, hash) => {
  try {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  } catch (error) {
    throw new Error(`Failed to compare password: ${error.message}`);
  }
};

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {Object} - Validation result
 */
const validateUsername = (username) => {
  const errors = [];

  if (!username || username.trim() === '') {
    errors.push('Username is required');
  }

  if (username && username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }

  if (username && username.length > 50) {
    errors.push('Username must not exceed 50 characters');
  }

  if (username && !/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, and underscores');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate email
 * @param {string} email - Email to validate
 * @returns {Object} - Validation result
 */
const validateEmail = (email) => {
  const errors = [];

  if (!email || email.trim() === '') {
    errors.push('Email is required');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    errors.push('Invalid email format');
  }

  if (email && email.length > 100) {
    errors.push('Email must not exceed 100 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result
 */
const validatePassword = (password) => {
  const errors = [];

  if (!password || password.trim() === '') {
    errors.push('Password is required');
  }

  if (password && password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (password && password.length > 100) {
    errors.push('Password must not exceed 100 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate user registration data
 * @param {string} username - Username
 * @param {string} email - Email
 * @param {string} password - Password
 * @throws {ValidationError} - If validation fails
 */
const validateUserData = (username, email, password) => {
  const allErrors = [];

  const usernameValidation = validateUsername(username);
  if (!usernameValidation.isValid) {
    allErrors.push(...usernameValidation.errors);
  }

  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    allErrors.push(...emailValidation.errors);
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    allErrors.push(...passwordValidation.errors);
  }

  if (allErrors.length > 0) {
    throw new ValidationError('Validation failed', allErrors);
  }

  return true;
};

/**
 * Validate login data
 * @param {string} email - Email
 * @param {string} password - Password
 * @throws {ValidationError} - If validation fails
 */
const validateLoginData = (email, password) => {
  const allErrors = [];

  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    allErrors.push(...emailValidation.errors);
  }

  if (!password || password.trim() === '') {
    allErrors.push('Password is required');
  }

  if (allErrors.length > 0) {
    throw new ValidationError('Validation failed', allErrors);
  }

  return true;
};

module.exports = {
  hashPassword,
  comparePassword,
  validateUsername,
  validateEmail,
  validatePassword,
  validateUserData,
  validateLoginData,
};

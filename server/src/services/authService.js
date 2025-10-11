/**
 * Servizio Autenticazione
 * Logica di business per le operazioni di autenticazione
 */

const bcrypt = require('bcrypt');
const { ValidationError } = require('../utils/errors/AppError');

const SALT_ROUNDS = 10;

/**
 * Hash della password usando bcrypt
 * @param {string} password - Password in chiaro
 * @returns {Promise<string>} - Password hashata
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
 * Confronta la password con l'hash
 * @param {string} password - Password in chiaro
 * @param {string} hash - Password hashata
 * @returns {Promise<boolean>} - True se la password corrisponde
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
 * Valida il nome utente
 * @param {string} username - Nome utente da validare
 * @returns {Object} - Risultato della validazione
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
 * Valida l'email
 * @param {string} email - Email da validare
 * @returns {Object} - Risultato della validazione
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
 * Valida la password
 * @param {string} password - Password da validare
 * @returns {Object} - Risultato della validazione
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
 * Valida i dati di registrazione dell'utente
 * @param {string} username - Nome utente
 * @param {string} email - Email
 * @param {string} password - Password
 * @throws {ValidationError} - Se la validazione fallisce
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
 * Valida i dati di login
 * @param {string} email - Email
 * @param {string} password - Password
 * @throws {ValidationError} - Se la validazione fallisce
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

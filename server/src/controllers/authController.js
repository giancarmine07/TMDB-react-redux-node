/**
 * Controller Autenticazione
 * Gestisce le richieste di autenticazione (registrazione, login, ottenere utente corrente)
 */

const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const authService = require('../services/authService');
const { generateToken } = require('../middleware/authMiddleware');
const { catchAsync } = require('../middleware/errorHandler');
const {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
} = require('../utils/errors/AppError');

/**
 * Registra un nuovo utente
 * @route POST /api/auth/register
 * @access Pubblico
 */
const register = catchAsync(async (req, res) => {
  const { username, email, password } = req.body;

  // Valida l'input
  if (!username || !email || !password) {
    throw new BadRequestError('Username, email, and password are required');
  }

  // Valida i dati utente
  authService.validateUserData(username, email, password);

  // Controlla se l'utente esiste già
  const existingEmail = await userModel.findUserByEmail(email);
  if (existingEmail) {
    throw new ConflictError('Email already registered');
  }

  const existingUsername = await userModel.findUserByUsername(username);
  if (existingUsername) {
    throw new ConflictError('Username already taken');
  }

  // Hash della password
  const passwordHash = await authService.hashPassword(password);

  // Crea l'utente
  const user = await userModel.createUser(username, email, passwordHash);

  // Genera il token
  const token = generateToken(user);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at,
      },
      token,
    },
  });
});

/**
 * Effettua il login dell'utente
 * @route POST /api/auth/login
 * @access Pubblico
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Valida l'input
  if (!email || !password) {
    throw new BadRequestError('Email and password are required');
  }

  // Valida i dati di login
  authService.validateLoginData(email, password);

  // Trova l'utente per email
  const user = await userModel.findUserByEmail(email);
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Confronta la password
  const isPasswordValid = await authService.comparePassword(password, user.password_hash);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Genera il token
  const token = generateToken(user);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    },
  });
});

/**
 * Ottiene l'utente autenticato corrente
 * @route GET /api/auth/me
 * @access Protetto
 */
const getCurrentUser = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const user = await userModel.findUserById(userId);
  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  // Get user stats
  const stats = await userModel.getUserStats(userId);

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at,
      },
      stats: {
        favoritesCount: parseInt(stats.favorites_count),
        reviewsCount: parseInt(stats.reviews_count),
      },
    },
  });
});

module.exports = {
  register,
  login,
  getCurrentUser,
};

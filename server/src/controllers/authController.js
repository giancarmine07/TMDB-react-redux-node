/**
 * Auth Controller
 * Handles authentication requests (register, login, get current user)
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
 * Register new user
 * @route POST /api/auth/register
 * @access Public
 */
const register = catchAsync(async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input
  if (!username || !email || !password) {
    throw new BadRequestError('Username, email, and password are required');
  }

  // Validate user data
  authService.validateUserData(username, email, password);

  // Check if user already exists
  const existingEmail = await userModel.findUserByEmail(email);
  if (existingEmail) {
    throw new ConflictError('Email already registered');
  }

  const existingUsername = await userModel.findUserByUsername(username);
  if (existingUsername) {
    throw new ConflictError('Username already taken');
  }

  // Hash password
  const passwordHash = await authService.hashPassword(password);

  // Create user
  const user = await userModel.createUser(username, email, passwordHash);

  // Generate token
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
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    throw new BadRequestError('Email and password are required');
  }

  // Validate login data
  authService.validateLoginData(email, password);

  // Find user by email
  const user = await userModel.findUserByEmail(email);
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Compare password
  const isPasswordValid = await authService.comparePassword(password, user.password_hash);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Generate token
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
 * Get current authenticated user
 * @route GET /api/auth/me
 * @access Protected
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

/**
 * Favorites Controller
 * Handles favorite movie operations (add, remove, get favorites)
 */

const favoriteModel = require('../models/favoriteModel');
const { catchAsync } = require('../middleware/errorHandler');
const {
  BadRequestError,
  NotFoundError,
  ConflictError,
} = require('../utils/errors/AppError');

/**
 * Get all favorites for authenticated user
 * @route GET /api/favorites
 * @access Protected
 */
const getFavorites = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const sortBy = req.query.sortBy || 'added_at';
  const sortOrder = req.query.sortOrder || 'DESC';

  if (page < 1) {
    throw new BadRequestError('Page number must be greater than 0');
  }

  if (limit < 1 || limit > 100) {
    throw new BadRequestError('Limit must be between 1 and 100');
  }

  const offset = (page - 1) * limit;

  const favorites = await favoriteModel.getFavoritesByUserId(userId, {
    limit,
    offset,
    sortBy,
    sortOrder,
  });

  const totalCount = await favoriteModel.getFavoritesCount(userId);

  res.status(200).json({
    success: true,
    data: {
      favorites,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    },
  });
});

/**
 * Add movie to favorites
 * @route POST /api/favorites
 * @access Protected
 */
const addFavorite = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const movieData = req.body;

  // Validate required fields
  if (!movieData.id || !movieData.title) {
    throw new BadRequestError('Movie ID and title are required');
  }

  // Check if already favorited
  const existing = await favoriteModel.checkIfFavorite(userId, movieData.id);
  if (existing) {
    throw new ConflictError('Movie already in favorites');
  }

  // Add to favorites
  const favorite = await favoriteModel.addFavorite(userId, movieData);

  res.status(201).json({
    success: true,
    message: 'Movie added to favorites',
    data: {
      favorite,
    },
  });
});

/**
 * Remove movie from favorites
 * @route DELETE /api/favorites/:movieId
 * @access Protected
 */
const removeFavorite = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const movieId = parseInt(req.params.movieId);

  if (!movieId || movieId < 1) {
    throw new BadRequestError('Invalid movie ID');
  }

  // Check if favorite exists
  const exists = await favoriteModel.checkIfFavorite(userId, movieId);
  if (!exists) {
    throw new NotFoundError('Favorite not found');
  }

  // Remove from favorites
  const removed = await favoriteModel.removeFavorite(userId, movieId);

  if (!removed) {
    throw new NotFoundError('Failed to remove favorite');
  }

  res.status(200).json({
    success: true,
    message: 'Movie removed from favorites',
  });
});

/**
 * Check if movie is in favorites
 * @route GET /api/favorites/check/:movieId
 * @access Protected
 */
const checkFavorite = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const movieId = parseInt(req.params.movieId);

  if (!movieId || movieId < 1) {
    throw new BadRequestError('Invalid movie ID');
  }

  const isFavorite = await favoriteModel.checkIfFavorite(userId, movieId);

  res.status(200).json({
    success: true,
    data: {
      isFavorite,
      movieId,
    },
  });
});

/**
 * Get favorite by movie ID
 * @route GET /api/favorites/movie/:movieId
 * @access Protected
 */
const getFavoriteByMovieId = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const movieId = parseInt(req.params.movieId);

  if (!movieId || movieId < 1) {
    throw new BadRequestError('Invalid movie ID');
  }

  const favorite = await favoriteModel.getFavoriteByUserAndMovie(userId, movieId);

  if (!favorite) {
    throw new NotFoundError('Favorite not found');
  }

  res.status(200).json({
    success: true,
    data: {
      favorite,
    },
  });
});

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
  getFavoriteByMovieId,
};

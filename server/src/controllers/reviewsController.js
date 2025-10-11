/**
 * Controller Recensioni
 * Gestisce le operazioni sulle recensioni (creazione, lettura, aggiornamento, eliminazione)
 */

const reviewModel = require('../models/reviewModel');
const { catchAsync } = require('../middleware/errorHandler');
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
} = require('../utils/errors/AppError');

/**
 * Ottiene tutte le recensioni dell'utente autenticato
 * @route GET /api/reviews/user
 * @access Protetto
 */
const getUserReviews = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const sortBy = req.query.sortBy || 'created_at';
  const sortOrder = req.query.sortOrder || 'DESC';

  if (page < 1) {
    throw new BadRequestError('Page number must be greater than 0');
  }

  if (limit < 1 || limit > 100) {
    throw new BadRequestError('Limit must be between 1 and 100');
  }

  const offset = (page - 1) * limit;

  const reviews = await reviewModel.getReviewsByUserId(userId, {
    limit,
    offset,
    sortBy,
    sortOrder,
  });

  const totalCount = await reviewModel.getReviewsCountByUser(userId);

  res.status(200).json({
    success: true,
    data: {
      reviews,
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
 * Ottiene tutte le recensioni per un film
 * @route GET /api/reviews/movie/:movieId
 * @access Pubblico
 */
const getMovieReviews = catchAsync(async (req, res) => {
  const movieId = parseInt(req.params.movieId);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const sortBy = req.query.sortBy || 'created_at';
  const sortOrder = req.query.sortOrder || 'DESC';

  if (!movieId || movieId < 1) {
    throw new BadRequestError('Invalid movie ID');
  }

  if (page < 1) {
    throw new BadRequestError('Page number must be greater than 0');
  }

  if (limit < 1 || limit > 100) {
    throw new BadRequestError('Limit must be between 1 and 100');
  }

  const offset = (page - 1) * limit;

  const reviews = await reviewModel.getReviewsByMovieId(movieId, {
    limit,
    offset,
    sortBy,
    sortOrder,
  });

  const totalCount = await reviewModel.getReviewsCountByMovie(movieId);
  const averageRating = await reviewModel.getAverageRatingByMovie(movieId);

  res.status(200).json({
    success: true,
    data: {
      reviews,
      movieId,
      averageRating: parseFloat(averageRating.toFixed(1)),
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
 * Create new review
 * @route POST /api/reviews
 * @access Protected
 */
const createReview = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { movieId, movieTitle, rating, comment } = req.body;

  // Validate required fields
  if (!movieId || !movieTitle || !rating) {
    throw new BadRequestError('Movie ID, title, and rating are required');
  }

  // Validate rating
  if (rating < 1 || rating > 5) {
    throw new BadRequestError('Rating must be between 1 and 5');
  }

  // Validate comment length if provided
  if (comment && comment.length > 1000) {
    throw new BadRequestError('Comment must not exceed 1000 characters');
  }

  // Check if user already reviewed this movie
  const existingReview = await reviewModel.getReviewByUserAndMovie(userId, movieId);
  if (existingReview) {
    throw new ConflictError('You have already reviewed this movie');
  }

  // Create review
  const review = await reviewModel.createReview(
    userId,
    movieId,
    movieTitle,
    rating,
    comment || ''
  );

  res.status(201).json({
    success: true,
    message: 'Review created successfully',
    data: {
      review,
    },
  });
});

/**
 * Update review
 * @route PUT /api/reviews/:id
 * @access Protected
 */
const updateReview = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const reviewId = parseInt(req.params.id);
  const { rating, comment } = req.body;

  if (!reviewId || reviewId < 1) {
    throw new BadRequestError('Invalid review ID');
  }

  // Validate rating
  if (!rating || rating < 1 || rating > 5) {
    throw new BadRequestError('Rating must be between 1 and 5');
  }

  // Validate comment length if provided
  if (comment && comment.length > 1000) {
    throw new BadRequestError('Comment must not exceed 1000 characters');
  }

  // Check if review exists
  const existingReview = await reviewModel.getReviewById(reviewId);
  if (!existingReview) {
    throw new NotFoundError('Review not found');
  }

  // Check if user owns the review
  if (existingReview.user_id !== userId) {
    throw new ForbiddenError('You can only update your own reviews');
  }

  // Update review
  const updatedReview = await reviewModel.updateReview(reviewId, rating, comment || '');

  res.status(200).json({
    success: true,
    message: 'Review updated successfully',
    data: {
      review: updatedReview,
    },
  });
});

/**
 * Delete review
 * @route DELETE /api/reviews/:id
 * @access Protected
 */
const deleteReview = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const reviewId = parseInt(req.params.id);

  if (!reviewId || reviewId < 1) {
    throw new BadRequestError('Invalid review ID');
  }

  // Check if review exists
  const existingReview = await reviewModel.getReviewById(reviewId);
  if (!existingReview) {
    throw new NotFoundError('Review not found');
  }

  // Check if user owns the review
  if (existingReview.user_id !== userId) {
    throw new ForbiddenError('You can only delete your own reviews');
  }

  // Delete review
  const deleted = await reviewModel.deleteReview(reviewId);

  if (!deleted) {
    throw new NotFoundError('Failed to delete review');
  }

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
  });
});

/**
 * Get review by ID
 * @route GET /api/reviews/:id
 * @access Public
 */
const getReviewById = catchAsync(async (req, res) => {
  const reviewId = parseInt(req.params.id);

  if (!reviewId || reviewId < 1) {
    throw new BadRequestError('Invalid review ID');
  }

  const review = await reviewModel.getReviewById(reviewId);

  if (!review) {
    throw new NotFoundError('Review not found');
  }

  res.status(200).json({
    success: true,
    data: {
      review,
    },
  });
});

module.exports = {
  getUserReviews,
  getMovieReviews,
  createReview,
  updateReview,
  deleteReview,
  getReviewById,
};

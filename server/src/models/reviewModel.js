/**
 * Review Model
 * Database queries for review operations using raw SQL
 */

const { query } = require('../config/database');
const { DatabaseError } = require('../utils/errors/AppError');

/**
 * Create a new review
 * @param {number} userId - User's ID
 * @param {number} movieId - Movie's ID from TMDB
 * @param {string} movieTitle - Movie title
 * @param {number} rating - Rating (1-5)
 * @param {string} comment - Review comment
 * @returns {Promise<Object>} - Created review object
 */
const createReview = async (userId, movieId, movieTitle, rating, comment) => {
  try {
    const sql = `
      INSERT INTO reviews (user_id, movie_id, movie_title, rating, comment)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [userId, movieId, movieTitle, rating, comment];
    const result = await query(sql, values);

    if (result.rows.length === 0) {
      throw new DatabaseError('Failed to create review');
    }

    return result.rows[0];
  } catch (error) {
    // Handle unique constraint violation (already reviewed)
    if (error.code === '23505') {
      throw new Error('You have already reviewed this movie');
    }
    // Handle check constraint violation (invalid rating)
    if (error.code === '23514') {
      throw new Error('Rating must be between 1 and 5');
    }
    throw new DatabaseError(`Failed to create review: ${error.message}`);
  }
};

/**
 * Update a review
 * @param {number} reviewId - Review's ID
 * @param {number} rating - New rating
 * @param {string} comment - New comment
 * @returns {Promise<Object>} - Updated review object
 */
const updateReview = async (reviewId, rating, comment) => {
  try {
    const sql = `
      UPDATE reviews
      SET rating = $1, comment = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;

    const result = await query(sql, [rating, comment, reviewId]);

    if (result.rows.length === 0) {
      throw new Error('Review not found');
    }

    return result.rows[0];
  } catch (error) {
    if (error.code === '23514') {
      throw new Error('Rating must be between 1 and 5');
    }
    throw new DatabaseError(`Failed to update review: ${error.message}`);
  }
};

/**
 * Delete a review
 * @param {number} reviewId - Review's ID
 * @returns {Promise<boolean>} - True if deleted
 */
const deleteReview = async (reviewId) => {
  try {
    const sql = `
      DELETE FROM reviews
      WHERE id = $1
      RETURNING id
    `;

    const result = await query(sql, [reviewId]);

    return result.rows.length > 0;
  } catch (error) {
    throw new DatabaseError(`Failed to delete review: ${error.message}`);
  }
};

/**
 * Get all reviews by user ID
 * @param {number} userId - User's ID
 * @param {Object} options - Pagination options
 * @returns {Promise<Array>} - Array of reviews
 */
const getReviewsByUserId = async (userId, options = {}) => {
  try {
    const { limit = 20, offset = 0, sortBy = 'created_at', sortOrder = 'DESC' } = options;

    const sql = `
      SELECT
        id,
        user_id,
        movie_id,
        movie_title,
        rating,
        comment,
        created_at,
        updated_at
      FROM reviews
      WHERE user_id = $1
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT $2 OFFSET $3
    `;

    const result = await query(sql, [userId, limit, offset]);

    return result.rows;
  } catch (error) {
    throw new DatabaseError(`Failed to get user reviews: ${error.message}`);
  }
};

/**
 * Get all reviews for a movie
 * @param {number} movieId - Movie's ID from TMDB
 * @param {Object} options - Pagination options
 * @returns {Promise<Array>} - Array of reviews with user info
 */
const getReviewsByMovieId = async (movieId, options = {}) => {
  try {
    const { limit = 20, offset = 0, sortBy = 'created_at', sortOrder = 'DESC' } = options;

    const sql = `
      SELECT
        r.id,
        r.user_id,
        r.movie_id,
        r.movie_title,
        r.rating,
        r.comment,
        r.created_at,
        r.updated_at,
        u.username
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.movie_id = $1
      ORDER BY r.${sortBy} ${sortOrder}
      LIMIT $2 OFFSET $3
    `;

    const result = await query(sql, [movieId, limit, offset]);

    return result.rows;
  } catch (error) {
    throw new DatabaseError(`Failed to get movie reviews: ${error.message}`);
  }
};

/**
 * Get review by ID
 * @param {number} reviewId - Review's ID
 * @returns {Promise<Object|null>} - Review object or null
 */
const getReviewById = async (reviewId) => {
  try {
    const sql = `
      SELECT
        r.*,
        u.username
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.id = $1
    `;

    const result = await query(sql, [reviewId]);

    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    throw new DatabaseError(`Failed to get review: ${error.message}`);
  }
};

/**
 * Get review by user ID and movie ID
 * @param {number} userId - User's ID
 * @param {number} movieId - Movie's ID
 * @returns {Promise<Object|null>} - Review object or null
 */
const getReviewByUserAndMovie = async (userId, movieId) => {
  try {
    const sql = `
      SELECT * FROM reviews
      WHERE user_id = $1 AND movie_id = $2
    `;

    const result = await query(sql, [userId, movieId]);

    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    throw new DatabaseError(`Failed to get review: ${error.message}`);
  }
};

/**
 * Get total count of reviews by user
 * @param {number} userId - User's ID
 * @returns {Promise<number>} - Total count
 */
const getReviewsCountByUser = async (userId) => {
  try {
    const sql = `
      SELECT COUNT(*) as count
      FROM reviews
      WHERE user_id = $1
    `;

    const result = await query(sql, [userId]);

    return parseInt(result.rows[0].count);
  } catch (error) {
    throw new DatabaseError(`Failed to get reviews count: ${error.message}`);
  }
};

/**
 * Get total count of reviews for a movie
 * @param {number} movieId - Movie's ID
 * @returns {Promise<number>} - Total count
 */
const getReviewsCountByMovie = async (movieId) => {
  try {
    const sql = `
      SELECT COUNT(*) as count
      FROM reviews
      WHERE movie_id = $1
    `;

    const result = await query(sql, [movieId]);

    return parseInt(result.rows[0].count);
  } catch (error) {
    throw new DatabaseError(`Failed to get reviews count: ${error.message}`);
  }
};

/**
 * Get average rating for a movie
 * @param {number} movieId - Movie's ID
 * @returns {Promise<number>} - Average rating
 */
const getAverageRatingByMovie = async (movieId) => {
  try {
    const sql = `
      SELECT COALESCE(AVG(rating), 0) as average_rating
      FROM reviews
      WHERE movie_id = $1
    `;

    const result = await query(sql, [movieId]);

    return parseFloat(result.rows[0].average_rating);
  } catch (error) {
    throw new DatabaseError(`Failed to get average rating: ${error.message}`);
  }
};

/**
 * Delete all reviews by user
 * @param {number} userId - User's ID
 * @returns {Promise<number>} - Number of deleted reviews
 */
const deleteAllReviewsByUser = async (userId) => {
  try {
    const sql = `
      DELETE FROM reviews
      WHERE user_id = $1
      RETURNING id
    `;

    const result = await query(sql, [userId]);

    return result.rows.length;
  } catch (error) {
    throw new DatabaseError(`Failed to delete reviews: ${error.message}`);
  }
};

module.exports = {
  createReview,
  updateReview,
  deleteReview,
  getReviewsByUserId,
  getReviewsByMovieId,
  getReviewById,
  getReviewByUserAndMovie,
  getReviewsCountByUser,
  getReviewsCountByMovie,
  getAverageRatingByMovie,
  deleteAllReviewsByUser,
};

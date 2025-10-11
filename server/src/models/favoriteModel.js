/**
 * Favorite Model
 * Database queries for favorite operations using raw SQL
 */

const { query } = require('../config/database');
const { DatabaseError } = require('../utils/errors/AppError');

/**
 * Add a movie to user's favorites
 * @param {number} userId - User's ID
 * @param {Object} movieData - Movie information from TMDB
 * @returns {Promise<Object>} - Created favorite object
 */
const addFavorite = async (userId, movieData) => {
  try {
    const sql = `
      INSERT INTO favorites (
        user_id,
        movie_id,
        movie_title,
        movie_poster,
        movie_overview,
        movie_release_date,
        movie_vote_average
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      userId,
      movieData.id,
      movieData.title,
      movieData.poster_path,
      movieData.overview,
      movieData.release_date,
      movieData.vote_average,
    ];

    const result = await query(sql, values);

    if (result.rows.length === 0) {
      throw new DatabaseError('Failed to add favorite');
    }

    return result.rows[0];
  } catch (error) {
    // Handle unique constraint violation (already favorited)
    if (error.code === '23505') {
      throw new Error('Movie already in favorites');
    }
    throw new DatabaseError(`Failed to add favorite: ${error.message}`);
  }
};

/**
 * Remove a movie from user's favorites
 * @param {number} userId - User's ID
 * @param {number} movieId - Movie's ID from TMDB
 * @returns {Promise<boolean>} - True if removed
 */
const removeFavorite = async (userId, movieId) => {
  try {
    const sql = `
      DELETE FROM favorites
      WHERE user_id = $1 AND movie_id = $2
      RETURNING id
    `;

    const result = await query(sql, [userId, movieId]);

    return result.rows.length > 0;
  } catch (error) {
    throw new DatabaseError(`Failed to remove favorite: ${error.message}`);
  }
};

/**
 * Get all favorites for a user
 * @param {number} userId - User's ID
 * @param {Object} options - Pagination options
 * @returns {Promise<Array>} - Array of favorite movies
 */
const getFavoritesByUserId = async (userId, options = {}) => {
  try {
    const { limit = 20, offset = 0, sortBy = 'added_at', sortOrder = 'DESC' } = options;

    const sql = `
      SELECT
        id,
        user_id,
        movie_id,
        movie_title,
        movie_poster,
        movie_overview,
        movie_release_date,
        movie_vote_average,
        added_at
      FROM favorites
      WHERE user_id = $1
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT $2 OFFSET $3
    `;

    const result = await query(sql, [userId, limit, offset]);

    return result.rows;
  } catch (error) {
    throw new DatabaseError(`Failed to get favorites: ${error.message}`);
  }
};

/**
 * Check if a movie is in user's favorites
 * @param {number} userId - User's ID
 * @param {number} movieId - Movie's ID from TMDB
 * @returns {Promise<boolean>} - True if favorited
 */
const checkIfFavorite = async (userId, movieId) => {
  try {
    const sql = `
      SELECT EXISTS(
        SELECT 1 FROM favorites
        WHERE user_id = $1 AND movie_id = $2
      ) as is_favorite
    `;

    const result = await query(sql, [userId, movieId]);

    return result.rows[0].is_favorite;
  } catch (error) {
    throw new DatabaseError(`Failed to check favorite: ${error.message}`);
  }
};

/**
 * Get favorite by ID
 * @param {number} id - Favorite's ID
 * @returns {Promise<Object|null>} - Favorite object or null
 */
const getFavoriteById = async (id) => {
  try {
    const sql = `
      SELECT * FROM favorites
      WHERE id = $1
    `;

    const result = await query(sql, [id]);

    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    throw new DatabaseError(`Failed to get favorite: ${error.message}`);
  }
};

/**
 * Get total count of user's favorites
 * @param {number} userId - User's ID
 * @returns {Promise<number>} - Total count
 */
const getFavoritesCount = async (userId) => {
  try {
    const sql = `
      SELECT COUNT(*) as count
      FROM favorites
      WHERE user_id = $1
    `;

    const result = await query(sql, [userId]);

    return parseInt(result.rows[0].count);
  } catch (error) {
    throw new DatabaseError(`Failed to get favorites count: ${error.message}`);
  }
};

/**
 * Get favorite by user ID and movie ID
 * @param {number} userId - User's ID
 * @param {number} movieId - Movie's ID
 * @returns {Promise<Object|null>} - Favorite object or null
 */
const getFavoriteByUserAndMovie = async (userId, movieId) => {
  try {
    const sql = `
      SELECT * FROM favorites
      WHERE user_id = $1 AND movie_id = $2
    `;

    const result = await query(sql, [userId, movieId]);

    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    throw new DatabaseError(`Failed to get favorite: ${error.message}`);
  }
};

/**
 * Delete all favorites for a user
 * @param {number} userId - User's ID
 * @returns {Promise<number>} - Number of deleted favorites
 */
const deleteAllFavorites = async (userId) => {
  try {
    const sql = `
      DELETE FROM favorites
      WHERE user_id = $1
      RETURNING id
    `;

    const result = await query(sql, [userId]);

    return result.rows.length;
  } catch (error) {
    throw new DatabaseError(`Failed to delete favorites: ${error.message}`);
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getFavoritesByUserId,
  checkIfFavorite,
  getFavoriteById,
  getFavoritesCount,
  getFavoriteByUserAndMovie,
  deleteAllFavorites,
};

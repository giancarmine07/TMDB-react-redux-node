/**
 * Model Recensioni
 * Query al database per le operazioni sulle recensioni usando SQL puro
 */

const { query } = require('../config/database');
const { DatabaseError } = require('../utils/errors/AppError');

/**
 * Crea una nuova recensione
 * @param {number} userId - ID dell'utente
 * @param {number} movieId - ID TMDB del film
 * @param {string} movieTitle - Titolo del film
 * @param {number} rating - Valutazione (1-5)
 * @param {string} comment - Commento della recensione
 * @returns {Promise<Object>} - Oggetto recensione creato
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
    // Gestisci violazione di vincolo unique (già recensito)
    if (error.code === '23505') {
      throw new Error('You have already reviewed this movie');
    }
    // Gestisci violazione di vincolo check (valutazione non valida)
    if (error.code === '23514') {
      throw new Error('Rating must be between 1 and 5');
    }
    throw new DatabaseError(`Failed to create review: ${error.message}`);
  }
};

/**
 * Aggiorna una recensione
 * @param {number} reviewId - ID della recensione
 * @param {number} rating - Nuova valutazione
 * @param {string} comment - Nuovo commento
 * @returns {Promise<Object>} - Oggetto recensione aggiornato
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
 * Elimina una recensione
 * @param {number} reviewId - ID della recensione
 * @returns {Promise<boolean>} - True se eliminata
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
 * Ottiene tutte le recensioni per ID utente
 * @param {number} userId - ID dell'utente
 * @param {Object} options - Opzioni di query (limit, offset, sortBy, sortOrder)
 * @returns {Promise<Array>} - Array di oggetti recensione
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
 * Ottiene tutte le recensioni per un film
 * @param {number} movieId - ID TMDB del film
 * @param {Object} options - Opzioni di query
 * @returns {Promise<Array>} - Array di oggetti recensione con info utente
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
 * Ottiene una recensione per ID
 * @param {number} reviewId - ID della recensione
 * @returns {Promise<Object|null>} - Oggetto recensione o null
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
 * Ottiene il conteggio totale delle recensioni di un utente
 * @param {number} userId - ID dell'utente
 * @returns {Promise<number>} - Conteggio totale
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
 * Ottiene il conteggio totale delle recensioni per un film
 * @param {number} movieId - ID del film
 * @returns {Promise<number>} - Conteggio totale
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
 * Ottiene la valutazione media per un film
 * @param {number} movieId - ID del film
 * @returns {Promise<number>} - Valutazione media
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

/**
 * Model Preferiti
 * Query al database per le operazioni sui preferiti usando SQL puro
 */

const { query } = require('../config/database');
const { DatabaseError } = require('../utils/errors/AppError');

/**
 * Aggiunge un film ai preferiti dell'utente
 * @param {number} userId - ID dell'utente
 * @param {Object} movieData - Informazioni del film da TMDB
 * @returns {Promise<Object>} - Oggetto preferito creato
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
    // Gestisci violazione di vincolo unique (già nei preferiti)
    if (error.code === '23505') {
      throw new Error('Movie already in favorites');
    }
    throw new DatabaseError(`Failed to add favorite: ${error.message}`);
  }
};

/**
 * Rimuove un film dai preferiti dell'utente
 * @param {number} userId - ID dell'utente
 * @param {number} movieId - ID TMDB del film
 * @returns {Promise<boolean>} - True se eliminato
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
 * Ottiene tutti i preferiti di un utente
 * @param {number} userId - ID dell'utente
 * @param {Object} options - Opzioni di query (limit, offset, sortBy, sortOrder)
 * @returns {Promise<Array>} - Array di oggetti preferiti
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
 * Ottiene il conteggio totale dei preferiti di un utente
 * @param {number} userId - ID dell'utente
 * @returns {Promise<number>} - Conteggio totale
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
 * Ottiene un preferito specifico per utente e ID film
 * @param {number} userId - ID dell'utente
 * @param {number} movieId - ID TMDB del film
 * @returns {Promise<Object|null>} - Oggetto preferito o null
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

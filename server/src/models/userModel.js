/**
 * Model Utente
 * Query al database per le operazioni sugli utenti usando SQL puro
 */

const { query } = require('../config/database');
const { DatabaseError } = require('../utils/errors/AppError');

/**
 * Crea un nuovo utente
 * @param {string} username - Nome utente
 * @param {string} email - Email dell'utente
 * @param {string} passwordHash - Password hashata
 * @returns {Promise<Object>} - Oggetto utente creato
 */
const createUser = async (username, email, passwordHash) => {
  try {
    const sql = `
      INSERT INTO users (username, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at, updated_at
    `;

    const result = await query(sql, [username, email, passwordHash]);

    if (result.rows.length === 0) {
      throw new DatabaseError('Failed to create user');
    }

    return result.rows[0];
  } catch (error) {
    // Gestisci violazioni di vincoli unique
    if (error.code === '23505') {
      if (error.constraint === 'users_email_key') {
        throw new Error('Email already exists');
      }
      if (error.constraint === 'users_username_key') {
        throw new Error('Username already exists');
      }
    }
    throw error;
  }
};

/**
 * Trova utente per email
 * @param {string} email - Email dell'utente
 * @returns {Promise<Object|null>} - Oggetto utente o null
 */
const findUserByEmail = async (email) => {
  try {
    const sql = `
      SELECT id, username, email, password_hash, created_at, updated_at
      FROM users
      WHERE email = $1
    `;

    const result = await query(sql, [email]);

    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    throw new DatabaseError(`Failed to find user by email: ${error.message}`);
  }
};

/**
 * Trova utente per nome utente
 * @param {string} username - Nome utente
 * @returns {Promise<Object|null>} - Oggetto utente o null
 */
const findUserByUsername = async (username) => {
  try {
    const sql = `
      SELECT id, username, email, password_hash, created_at, updated_at
      FROM users
      WHERE username = $1
    `;

    const result = await query(sql, [username]);

    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    throw new DatabaseError(`Failed to find user by username: ${error.message}`);
  }
};

/**
 * Trova utente per ID
 * @param {number} userId - ID dell'utente
 * @returns {Promise<Object|null>} - Oggetto utente o null
 */
const findUserById = async (id) => {
  try {
    const sql = `
      SELECT id, username, email, created_at, updated_at
      FROM users
      WHERE id = $1
    `;

    const result = await query(sql, [id]);

    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    throw new DatabaseError(`Failed to find user by ID: ${error.message}`);
  }
};

/**
 * Aggiorna utente
 * @param {number} userId - ID dell'utente
 * @param {Object} updates - Campi da aggiornare
 * @returns {Promise<Object>} - Oggetto utente aggiornato
 */
const updateUser = async (id, updates) => {
  try {
    const allowedFields = ['username', 'email'];
    const fields = Object.keys(updates).filter((key) =>
      allowedFields.includes(key)
    );

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    // Costruisci la clausola SET dinamica
    const setClause = fields
      .map((field, index) => `${field} = $${index + 2}`)
      .join(', ');

    const values = [id, ...fields.map((field) => updates[field])];

    const sql = `
      UPDATE users
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, username, email, created_at, updated_at
    `;

    const result = await query(sql, values);

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    return result.rows[0];
  } catch (error) {
    if (error.code === '23505') {
      if (error.constraint === 'users_email_key') {
        throw new Error('Email already exists');
      }
      if (error.constraint === 'users_username_key') {
        throw new Error('Username already exists');
      }
    }
    throw new DatabaseError(`Failed to update user: ${error.message}`);
  }
};

/**
 * Elimina utente
 * @param {number} userId - ID dell'utente
 * @returns {Promise<boolean>} - True se eliminato
 */
const deleteUser = async (id) => {
  try {
    const sql = `
      DELETE FROM users
      WHERE id = $1
      RETURNING id
    `;

    const result = await query(sql, [id]);

    return result.rows.length > 0;
  } catch (error) {
    throw new DatabaseError(`Failed to delete user: ${error.message}`);
  }
};

/**
 * Check if email exists
 * @param {string} email - Email to check
 * @returns {Promise<boolean>} - True if exists
 */
const emailExists = async (email) => {
  try {
    const sql = `
      SELECT EXISTS(SELECT 1 FROM users WHERE email = $1) as exists
    `;

    const result = await query(sql, [email]);

    return result.rows[0].exists;
  } catch (error) {
    throw new DatabaseError(`Failed to check email: ${error.message}`);
  }
};

/**
 * Check if username exists
 * @param {string} username - Username to check
 * @returns {Promise<boolean>} - True if exists
 */
const usernameExists = async (username) => {
  try {
    const sql = `
      SELECT EXISTS(SELECT 1 FROM users WHERE username = $1) as exists
    `;

    const result = await query(sql, [username]);

    return result.rows[0].exists;
  } catch (error) {
    throw new DatabaseError(`Failed to check username: ${error.message}`);
  }
};

/**
 * Get user statistics (favorites count, reviews count)
 * @param {number} userId - User's ID
 * @returns {Promise<Object>} - User statistics
 */
const getUserStats = async (userId) => {
  try {
    const sql = `
      SELECT
        (SELECT COUNT(*) FROM favorites WHERE user_id = $1) as favorites_count,
        (SELECT COUNT(*) FROM reviews WHERE user_id = $1) as reviews_count
    `;

    const result = await query(sql, [userId]);

    return result.rows[0];
  } catch (error) {
    throw new DatabaseError(`Failed to get user stats: ${error.message}`);
  }
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserByUsername,
  findUserById,
  updateUser,
  deleteUser,
  emailExists,
  usernameExists,
  getUserStats,
};

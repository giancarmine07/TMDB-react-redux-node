/**
 * Favorites Routes
 * Routes for favorite movie operations
 */

const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/favorites
 * @desc    Get all favorites for authenticated user
 * @access  Protected
 */
router.get('/', verifyToken, favoritesController.getFavorites);

/**
 * @route   POST /api/favorites
 * @desc    Add movie to favorites
 * @access  Protected
 */
router.post('/', verifyToken, favoritesController.addFavorite);

/**
 * @route   DELETE /api/favorites/:movieId
 * @desc    Remove movie from favorites
 * @access  Protected
 */
router.delete('/:movieId', verifyToken, favoritesController.removeFavorite);

/**
 * @route   GET /api/favorites/check/:movieId
 * @desc    Check if movie is in favorites
 * @access  Protected
 */
router.get('/check/:movieId', verifyToken, favoritesController.checkFavorite);

/**
 * @route   GET /api/favorites/movie/:movieId
 * @desc    Get favorite by movie ID
 * @access  Protected
 */
router.get('/movie/:movieId', verifyToken, favoritesController.getFavoriteByMovieId);

module.exports = router;

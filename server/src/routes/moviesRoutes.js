/**
 * Movies Routes
 * Routes for movie operations (proxy to TMDB API)
 */

const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/moviesController');

/**
 * @route   GET /api/movies/popular
 * @desc    Get popular movies
 * @access  Public
 */
router.get('/popular', moviesController.getPopularMovies);

/**
 * @route   GET /api/movies/search
 * @desc    Search movies by query
 * @access  Public
 */
router.get('/search', moviesController.searchMovies);

/**
 * @route   GET /api/movies/trending
 * @desc    Get trending movies
 * @access  Public
 */
router.get('/trending', moviesController.getTrendingMovies);

/**
 * @route   GET /api/movies/top-rated
 * @desc    Get top rated movies
 * @access  Public
 */
router.get('/top-rated', moviesController.getTopRatedMovies);

/**
 * @route   GET /api/movies/now-playing
 * @desc    Get now playing movies
 * @access  Public
 */
router.get('/now-playing', moviesController.getNowPlayingMovies);

/**
 * @route   GET /api/movies/upcoming
 * @desc    Get upcoming movies
 * @access  Public
 */
router.get('/upcoming', moviesController.getUpcomingMovies);

/**
 * @route   GET /api/movies/genres
 * @desc    Get movie genres list
 * @access  Public
 */
router.get('/genres', moviesController.getGenres);

/**
 * @route   GET /api/movies/discover
 * @desc    Discover movies with filters
 * @access  Public
 */
router.get('/discover', moviesController.discoverMovies);

/**
 * @route   GET /api/movies/:id
 * @desc    Get movie details by ID
 * @access  Public
 */
router.get('/:id', moviesController.getMovieDetails);

module.exports = router;

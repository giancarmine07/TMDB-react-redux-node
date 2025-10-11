/**
 * Reviews Routes
 * Routes for review operations (create, read, update, delete)
 */

const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/reviews/user
 * @desc    Get all reviews by authenticated user
 * @access  Protected
 */
router.get('/user', verifyToken, reviewsController.getUserReviews);

/**
 * @route   GET /api/reviews/movie/:movieId
 * @desc    Get all reviews for a movie
 * @access  Public
 */
router.get('/movie/:movieId', reviewsController.getMovieReviews);

/**
 * @route   GET /api/reviews/:id
 * @desc    Get review by ID
 * @access  Public
 */
router.get('/:id', reviewsController.getReviewById);

/**
 * @route   POST /api/reviews
 * @desc    Create new review
 * @access  Protected
 */
router.post('/', verifyToken, reviewsController.createReview);

/**
 * @route   PUT /api/reviews/:id
 * @desc    Update review
 * @access  Protected
 */
router.put('/:id', verifyToken, reviewsController.updateReview);

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete review
 * @access  Protected
 */
router.delete('/:id', verifyToken, reviewsController.deleteReview);

module.exports = router;

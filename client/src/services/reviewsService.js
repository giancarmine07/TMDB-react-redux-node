/**
 * Reviews Service
 * API calls for movie reviews operations
 */

import { get, post, put, del } from './api';
import { API_ENDPOINTS } from '../constants';

/**
 * Get user's reviews
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise}
 */
export const getUserReviews = async (page = 1, limit = 20) => {
  const response = await get(API_ENDPOINTS.REVIEWS.GET_USER_REVIEWS, {
    params: { page, limit },
  });
  return response.data;
};

/**
 * Get reviews for a movie
 * @param {number} movieId - Movie ID
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise}
 */
export const getMovieReviews = async (movieId, page = 1, limit = 20) => {
  const response = await get(API_ENDPOINTS.REVIEWS.GET_MOVIE_REVIEWS(movieId), {
    params: { page, limit },
  });
  return response.data;
};

/**
 * Get review by ID
 * @param {number} reviewId - Review ID
 * @returns {Promise}
 */
export const getReviewById = async (reviewId) => {
  const response = await get(`/reviews/${reviewId}`);
  return response.data;
};

/**
 * Create new review
 * @param {Object} reviewData - Review data
 * @param {number} reviewData.movieId - Movie ID
 * @param {string} reviewData.movieTitle - Movie title
 * @param {number} reviewData.rating - Rating (1-5)
 * @param {string} reviewData.comment - Review comment
 * @returns {Promise}
 */
export const createReview = async ({ movieId, movieTitle, rating, comment }) => {
  const response = await post(API_ENDPOINTS.REVIEWS.CREATE, {
    movieId,
    movieTitle,
    rating,
    comment,
  });
  return response.data;
};

/**
 * Update review
 * @param {number} reviewId - Review ID
 * @param {number} rating - New rating
 * @param {string} comment - New comment
 * @returns {Promise}
 */
export const updateReview = async (reviewId, rating, comment) => {
  const response = await put(API_ENDPOINTS.REVIEWS.UPDATE(reviewId), {
    rating,
    comment,
  });
  return response.data;
};

/**
 * Delete review
 * @param {number} reviewId - Review ID
 * @returns {Promise}
 */
export const deleteReview = async (reviewId) => {
  const response = await del(API_ENDPOINTS.REVIEWS.DELETE(reviewId));
  return response.data;
};

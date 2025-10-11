/**
 * Favorites Service
 * API calls for favorite movies operations
 */

import { get, post, del } from './api';
import { API_ENDPOINTS } from '../constants';

/**
 * Get all favorites for authenticated user
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise}
 */
export const getFavorites = async (page = 1, limit = 20) => {
  const response = await get(API_ENDPOINTS.FAVORITES.GET_ALL, {
    params: { page, limit },
  });
  return response.data;
};

/**
 * Add movie to favorites
 * @param {Object} movieData - Movie data from TMDB
 * @returns {Promise}
 */
export const addFavorite = async (movieData) => {
  const response = await post(API_ENDPOINTS.FAVORITES.ADD, {
    id: movieData.id,
    title: movieData.title,
    poster_path: movieData.poster_path,
    overview: movieData.overview,
    release_date: movieData.release_date,
    vote_average: movieData.vote_average,
  });
  return response.data;
};

/**
 * Remove movie from favorites
 * @param {number} movieId - Movie ID
 * @returns {Promise}
 */
export const removeFavorite = async (movieId) => {
  const response = await del(API_ENDPOINTS.FAVORITES.REMOVE(movieId));
  return response.data;
};

/**
 * Check if movie is in favorites
 * @param {number} movieId - Movie ID
 * @returns {Promise}
 */
export const checkFavorite = async (movieId) => {
  const response = await get(API_ENDPOINTS.FAVORITES.CHECK(movieId));
  return response.data;
};

/**
 * Get favorite by movie ID
 * @param {number} movieId - Movie ID
 * @returns {Promise}
 */
export const getFavoriteByMovieId = async (movieId) => {
  const response = await get(`/favorites/movie/${movieId}`);
  return response.data;
};

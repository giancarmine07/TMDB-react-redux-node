/**
 * Movies Service
 * API calls for movies from TMDB (via backend proxy)
 */

import { get } from './api';
import { API_ENDPOINTS } from '../constants';

/**
 * Get popular movies
 * @param {number} page - Page number
 * @returns {Promise}
 */
export const getPopularMovies = async (page = 1) => {
  const response = await get(API_ENDPOINTS.MOVIES.POPULAR, {
    params: { page },
  });
  return response.data;
};

/**
 * Search movies by query
 * @param {string} query - Search query
 * @param {number} page - Page number
 * @returns {Promise}
 */
export const searchMovies = async (query, page = 1) => {
  const response = await get(API_ENDPOINTS.MOVIES.SEARCH, {
    params: { query, page },
  });
  return response.data;
};

/**
 * Get movie details by ID
 * @param {number} movieId - Movie ID
 * @returns {Promise}
 */
export const getMovieDetails = async (movieId) => {
  const response = await get(API_ENDPOINTS.MOVIES.DETAIL(movieId));
  return response.data;
};

/**
 * Get trending movies
 * @param {string} timeWindow - 'day' or 'week'
 * @returns {Promise}
 */
export const getTrendingMovies = async (timeWindow = 'week') => {
  const response = await get(API_ENDPOINTS.MOVIES.TRENDING, {
    params: { timeWindow },
  });
  return response.data;
};

/**
 * Get top rated movies
 * @param {number} page - Page number
 * @returns {Promise}
 */
export const getTopRatedMovies = async (page = 1) => {
  const response = await get(API_ENDPOINTS.MOVIES.TOP_RATED, {
    params: { page },
  });
  return response.data;
};

/**
 * Get now playing movies
 * @param {number} page - Page number
 * @returns {Promise}
 */
export const getNowPlayingMovies = async (page = 1) => {
  const response = await get('/movies/now-playing', {
    params: { page },
  });
  return response.data;
};

/**
 * Get upcoming movies
 * @param {number} page - Page number
 * @returns {Promise}
 */
export const getUpcomingMovies = async (page = 1) => {
  const response = await get('/movies/upcoming', {
    params: { page },
  });
  return response.data;
};

/**
 * Get movie genres
 * @returns {Promise}
 */
export const getGenres = async () => {
  const response = await get('/movies/genres');
  return response.data;
};

/**
 * Discover movies with filters
 * @param {Object} filters - Filter options
 * @returns {Promise}
 */
export const discoverMovies = async (filters = {}) => {
  const response = await get('/movies/discover', {
    params: filters,
  });
  return response.data;
};

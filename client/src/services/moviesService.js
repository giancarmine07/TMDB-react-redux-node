/**
 * Servizio Film
 * Chiamate API per i film da TMDB (tramite proxy backend)
 */

import { get } from './api';
import { API_ENDPOINTS } from '../constants';

/**
 * Ottiene i film popolari
 * @param {number} page - Numero di pagina
 * @returns {Promise}
 */
export const getPopularMovies = async (page = 1) => {
  const response = await get(API_ENDPOINTS.MOVIES.POPULAR, {
    params: { page },
  });
  return response.data;
};

/**
 * Cerca film per query
 * @param {string} query - Query di ricerca
 * @param {number} page - Numero di pagina
 * @returns {Promise}
 */
export const searchMovies = async (query, page = 1) => {
  const response = await get(API_ENDPOINTS.MOVIES.SEARCH, {
    params: { query, page },
  });
  return response.data;
};

/**
 * Ottiene i dettagli del film per ID
 * @param {number} movieId - ID del film
 * @returns {Promise}
 */
export const getMovieDetails = async (movieId) => {
  const response = await get(API_ENDPOINTS.MOVIES.DETAIL(movieId));
  return response.data;
};

/**
 * Ottiene i film di tendenza
 * @param {string} timeWindow - 'day' o 'week'
 * @returns {Promise}
 */
export const getTrendingMovies = async (timeWindow = 'week') => {
  const response = await get(API_ENDPOINTS.MOVIES.TRENDING, {
    params: { timeWindow },
  });
  return response.data;
};

/**
 * Ottiene i film più votati
 * @param {number} page - Numero di pagina
 * @returns {Promise}
 */
export const getTopRatedMovies = async (page = 1) => {
  const response = await get(API_ENDPOINTS.MOVIES.TOP_RATED, {
    params: { page },
  });
  return response.data;
};

/**
 * Ottiene i film ora al cinema
 * @param {number} page - Numero di pagina
 * @returns {Promise}
 */
export const getNowPlayingMovies = async (page = 1) => {
  const response = await get('/movies/now-playing', {
    params: { page },
  });
  return response.data;
};

/**
 * Ottiene i film in uscita
 * @param {number} page - Numero di pagina
 * @returns {Promise}
 */
export const getUpcomingMovies = async (page = 1) => {
  const response = await get('/movies/upcoming', {
    params: { page },
  });
  return response.data;
};

/**
 * Ottiene i generi dei film
 * @returns {Promise}
 */
export const getGenres = async () => {
  const response = await get('/movies/genres');
  return response.data;
};

/**
 * Scopri film con filtri
 * @param {Object} filters - Opzioni di filtro
 * @returns {Promise}
 */
export const discoverMovies = async (filters = {}) => {
  const response = await get('/movies/discover', {
    params: filters,
  });
  return response.data;
};

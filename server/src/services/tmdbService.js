/**
 * Servizio API TMDB
 * Gestisce tutte le interazioni con l'API The Movie Database
 */

const axios = require('axios');
const config = require('../config/config');
const { ExternalAPIError } = require('../utils/errors/AppError');

// Crea un'istanza axios per TMDB
const tmdbApi = axios.create({
  baseURL: config.tmdb.baseUrl,
  timeout: 10000,
  params: {
    api_key: config.tmdb.apiKey,
  },
});

/**
 * Ottiene i film popolari
 * @param {number} page - Numero di pagina
 * @returns {Promise<Object>} - Risposta TMDB con i film
 */
const getPopularMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/popular', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('TMDB API Error (popular):', error.message);
    throw new ExternalAPIError(
      `Failed to fetch popular movies: ${error.message}`,
      error.response?.status || 502
    );
  }
};

/**
 * Cerca film per query
 * @param {string} query - Query di ricerca
 * @param {number} page - Numero di pagina
 * @returns {Promise<Object>} - Risposta TMDB con i risultati della ricerca
 */
const searchMovies = async (query, page = 1) => {
  try {
    if (!query || query.trim() === '') {
      throw new Error('Search query is required');
    }

    const response = await tmdbApi.get('/search/movie', {
      params: { query, page },
    });
    return response.data;
  } catch (error) {
    console.error('TMDB API Error (search):', error.message);
    throw new ExternalAPIError(
      `Failed to search movies: ${error.message}`,
      error.response?.status || 502
    );
  }
};

/**
 * Get movie details by ID
 * @param {number} movieId - Movie ID from TMDB
 * @returns {Promise<Object>} - Detailed movie information
 */
const getMovieDetails = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'credits,videos,reviews',
      },
    });
    return response.data;
  } catch (error) {
    console.error('TMDB API Error (details):', error.message);
    if (error.response?.status === 404) {
      throw new ExternalAPIError('Movie not found', 404);
    }
    throw new ExternalAPIError(
      `Failed to fetch movie details: ${error.message}`,
      error.response?.status || 502
    );
  }
};

/**
 * Ottiene i film di tendenza
 * @param {string} timeWindow - 'day' o 'week'
 * @returns {Promise<Object>} - Risposta TMDB con i film di tendenza
 */
const getTrendingMovies = async (timeWindow = 'week') => {
  try {
    const validTimeWindows = ['day', 'week'];
    if (!validTimeWindows.includes(timeWindow)) {
      timeWindow = 'week';
    }

    const response = await tmdbApi.get(`/trending/movie/${timeWindow}`);
    return response.data;
  } catch (error) {
    console.error('TMDB API Error (trending):', error.message);
    throw new ExternalAPIError(
      `Failed to fetch trending movies: ${error.message}`,
      error.response?.status || 502
    );
  }
};

/**
 * Ottiene i film più votati
 * @param {number} page - Numero di pagina
 * @returns {Promise<Object>} - Risposta TMDB con i film più votati
 */
const getTopRatedMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/top_rated', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('TMDB API Error (top rated):', error.message);
    throw new ExternalAPIError(
      `Failed to fetch top rated movies: ${error.message}`,
      error.response?.status || 502
    );
  }
};

/**
 * Get now playing movies
 * @param {number} page - Page number
 * @returns {Promise<Object>} - TMDB response with now playing movies
 */
const getNowPlayingMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/now_playing', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('TMDB API Error (now playing):', error.message);
    throw new ExternalAPIError(
      `Failed to fetch now playing movies: ${error.message}`,
      error.response?.status || 502
    );
  }
};

/**
 * Get upcoming movies
 * @param {number} page - Page number
 * @returns {Promise<Object>} - TMDB response with upcoming movies
 */
const getUpcomingMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/upcoming', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('TMDB API Error (upcoming):', error.message);
    throw new ExternalAPIError(
      `Failed to fetch upcoming movies: ${error.message}`,
      error.response?.status || 502
    );
  }
};

/**
 * Get movie genres list
 * @returns {Promise<Object>} - TMDB response with genres
 */
const getGenres = async () => {
  try {
    const response = await tmdbApi.get('/genre/movie/list');
    return response.data;
  } catch (error) {
    console.error('TMDB API Error (genres):', error.message);
    throw new ExternalAPIError(
      `Failed to fetch genres: ${error.message}`,
      error.response?.status || 502
    );
  }
};

/**
 * Discover movies with filters
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} - TMDB response with filtered movies
 */
const discoverMovies = async (filters = {}) => {
  try {
    const response = await tmdbApi.get('/discover/movie', {
      params: filters,
    });
    return response.data;
  } catch (error) {
    console.error('TMDB API Error (discover):', error.message);
    throw new ExternalAPIError(
      `Failed to discover movies: ${error.message}`,
      error.response?.status || 502
    );
  }
};

module.exports = {
  getPopularMovies,
  searchMovies,
  getMovieDetails,
  getTrendingMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getGenres,
  discoverMovies,
};

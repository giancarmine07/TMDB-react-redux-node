/**
 * Controller Film
 * Gestisce le richieste relative ai film (proxy all'API TMDB)
 */

const tmdbService = require('../services/tmdbService');
const { catchAsync } = require('../middleware/errorHandler');
const { BadRequestError } = require('../utils/errors/AppError');

/**
 * Ottiene i film popolari
 * @route GET /api/movies/popular
 * @access Pubblico
 */
const getPopularMovies = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;

  if (page < 1) {
    throw new BadRequestError('Page number must be greater than 0');
  }

  const data = await tmdbService.getPopularMovies(page);

  res.status(200).json({
    success: true,
    data: {
      page: data.page,
      results: data.results,
      totalPages: data.total_pages,
      totalResults: data.total_results,
    },
  });
});

/**
 * Cerca film
 * @route GET /api/movies/search
 * @access Pubblico
 */
const searchMovies = catchAsync(async (req, res) => {
  const { query, page } = req.query;

  if (!query || query.trim() === '') {
    throw new BadRequestError('Search query is required');
  }

  const pageNumber = parseInt(page) || 1;

  if (pageNumber < 1) {
    throw new BadRequestError('Page number must be greater than 0');
  }

  const data = await tmdbService.searchMovies(query, pageNumber);

  res.status(200).json({
    success: true,
    data: {
      page: data.page,
      results: data.results,
      totalPages: data.total_pages,
      totalResults: data.total_results,
      query,
    },
  });
});

/**
 * Ottiene i dettagli del film
 * @route GET /api/movies/:id
 * @access Pubblico
 */
const getMovieDetails = catchAsync(async (req, res) => {
  const movieId = parseInt(req.params.id);

  if (!movieId || movieId < 1) {
    throw new BadRequestError('Invalid movie ID');
  }

  const data = await tmdbService.getMovieDetails(movieId);

  res.status(200).json({
    success: true,
    data,
  });
});

/**
 * Ottiene i film di tendenza
 * @route GET /api/movies/trending
 * @access Pubblico
 */
const getTrendingMovies = catchAsync(async (req, res) => {
  const timeWindow = req.query.timeWindow || 'week';

  const data = await tmdbService.getTrendingMovies(timeWindow);

  res.status(200).json({
    success: true,
    data: {
      results: data.results,
      page: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results,
    },
  });
});

/**
 * Ottiene i film più votati
 * @route GET /api/movies/top-rated
 * @access Pubblico
 */
const getTopRatedMovies = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;

  if (page < 1) {
    throw new BadRequestError('Page number must be greater than 0');
  }

  const data = await tmdbService.getTopRatedMovies(page);

  res.status(200).json({
    success: true,
    data: {
      page: data.page,
      results: data.results,
      totalPages: data.total_pages,
      totalResults: data.total_results,
    },
  });
});

/**
 * Get now playing movies
 * @route GET /api/movies/now-playing
 * @access Public
 */
const getNowPlayingMovies = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;

  if (page < 1) {
    throw new BadRequestError('Page number must be greater than 0');
  }

  const data = await tmdbService.getNowPlayingMovies(page);

  res.status(200).json({
    success: true,
    data: {
      page: data.page,
      results: data.results,
      totalPages: data.total_pages,
      totalResults: data.total_results,
    },
  });
});

/**
 * Get upcoming movies
 * @route GET /api/movies/upcoming
 * @access Public
 */
const getUpcomingMovies = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;

  if (page < 1) {
    throw new BadRequestError('Page number must be greater than 0');
  }

  const data = await tmdbService.getUpcomingMovies(page);

  res.status(200).json({
    success: true,
    data: {
      page: data.page,
      results: data.results,
      totalPages: data.total_pages,
      totalResults: data.total_results,
    },
  });
});

/**
 * Get movie genres
 * @route GET /api/movies/genres
 * @access Public
 */
const getGenres = catchAsync(async (req, res) => {
  const data = await tmdbService.getGenres();

  res.status(200).json({
    success: true,
    data: {
      genres: data.genres,
    },
  });
});

/**
 * Discover movies with filters
 * @route GET /api/movies/discover
 * @access Public
 */
const discoverMovies = catchAsync(async (req, res) => {
  const filters = {
    page: parseInt(req.query.page) || 1,
    with_genres: req.query.with_genres,
    primary_release_year: req.query.year,
    sort_by: req.query.sort_by || 'popularity.desc',
  };

  // Remove undefined values
  Object.keys(filters).forEach(
    (key) => filters[key] === undefined && delete filters[key]
  );

  const data = await tmdbService.discoverMovies(filters);

  res.status(200).json({
    success: true,
    data: {
      page: data.page,
      results: data.results,
      totalPages: data.total_pages,
      totalResults: data.total_results,
    },
  });
});

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

// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
  },
  // Movies
  MOVIES: {
    POPULAR: '/movies/popular',
    SEARCH: '/movies/search',
    DETAIL: (id) => `/movies/${id}`,
    TRENDING: '/movies/trending',
    TOP_RATED: '/movies/top-rated',
  },
  // Favorites
  FAVORITES: {
    GET_ALL: '/favorites',
    ADD: '/favorites',
    REMOVE: (movieId) => `/favorites/${movieId}`,
    CHECK: (movieId) => `/favorites/check/${movieId}`,
  },
  // Reviews
  REVIEWS: {
    GET_USER_REVIEWS: '/reviews/user',
    GET_MOVIE_REVIEWS: (movieId) => `/reviews/movie/${movieId}`,
    CREATE: '/reviews',
    UPDATE: (id) => `/reviews/${id}`,
    DELETE: (id) => `/reviews/${id}`,
  },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'movies_explorer_token',
  USER: 'movies_explorer_user',
  THEME: 'movies_explorer_theme',
  FILTERS: 'movies_explorer_filters',
};

// App Configuration
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'Movies Explorer',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  ENABLE_DARK_MODE: import.meta.env.VITE_ENABLE_DARK_MODE !== 'false',
  ENABLE_REVIEWS: import.meta.env.VITE_ENABLE_REVIEWS !== 'false',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  ITEMS_PER_PAGE: 20,
};

// Movie Genres (TMDB genre IDs)
export const MOVIE_GENRES = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

// Rating Constants
export const RATING = {
  MIN: 1,
  MAX: 5,
  STARS: [1, 2, 3, 4, 5],
};

// Toast Notification Types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Theme Options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

// Image Sizes (TMDB)
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
export const IMAGE_SIZES = {
  POSTER: {
    SMALL: '/w185',
    MEDIUM: '/w342',
    LARGE: '/w500',
    ORIGINAL: '/original',
  },
  BACKDROP: {
    SMALL: '/w300',
    MEDIUM: '/w780',
    LARGE: '/w1280',
    ORIGINAL: '/original',
  },
  PROFILE: {
    SMALL: '/w45',
    MEDIUM: '/w185',
    LARGE: '/h632',
    ORIGINAL: '/original',
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  GENERIC: 'An error occurred. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Welcome back!',
  REGISTER: 'Account created successfully!',
  LOGOUT: 'Logged out successfully.',
  FAVORITE_ADDED: 'Added to favorites!',
  FAVORITE_REMOVED: 'Removed from favorites.',
  REVIEW_CREATED: 'Review posted successfully!',
  REVIEW_UPDATED: 'Review updated successfully!',
  REVIEW_DELETED: 'Review deleted successfully.',
};

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  MOVIES: '/movies',
  MOVIE_DETAIL: '/movies/:id',
  FAVORITES: '/favorites',
  REVIEWS: '/reviews',
  PROFILE: '/profile',
  NOT_FOUND: '*',
};

// Form Validation Rules
export const VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 100,
  },
  REVIEW: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 1000,
  },
};

// Cache Durations (in milliseconds)
export const CACHE_DURATION = {
  MOVIES: 5 * 60 * 1000, // 5 minutes
  USER: 30 * 60 * 1000, // 30 minutes
  FAVORITES: 2 * 60 * 1000, // 2 minutes
};

// Debounce Delays (in milliseconds)
export const DEBOUNCE_DELAY = {
  SEARCH: 500,
  INPUT: 300,
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

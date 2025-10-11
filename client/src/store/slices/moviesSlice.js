/**
 * Slice Film
 * Slice Redux per i dati dei film dall'API TMDB
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as moviesService from '../../services/moviesService';
import { createErrorState, clearErrorState } from '../../utils/errors/errorHandler';
import { CACHE_DURATION } from '../../constants';

// Stato iniziale
const initialState = {
  popular: {
    results: [],
    page: 1,
    totalPages: 0,
    totalResults: 0,
    loading: false,
    error: null,
    lastFetch: null,
  },
  searchResults: {
    results: [],
    query: '',
    page: 1,
    totalPages: 0,
    totalResults: 0,
    loading: false,
    error: null,
  },
  trending: {
    results: [],
    loading: false,
    error: null,
    lastFetch: null,
  },
  topRated: {
    results: [],
    page: 1,
    totalPages: 0,
    loading: false,
    error: null,
  },
  selectedMovie: null,
  movieDetails: {},
  loading: false,
  error: null,
};

// Funzione helper per verificare se la cache è valida
const isCacheValid = (lastFetch) => {
  if (!lastFetch) return false;
  return Date.now() - lastFetch < CACHE_DURATION.MOVIES;
};

// Thunk asincroni
export const fetchPopularMovies = createAsyncThunk(
  'movies/fetchPopular',
  async (page = 1, { getState, rejectWithValue }) => {
    try {
      // Controlla la cache
      const state = getState().movies.popular;
      if (page === state.page && isCacheValid(state.lastFetch)) {
        return { cached: true };
      }

      const response = await moviesService.getPopularMovies(page);
      return { ...response.data, cached: false };
    } catch (error) {
      return rejectWithValue(createErrorState(error));
    }
  }
);

export const searchMovies = createAsyncThunk(
  'movies/search',
  async ({ query, page = 1 }, { rejectWithValue }) => {
    try {
      if (!query || query.trim() === '') {
        return rejectWithValue({ message: 'Search query is required' });
      }

      const response = await moviesService.searchMovies(query, page);
      return { ...response.data, query };
    } catch (error) {
      return rejectWithValue(createErrorState(error));
    }
  }
);

export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchDetails',
  async (movieId, { getState, rejectWithValue }) => {
    try {
      // Check if already in cache
      const cached = getState().movies.movieDetails[movieId];
      if (cached && isCacheValid(cached.lastFetch)) {
        return { movieId, cached: true };
      }

      const response = await moviesService.getMovieDetails(movieId);
      return { movieId, data: response.data, cached: false };
    } catch (error) {
      return rejectWithValue(createErrorState(error));
    }
  }
);

export const fetchTrendingMovies = createAsyncThunk(
  'movies/fetchTrending',
  async (_, { getState, rejectWithValue }) => {
    try {
      // Check cache
      const state = getState().movies.trending;
      if (isCacheValid(state.lastFetch)) {
        return { cached: true };
      }

      const response = await moviesService.getTrendingMovies();
      return { ...response.data, cached: false };
    } catch (error) {
      return rejectWithValue(createErrorState(error));
    }
  }
);

export const fetchTopRatedMovies = createAsyncThunk(
  'movies/fetchTopRated',
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await moviesService.getTopRatedMovies(page);
      return response.data;
    } catch (error) {
      return rejectWithValue(createErrorState(error));
    }
  }
);

// Slice
const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setSelectedMovie: (state, action) => {
      state.selectedMovie = action.payload;
    },
    clearSelectedMovie: (state) => {
      state.selectedMovie = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = {
        results: [],
        query: '',
        page: 1,
        totalPages: 0,
        totalResults: 0,
        loading: false,
        error: null,
      };
    },
    clearError: (state) => {
      state.error = clearErrorState();
      state.popular.error = null;
      state.searchResults.error = null;
      state.trending.error = null;
      state.topRated.error = null;
    },
    clearMovieCache: (state) => {
      state.popular.lastFetch = null;
      state.trending.lastFetch = null;
      state.movieDetails = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch popular movies
      .addCase(fetchPopularMovies.pending, (state) => {
        state.popular.loading = true;
        state.popular.error = null;
      })
      .addCase(fetchPopularMovies.fulfilled, (state, action) => {
        state.popular.loading = false;
        if (!action.payload.cached) {
          state.popular.results = action.payload.results;
          state.popular.page = action.payload.page;
          state.popular.totalPages = action.payload.totalPages;
          state.popular.totalResults = action.payload.totalResults;
          state.popular.lastFetch = Date.now();
        }
      })
      .addCase(fetchPopularMovies.rejected, (state, action) => {
        state.popular.loading = false;
        state.popular.error = action.payload;
      })
      // Search movies
      .addCase(searchMovies.pending, (state) => {
        state.searchResults.loading = true;
        state.searchResults.error = null;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.searchResults.loading = false;
        state.searchResults.results = action.payload.results;
        state.searchResults.query = action.payload.query;
        state.searchResults.page = action.payload.page;
        state.searchResults.totalPages = action.payload.totalPages;
        state.searchResults.totalResults = action.payload.totalResults;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.searchResults.loading = false;
        state.searchResults.error = action.payload;
      })
      // Fetch movie details
      .addCase(fetchMovieDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload.cached) {
          const { movieId, data } = action.payload;
          state.movieDetails[movieId] = {
            ...data,
            lastFetch: Date.now(),
          };
          state.selectedMovie = data;
        } else {
          const movieId = action.payload.movieId;
          state.selectedMovie = state.movieDetails[movieId];
        }
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch trending movies
      .addCase(fetchTrendingMovies.pending, (state) => {
        state.trending.loading = true;
        state.trending.error = null;
      })
      .addCase(fetchTrendingMovies.fulfilled, (state, action) => {
        state.trending.loading = false;
        if (!action.payload.cached) {
          state.trending.results = action.payload.results;
          state.trending.lastFetch = Date.now();
        }
      })
      .addCase(fetchTrendingMovies.rejected, (state, action) => {
        state.trending.loading = false;
        state.trending.error = action.payload;
      })
      // Fetch top rated movies
      .addCase(fetchTopRatedMovies.pending, (state) => {
        state.topRated.loading = true;
        state.topRated.error = null;
      })
      .addCase(fetchTopRatedMovies.fulfilled, (state, action) => {
        state.topRated.loading = false;
        state.topRated.results = action.payload.results;
        state.topRated.page = action.payload.page;
        state.topRated.totalPages = action.payload.totalPages;
      })
      .addCase(fetchTopRatedMovies.rejected, (state, action) => {
        state.topRated.loading = false;
        state.topRated.error = action.payload;
      });
  },
});

export const {
  setSelectedMovie,
  clearSelectedMovie,
  clearSearchResults,
  clearError,
  clearMovieCache,
} = moviesSlice.actions;

// Selectors
export const selectMovies = (state) => state.movies;
export const selectPopularMovies = (state) => state.movies.popular.results;
export const selectPopularLoading = (state) => state.movies.popular.loading;
export const selectSearchResults = (state) => state.movies.searchResults.results;
export const selectSearchQuery = (state) => state.movies.searchResults.query;
export const selectSearchLoading = (state) => state.movies.searchResults.loading;
export const selectTrendingMovies = (state) => state.movies.trending.results;
export const selectTrendingLoading = (state) => state.movies.trending.loading;
export const selectTopRatedMovies = (state) => state.movies.topRated.results;
export const selectSelectedMovie = (state) => state.movies.selectedMovie;
export const selectMovieDetails = (movieId) => (state) => state.movies.movieDetails[movieId];
export const selectMoviesLoading = (state) => state.movies.loading;
export const selectMoviesError = (state) => state.movies.error;

export default moviesSlice.reducer;

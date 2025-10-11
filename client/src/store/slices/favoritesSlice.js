/**
 * Favorites Slice
 * Redux slice for user's favorite movies
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as favoritesService from '../../services/favoritesService';
import { createErrorState, clearErrorState } from '../../utils/errors/errorHandler';

// Initial state
const initialState = {
  items: [],
  loading: false,
  error: null,
  addingFavorite: false,
  removingFavorite: null, // movieId being removed
  totalCount: 0,
  page: 1,
  totalPages: 0,
};

// Async thunks
export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const response = await favoritesService.getFavorites(page, limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(createErrorState(error));
    }
  }
);

export const addFavorite = createAsyncThunk(
  'favorites/addFavorite',
  async (movieData, { rejectWithValue }) => {
    try {
      const response = await favoritesService.addFavorite(movieData);
      return response.data;
    } catch (error) {
      return rejectWithValue(createErrorState(error));
    }
  }
);

export const removeFavorite = createAsyncThunk(
  'favorites/removeFavorite',
  async (movieId, { rejectWithValue }) => {
    try {
      await favoritesService.removeFavorite(movieId);
      return movieId;
    } catch (error) {
      return rejectWithValue(createErrorState(error));
    }
  }
);

export const checkFavorite = createAsyncThunk(
  'favorites/checkFavorite',
  async (movieId, { rejectWithValue }) => {
    try {
      const response = await favoritesService.checkFavorite(movieId);
      return { movieId, isFavorite: response.data.isFavorite };
    } catch (error) {
      return rejectWithValue(createErrorState(error));
    }
  }
);

// Slice
const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    // Optimistic add
    optimisticAddFavorite: (state, action) => {
      const movie = action.payload;
      // Check if not already in favorites
      const exists = state.items.find((item) => item.movie_id === movie.id);
      if (!exists) {
        state.items.unshift({
          movie_id: movie.id,
          movie_title: movie.title,
          movie_poster: movie.poster_path,
          movie_overview: movie.overview,
          movie_release_date: movie.release_date,
          movie_vote_average: movie.vote_average,
          added_at: new Date().toISOString(),
          optimistic: true,
        });
        state.totalCount += 1;
      }
    },
    // Optimistic remove
    optimisticRemoveFavorite: (state, action) => {
      const movieId = action.payload;
      state.items = state.items.filter((item) => item.movie_id !== movieId);
      state.totalCount = Math.max(0, state.totalCount - 1);
    },
    clearError: (state) => {
      state.error = clearErrorState();
    },
    clearFavorites: (state) => {
      state.items = [];
      state.totalCount = 0;
      state.page = 1;
      state.totalPages = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.favorites;
        state.page = action.payload.pagination.page;
        state.totalCount = action.payload.pagination.totalCount;
        state.totalPages = action.payload.pagination.totalPages;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add favorite
      .addCase(addFavorite.pending, (state) => {
        state.addingFavorite = true;
        state.error = null;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.addingFavorite = false;
        const favorite = action.payload.favorite;

        // Remove optimistic entry if exists
        state.items = state.items.filter(
          (item) => !(item.movie_id === favorite.movie_id && item.optimistic)
        );

        // Add real favorite at the beginning
        state.items.unshift(favorite);
        state.totalCount += 1;
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.addingFavorite = false;
        state.error = action.payload;

        // Remove optimistic entry on error
        state.items = state.items.filter((item) => !item.optimistic);
      })
      // Remove favorite
      .addCase(removeFavorite.pending, (state, action) => {
        state.removingFavorite = action.meta.arg;
        state.error = null;
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.removingFavorite = null;
        const movieId = action.payload;
        state.items = state.items.filter((item) => item.movie_id !== movieId);
        state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.removingFavorite = null;
        state.error = action.payload;

        // Revert optimistic remove if needed
        // In this case, we should refetch to ensure consistency
      });
  },
});

export const {
  optimisticAddFavorite,
  optimisticRemoveFavorite,
  clearError,
  clearFavorites,
} = favoritesSlice.actions;

// Selectors
export const selectFavorites = (state) => state.favorites;
export const selectFavoritesList = (state) => state.favorites.items;
export const selectFavoritesLoading = (state) => state.favorites.loading;
export const selectFavoritesError = (state) => state.favorites.error;
export const selectAddingFavorite = (state) => state.favorites.addingFavorite;
export const selectRemovingFavorite = (state) => state.favorites.removingFavorite;
export const selectFavoritesCount = (state) => state.favorites.totalCount;
export const selectIsFavorite = (movieId) => (state) =>
  state.favorites.items.some((item) => item.movie_id === movieId);

export default favoritesSlice.reducer;

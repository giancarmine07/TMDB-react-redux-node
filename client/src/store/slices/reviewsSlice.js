/**
 * Slice Recensioni
 * Slice Redux per le recensioni dei film
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as reviewsService from '../../services/reviewsService';
import { createErrorState, clearErrorState } from '../../utils/errors/errorHandler';

// Stato iniziale
const initialState = {
  userReviews: [],
  movieReviews: {},
  loading: false,
  error: null,
  submittingReview: false,
  updatingReview: null,
  deletingReview: null,
};

// Thunk asincroni
export const fetchUserReviews = createAsyncThunk(
  'reviews/fetchUserReviews',
  async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const response = await reviewsService.getUserReviews(page, limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(createErrorState(error));
    }
  }
);

export const fetchMovieReviews = createAsyncThunk(
  'reviews/fetchMovieReviews',
  async ({ movieId, page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await reviewsService.getMovieReviews(movieId, page, limit);
      return { movieId, data: response.data };
    } catch (error) {
      return rejectWithValue(createErrorState(error));
    }
  }
);

export const createReview = createAsyncThunk(
  'reviews/createReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await reviewsService.createReview(reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(createErrorState(error));
    }
  }
);

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ reviewId, rating, comment }, { rejectWithValue }) => {
    try {
      const response = await reviewsService.updateReview(reviewId, rating, comment);
      return response.data;
    } catch (error) {
      return rejectWithValue(createErrorState(error));
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      await reviewsService.deleteReview(reviewId);
      return reviewId;
    } catch (error) {
      return rejectWithValue(createErrorState(error));
    }
  }
);

// Slice
const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = clearErrorState();
    },
    clearMovieReviews: (state, action) => {
      const movieId = action.payload;
      delete state.movieReviews[movieId];
    },
    clearAllReviews: (state) => {
      state.userReviews = [];
      state.movieReviews = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Recupera recensioni utente
      .addCase(fetchUserReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.userReviews = action.payload.reviews;
      })
      .addCase(fetchUserReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Recupera recensioni film
      .addCase(fetchMovieReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieReviews.fulfilled, (state, action) => {
        state.loading = false;
        const { movieId, data } = action.payload;
        state.movieReviews[movieId] = {
          reviews: data.reviews,
          averageRating: data.averageRating,
          totalCount: data.pagination.totalCount,
          page: data.pagination.page,
          totalPages: data.pagination.totalPages,
        };
      })
      .addCase(fetchMovieReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Crea recensione
      .addCase(createReview.pending, (state) => {
        state.submittingReview = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.submittingReview = false;
        const review = action.payload.review;

        // Aggiungi alle recensioni utente
        state.userReviews.unshift(review);

        // Aggiungi alle recensioni del film se caricate
        const movieId = review.movie_id;
        if (state.movieReviews[movieId]) {
          state.movieReviews[movieId].reviews.unshift(review);
          state.movieReviews[movieId].totalCount += 1;
        }
      })
      .addCase(createReview.rejected, (state, action) => {
        state.submittingReview = false;
        state.error = action.payload;
      })
      // Aggiorna recensione
      .addCase(updateReview.pending, (state, action) => {
        state.updatingReview = action.meta.arg.reviewId;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.updatingReview = null;
        const updatedReview = action.payload.review;

        // Aggiorna nelle recensioni utente
        const userIndex = state.userReviews.findIndex((r) => r.id === updatedReview.id);
        if (userIndex !== -1) {
          state.userReviews[userIndex] = updatedReview;
        }

        // Aggiorna nelle recensioni del film
        const movieId = updatedReview.movie_id;
        if (state.movieReviews[movieId]) {
          const movieIndex = state.movieReviews[movieId].reviews.findIndex(
            (r) => r.id === updatedReview.id
          );
          if (movieIndex !== -1) {
            state.movieReviews[movieId].reviews[movieIndex] = updatedReview;
          }
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.updatingReview = null;
        state.error = action.payload;
      })
      // Elimina recensione
      .addCase(deleteReview.pending, (state, action) => {
        state.deletingReview = action.meta.arg;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.deletingReview = null;
        const reviewId = action.payload;

        // Trova e rimuovi dalle recensioni utente
        const userReview = state.userReviews.find((r) => r.id === reviewId);
        state.userReviews = state.userReviews.filter((r) => r.id !== reviewId);

        // Rimuovi dalle recensioni del film se esistono
        if (userReview) {
          const movieId = userReview.movie_id;
          if (state.movieReviews[movieId]) {
            state.movieReviews[movieId].reviews = state.movieReviews[movieId].reviews.filter(
              (r) => r.id !== reviewId
            );
            state.movieReviews[movieId].totalCount = Math.max(
              0,
              state.movieReviews[movieId].totalCount - 1
            );
          }
        }
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.deletingReview = null;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearMovieReviews, clearAllReviews } = reviewsSlice.actions;

// Selettori
export const selectReviews = (state) => state.reviews;
export const selectUserReviews = (state) => state.reviews.userReviews;
export const selectMovieReviews = (movieId) => (state) =>
  state.reviews.movieReviews[movieId]?.reviews || [];
export const selectMovieAverageRating = (movieId) => (state) =>
  state.reviews.movieReviews[movieId]?.averageRating || 0;
export const selectMovieReviewsCount = (movieId) => (state) =>
  state.reviews.movieReviews[movieId]?.totalCount || 0;
export const selectReviewsLoading = (state) => state.reviews.loading;
export const selectReviewsError = (state) => state.reviews.error;
export const selectSubmittingReview = (state) => state.reviews.submittingReview;
export const selectUpdatingReview = (state) => state.reviews.updatingReview;
export const selectDeletingReview = (state) => state.reviews.deletingReview;
export const selectUserReviewForMovie = (movieId) => (state) =>
  state.reviews.userReviews.find((review) => review.movie_id === movieId);

export default reviewsSlice.reducer;

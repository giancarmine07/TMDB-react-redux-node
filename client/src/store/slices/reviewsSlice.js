/**
 * Reviews Slice
 * Redux slice for movie reviews
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as reviewsService from '../../services/reviewsService';
import { createErrorState, clearErrorState } from '../../utils/errors/errorHandler';

// Initial state
const initialState = {
  userReviews: [],
  movieReviews: {},
  loading: false,
  error: null,
  submittingReview: false,
  updatingReview: null,
  deletingReview: null,
};

// Async thunks
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
      // Fetch user reviews
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
      // Fetch movie reviews
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
      // Create review
      .addCase(createReview.pending, (state) => {
        state.submittingReview = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.submittingReview = false;
        const review = action.payload.review;

        // Add to user reviews
        state.userReviews.unshift(review);

        // Add to movie reviews if loaded
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
      // Update review
      .addCase(updateReview.pending, (state, action) => {
        state.updatingReview = action.meta.arg.reviewId;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.updatingReview = null;
        const updatedReview = action.payload.review;

        // Update in user reviews
        const userIndex = state.userReviews.findIndex((r) => r.id === updatedReview.id);
        if (userIndex !== -1) {
          state.userReviews[userIndex] = updatedReview;
        }

        // Update in movie reviews
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
      // Delete review
      .addCase(deleteReview.pending, (state, action) => {
        state.deletingReview = action.meta.arg;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.deletingReview = null;
        const reviewId = action.payload;

        // Find and remove from user reviews
        const userReview = state.userReviews.find((r) => r.id === reviewId);
        state.userReviews = state.userReviews.filter((r) => r.id !== reviewId);

        // Remove from movie reviews if exists
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

// Selectors
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

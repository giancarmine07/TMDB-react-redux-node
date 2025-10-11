/**
 * Redux Store Configuration
 * Main store setup with all slices and middleware
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import moviesReducer from './slices/moviesSlice';
import favoritesReducer from './slices/favoritesSlice';
import reviewsReducer from './slices/reviewsSlice';
import uiReducer from './slices/uiSlice';

// Create store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: moviesReducer,
    favorites: favoritesReducer,
    reviews: reviewsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/setCredentials', 'ui/showToast'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['ui.toast.id'],
      },
    }),
  devTools: import.meta.env.DEV,
});

// Export types for TypeScript (if needed in the future)
export default store;

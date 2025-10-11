# 💻 Code Examples - Implementation Guide

This document provides code examples for implementing the remaining features of the Movies Explorer application.

---

## 📁 Backend Examples

### 1. TMDB Service (`server/src/services/tmdbService.js`)

```javascript
const axios = require('axios');
const config = require('../config/config');
const { ExternalAPIError } = require('../utils/errors/AppError');

/**
 * TMDB API Service
 * Handles all interactions with The Movie Database API
 */

// Create axios instance for TMDB
const tmdbApi = axios.create({
  baseURL: config.tmdb.baseUrl,
  timeout: 10000,
  params: {
    api_key: config.tmdb.apiKey,
  },
});

/**
 * Get popular movies
 */
const getPopularMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/popular', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    throw new ExternalAPIError(
      `Failed to fetch popular movies: ${error.message}`,
      error.response?.status || 502
    );
  }
};

/**
 * Search movies by query
 */
const searchMovies = async (query, page = 1) => {
  try {
    const response = await tmdbApi.get('/search/movie', {
      params: { query, page },
    });
    return response.data;
  } catch (error) {
    throw new ExternalAPIError(
      `Failed to search movies: ${error.message}`,
      error.response?.status || 502
    );
  }
};

/**
 * Get movie details by ID
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
    throw new ExternalAPIError(
      `Failed to fetch movie details: ${error.message}`,
      error.response?.status || 502
    );
  }
};

/**
 * Get trending movies
 */
const getTrendingMovies = async (timeWindow = 'week') => {
  try {
    const response = await tmdbApi.get(`/trending/movie/${timeWindow}`);
    return response.data;
  } catch (error) {
    throw new ExternalAPIError(
      `Failed to fetch trending movies: ${error.message}`,
      error.response?.status || 502
    );
  }
};

module.exports = {
  getPopularMovies,
  searchMovies,
  getMovieDetails,
  getTrendingMovies,
};
```

---

### 2. Auth Controller (`server/src/controllers/authController.js`)

```javascript
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const { generateToken } = require('../middleware/authMiddleware');
const { catchAsync } = require('../middleware/errorHandler');
const {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
} = require('../utils/errors/AppError');

/**
 * Register new user
 */
const register = catchAsync(async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input
  if (!username || !email || !password) {
    throw new BadRequestError('Username, email, and password are required');
  }

  // Check if user already exists
  const existingEmail = await userModel.findUserByEmail(email);
  if (existingEmail) {
    throw new ConflictError('Email already registered');
  }

  const existingUsername = await userModel.findUserByUsername(username);
  if (existingUsername) {
    throw new ConflictError('Username already taken');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create user
  const user = await userModel.createUser(username, email, passwordHash);

  // Generate token
  const token = generateToken(user);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    },
  });
});

/**
 * Login user
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    throw new BadRequestError('Email and password are required');
  }

  // Find user by email
  const user = await userModel.findUserByEmail(email);
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Generate token
  const token = generateToken(user);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    },
  });
});

/**
 * Get current user
 */
const getCurrentUser = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const user = await userModel.findUserById(userId);
  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  // Get user stats
  const stats = await userModel.getUserStats(userId);

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at,
      },
      stats,
    },
  });
});

module.exports = {
  register,
  login,
  getCurrentUser,
};
```

---

### 3. Auth Routes (`server/src/routes/authRoutes.js`)

```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', verifyToken, authController.getCurrentUser);

module.exports = router;
```

---

## 🎨 Frontend Examples

### 1. Redux Auth Slice (`client/src/store/slices/authSlice.js`)

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../../services/authService';
import { STORAGE_KEYS } from '../../constants';
import { createErrorState, clearErrorState } from '../../utils/errors/errorHandler';

// Initial state
const initialState = {
  user: JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)) || null,
  token: localStorage.getItem(STORAGE_KEYS.TOKEN) || null,
  isAuthenticated: !!localStorage.getItem(STORAGE_KEYS.TOKEN),
  loading: false,
  error: null,
};

// Async thunks
export const register = createAsyncThunk(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.register(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(createErrorState(error));
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(createErrorState(error));
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response.data;
    } catch (error) {
      return rejectWithValue(createErrorState(error));
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    },
    clearError: (state) => {
      state.error = clearErrorState();
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload.user));
        localStorage.setItem(STORAGE_KEYS.TOKEN, action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload.user));
        localStorage.setItem(STORAGE_KEYS.TOKEN, action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Auto logout on auth error
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setCredentials, logout, clearError } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
```

---

### 2. Redux Store Configuration (`client/src/store/store.js`)

```javascript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import moviesReducer from './slices/moviesSlice';
import favoritesReducer from './slices/favoritesSlice';
import reviewsReducer from './slices/reviewsSlice';
import uiReducer from './slices/uiSlice';

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
        ignoredActions: ['auth/setCredentials'],
      },
    }),
  devTools: import.meta.env.DEV,
});

export default store;
```

---

### 3. Auth Service (`client/src/services/authService.js`)

```javascript
import { post, get } from './api';
import { API_ENDPOINTS } from '../constants';

/**
 * Register new user
 */
export const register = async ({ username, email, password }) => {
  const response = await post(API_ENDPOINTS.AUTH.REGISTER, {
    username,
    email,
    password,
  });
  return response.data;
};

/**
 * Login user
 */
export const login = async ({ email, password }) => {
  const response = await post(API_ENDPOINTS.AUTH.LOGIN, {
    email,
    password,
  });
  return response.data;
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  const response = await get(API_ENDPOINTS.AUTH.ME);
  return response.data;
};

/**
 * Logout user (client-side)
 */
export const logout = () => {
  // Clear token and user data
  localStorage.removeItem('movies_explorer_token');
  localStorage.removeItem('movies_explorer_user');
};
```

---

### 4. Login Form Component (`client/src/components/auth/LoginForm.jsx`)

```javascript
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, selectAuthLoading, selectAuthError } from '../../store/slices/authSlice';
import Button from '../common/Button';
import Input from '../common/Input';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await dispatch(login(formData));
    
    if (login.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-dark-800 shadow-card rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Welcome Back
        </h2>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
            {error.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
```

---

### 5. Button Component (`client/src/components/common/Button.jsx`)

```javascript
import clsx from 'clsx';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 disabled:bg-gray-400',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500 dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 disabled:bg-gray-400',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 dark:hover:bg-dark-800 dark:text-gray-300',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
```

---

### 6. Input Component (`client/src/components/common/Input.jsx`)

```javascript
import clsx from 'clsx';

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={clsx(
          'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all',
          'bg-white dark:bg-dark-800 text-gray-900 dark:text-white',
          'border-gray-300 dark:border-dark-600',
          'placeholder-gray-400 dark:placeholder-gray-500',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;
```

---

### 7. Main App Component (`client/src/App.jsx`)

```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MovieDetailPage from './pages/MovieDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import ReviewsPage from './pages/ReviewsPage';
import NotFoundPage from './pages/NotFoundPage';
import { getCurrentUser, selectIsAuthenticated } from './store/slices/authSlice';
import { ROUTES } from './constants';

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Check authentication on app load
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.MOVIE_DETAIL} element={<MovieDetailPage />} />
          
          {/* Protected Routes */}
          <Route
            path={ROUTES.FAVORITES}
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.REVIEWS}
            element={
              <ProtectedRoute>
                <ReviewsPage />
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
```

---

### 8. Main Entry Point (`client/src/main.jsx`)

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

---

### 9. Global Styles (`client/src/styles/index.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 dark:bg-dark-950 text-gray-900 dark:text-white transition-colors;
  }

  * {
    @apply transition-colors duration-200;
  }
}

@layer components {
  /* Custom scrollbar */
  .custom-scrollbar::-webkit-scrollbar {
    @apply w-2;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    @apply bg-gray-100 dark:bg-dark-900;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-gray-300 dark:bg-dark-700 rounded-full;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    @apply bg-gray-400 dark:bg-dark-600;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

---

## 🧪 Testing Examples

### Backend Test Example (`server/__tests__/controllers/authController.test.js`)

```javascript
const request = require('supertest');
const app = require('../../src/server');
const userModel = require('../../src/models/userModel');

describe('Auth Controller', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.token).toBeDefined();
    });

    it('should return error for duplicate email', async () => {
      const userData = {
        username: 'testuser2',
        email: 'existing@example.com',
        password: 'password123',
      };

      // First registration
      await request(app).post('/api/auth/register').send(userData);

      // Duplicate registration
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body.success).toBe(false);
    });
  });
});
```

---

### Frontend Test Example (`client/__tests__/components/LoginForm.test.js`)

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import LoginForm from '../../src/components/auth/LoginForm';
import authReducer from '../../src/store/slices/authSlice';

const mockStore = configureStore({
  reducer: {
    auth: authReducer,
  },
});

const renderWithProviders = (component) => {
  return render(
    <Provider store={mockStore}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe('LoginForm', () => {
  it('renders login form', () => {
    renderWithProviders(<LoginForm />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('updates input values on change', () => {
    renderWithProviders(<LoginForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });
});
```

---

## 🎯 Key Implementation Tips

1. **Always use try-catch** in async functions
2. **Validate input** on both frontend and backend
3. **Handle loading states** for better UX
4. **Show error messages** in user-friendly format
5. **Use optimistic updates** for instant feedback
6. **Cache API responses** to reduce network calls
7. **Clean up side effects** in useEffect
8. **Use proper HTTP status codes**
9. **Log errors** in development
10. **Test critical paths** thoroughly

---

## 📚 Additional Resources

- **Redux Toolkit Docs**: https://redux-toolkit.js.org/
- **React Router Docs**: https://reactrouter.com/
- **Tailwind CSS Docs**: https://tailwindcss.com/
- **TMDB API Docs**: https://developers.themoviedb.org/3
- **Jest Docs**: https://jestjs.io/
- **Testing Library**: https://testing-library.com/

---

**Happy Coding! 🚀**
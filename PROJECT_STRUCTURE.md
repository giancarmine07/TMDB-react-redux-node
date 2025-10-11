# 🎬 Movies Explorer - Project Structure

## 📁 Complete Directory Tree

```
movies-explorer/
├── client/                                 # React Frontend Application
│   ├── public/                            # Static assets
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/                    # React Components
│   │   │   ├── common/                    # Reusable UI components
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Loading.jsx
│   │   │   │   ├── Toast.jsx
│   │   │   │   └── ErrorBoundary.jsx
│   │   │   ├── auth/                      # Authentication components
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── movies/                    # Movie-related components
│   │   │   │   ├── MovieCard.jsx
│   │   │   │   ├── MovieList.jsx
│   │   │   │   ├── MovieDetail.jsx
│   │   │   │   ├── MovieSearch.jsx
│   │   │   │   ├── MovieFilters.jsx
│   │   │   │   └── FavoriteButton.jsx
│   │   │   └── layout/                    # Layout components
│   │   │       ├── Header.jsx
│   │   │       ├── Footer.jsx
│   │   │       ├── Sidebar.jsx
│   │   │       ├── Layout.jsx
│   │   │       └── ThemeToggle.jsx
│   │   ├── pages/                         # Page components (routes)
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── MovieDetailPage.jsx
│   │   │   ├── FavoritesPage.jsx
│   │   │   ├── ReviewsPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── store/                         # Redux Store Configuration
│   │   │   ├── store.js                   # Store setup
│   │   │   ├── slices/                    # Redux slices
│   │   │   │   ├── authSlice.js          # User authentication state
│   │   │   │   ├── moviesSlice.js        # Movies data from API
│   │   │   │   ├── favoritesSlice.js     # User favorites
│   │   │   │   ├── reviewsSlice.js       # User reviews
│   │   │   │   └── uiSlice.js            # UI state (theme, modals, etc)
│   │   │   └── middleware/                # Custom Redux middleware
│   │   │       ├── errorLogger.js
│   │   │       └── cacheMiddleware.js
│   │   ├── services/                      # API Service Layer
│   │   │   ├── api.js                     # Axios instance with interceptors
│   │   │   ├── authService.js             # Auth API calls
│   │   │   ├── moviesService.js           # Movies API calls
│   │   │   ├── favoritesService.js        # Favorites API calls
│   │   │   └── reviewsService.js          # Reviews API calls
│   │   ├── hooks/                         # Custom React Hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useDebounce.js
│   │   │   ├── useLocalStorage.js
│   │   │   ├── useTheme.js
│   │   │   └── useToast.js
│   │   ├── utils/                         # Utility functions
│   │   │   ├── errors/
│   │   │   │   └── errorHandler.js        # Error handling utilities
│   │   │   ├── validation.js              # Form validation helpers
│   │   │   ├── formatters.js              # Data formatting utilities
│   │   │   └── helpers.js                 # General helper functions
│   │   ├── constants/                     # Constants and configuration
│   │   │   └── index.js                   # API endpoints, routes, etc.
│   │   ├── styles/                        # Global styles
│   │   │   └── index.css                  # Tailwind imports & globals
│   │   ├── App.jsx                        # Main App component
│   │   ├── main.jsx                       # React entry point
│   │   └── setupTests.js                  # Jest setup
│   ├── __tests__/                         # Test files
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── utils/
│   ├── .babelrc                           # Babel configuration
│   ├── .env.example                       # Environment variables template
│   ├── index.html                         # HTML entry point
│   ├── package.json                       # Dependencies & scripts
│   ├── postcss.config.js                  # PostCSS configuration
│   ├── tailwind.config.js                 # Tailwind CSS configuration
│   └── vite.config.js                     # Vite configuration
│
├── server/                                # Node.js Backend Application
│   ├── src/
│   │   ├── config/                        # Configuration files
│   │   │   ├── config.js                  # App configuration
│   │   │   └── database.js                # PostgreSQL connection pool
│   │   ├── controllers/                   # Route Controllers
│   │   │   ├── authController.js          # Auth logic (register/login)
│   │   │   ├── moviesController.js        # Movies proxy to TMDB
│   │   │   ├── favoritesController.js     # Favorites CRUD
│   │   │   └── reviewsController.js       # Reviews CRUD
│   │   ├── middleware/                    # Express Middleware
│   │   │   ├── authMiddleware.js          # JWT verification
│   │   │   ├── errorHandler.js            # Global error handler
│   │   │   └── validator.js               # Request validation
│   │   ├── models/                        # Database Models (SQL)
│   │   │   ├── userModel.js               # User queries
│   │   │   ├── favoriteModel.js           # Favorites queries
│   │   │   └── reviewModel.js             # Reviews queries
│   │   ├── routes/                        # API Routes
│   │   │   ├── authRoutes.js              # /api/auth/*
│   │   │   ├── moviesRoutes.js            # /api/movies/*
│   │   │   ├── favoritesRoutes.js         # /api/favorites/*
│   │   │   └── reviewsRoutes.js           # /api/reviews/*
│   │   ├── services/                      # Business Logic Services
│   │   │   ├── tmdbService.js             # TMDB API integration
│   │   │   └── authService.js             # Auth business logic
│   │   ├── utils/                         # Utility functions
│   │   │   ├── errors/
│   │   │   │   └── AppError.js            # Custom error classes
│   │   │   ├── validators.js              # Data validators
│   │   │   └── helpers.js                 # Helper functions
│   │   └── server.js                      # Express app entry point
│   ├── db/                                # Database files
│   │   └── init.sql                       # Database schema initialization
│   ├── __tests__/                         # Test files
│   │   ├── controllers/
│   │   ├── models/
│   │   └── services/
│   ├── .env.example                       # Environment variables template
│   └── package.json                       # Dependencies & scripts
│
├── docker-compose.yml                     # Docker Compose configuration
├── .gitignore                             # Git ignore rules
├── README.md                              # Project documentation
└── PROJECT_STRUCTURE.md                   # This file
```

## 🎯 Key Features by Package

### Frontend (`client/`)

#### **Redux Store Structure**
```javascript
{
  auth: {
    user: {...},
    token: '...',
    isAuthenticated: true,
    loading: false,
    error: null
  },
  movies: {
    popular: [...],
    searchResults: [...],
    selectedMovie: {...},
    loading: false,
    error: null,
    cache: {...}
  },
  favorites: {
    items: [...],
    loading: false,
    error: null
  },
  reviews: {
    userReviews: [...],
    movieReviews: {...},
    loading: false,
    error: null
  },
  ui: {
    theme: 'dark',
    sidebarOpen: false,
    modal: {...},
    toast: {...}
  }
}
```

#### **Component Organization**
- **common/**: Generic, reusable components (buttons, cards, modals)
- **auth/**: Authentication-specific components
- **movies/**: Movie display and interaction components
- **layout/**: Page structure components (header, footer, sidebar)

#### **Service Layer**
- Centralized API calls
- Error handling
- Request/response interceptors
- Token management

### Backend (`server/`)

#### **API Structure**
```
/api
  /auth
    POST   /register          - Register new user
    POST   /login             - Login user
    GET    /me                - Get current user (protected)
  
  /movies
    GET    /popular           - Get popular movies
    GET    /search?query=     - Search movies
    GET    /:id               - Get movie details
  
  /favorites
    GET    /                  - Get user's favorites (protected)
    POST   /                  - Add to favorites (protected)
    DELETE /:movieId          - Remove from favorites (protected)
  
  /reviews
    GET    /user              - Get user's reviews (protected)
    GET    /movie/:movieId    - Get reviews for a movie
    POST   /                  - Create review (protected)
    PUT    /:id               - Update review (protected)
    DELETE /:id               - Delete review (protected)
```

#### **Database Schema**

**users**
- id (SERIAL PRIMARY KEY)
- username (VARCHAR, UNIQUE)
- email (VARCHAR, UNIQUE)
- password_hash (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**favorites**
- id (SERIAL PRIMARY KEY)
- user_id (INTEGER, FK to users)
- movie_id (INTEGER)
- movie_title (VARCHAR)
- movie_poster (VARCHAR)
- movie_overview (TEXT)
- movie_release_date (VARCHAR)
- movie_vote_average (DECIMAL)
- added_at (TIMESTAMP)

**reviews**
- id (SERIAL PRIMARY KEY)
- user_id (INTEGER, FK to users)
- movie_id (INTEGER)
- movie_title (VARCHAR)
- rating (INTEGER, 1-5)
- comment (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

## 🔄 Data Flow

### Authentication Flow
```
1. User submits login form (LoginPage)
   ↓
2. authService.login() called
   ↓
3. POST /api/auth/login
   ↓
4. Backend validates credentials
   ↓
5. JWT token returned
   ↓
6. Token stored in localStorage
   ↓
7. authSlice updated in Redux
   ↓
8. User redirected to home page
```

### Movie Display Flow
```
1. HomePage component mounts
   ↓
2. useEffect fetches popular movies
   ↓
3. moviesService.getPopular() called
   ↓
4. GET /api/movies/popular
   ↓
5. Backend proxies to TMDB API
   ↓
6. Response cached in Redux
   ↓
7. MovieList renders MovieCard components
```

### Add to Favorites Flow
```
1. User clicks favorite button
   ↓
2. favoritesService.addFavorite() called
   ↓
3. POST /api/favorites (with auth token)
   ↓
4. Backend validates token
   ↓
5. Insert into favorites table
   ↓
6. Success response
   ↓
7. favoritesSlice updated (optimistic update)
   ↓
8. Toast notification shown
```

## 🧪 Testing Strategy

### Frontend Tests
- **Component Tests**: Test UI rendering and user interactions
- **Redux Tests**: Test actions, reducers, and selectors
- **Service Tests**: Test API calls and error handling
- **Hook Tests**: Test custom hooks behavior

### Backend Tests
- **Controller Tests**: Test request/response handling
- **Model Tests**: Test database queries
- **Service Tests**: Test business logic
- **Integration Tests**: Test complete API flows

## 🚀 Development Workflow

### Setup
```bash
# 1. Start PostgreSQL
docker-compose up -d

# 2. Install dependencies
cd server && npm install
cd ../client && npm install

# 3. Configure environment
cp server/.env.example server/.env
cp client/.env.example client/.env
# Edit .env files with your API keys

# 4. Start development servers
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

### Testing
```bash
# Backend tests
cd server && npm test

# Frontend tests
cd client && npm test

# Coverage reports
npm run test:coverage
```

## 📦 Package Responsibilities

### Frontend Packages

**Components Package** (`src/components/`)
- Pure presentational logic
- Reusable across the app
- No direct API calls (use props)
- Styled with Tailwind CSS

**Store Package** (`src/store/`)
- Global state management
- Redux slices for each domain
- Async thunks for API calls
- Selectors for derived state

**Services Package** (`src/services/`)
- API communication layer
- Error handling
- Request/response transformation
- Token management

**Utils Package** (`src/utils/`)
- Pure utility functions
- Error handlers
- Validators
- Formatters

### Backend Packages

**Controllers Package** (`src/controllers/`)
- Handle HTTP requests
- Validate input
- Call services
- Return responses

**Models Package** (`src/models/`)
- Database queries (raw SQL)
- Data access layer
- Query builders
- Database transactions

**Services Package** (`src/services/`)
- Business logic
- External API integration
- Data transformation
- Complex operations

**Middleware Package** (`src/middleware/`)
- Request processing
- Authentication
- Error handling
- Validation

**Utils Package** (`src/utils/`)
- Helper functions
- Custom error classes
- Constants
- Validators

## 🎨 Styling Architecture

### Tailwind CSS Approach
- Utility-first classes
- Custom theme configuration
- Dark mode support via `class` strategy
- Responsive design utilities

### Component Styling Pattern
```jsx
// Base classes + conditional classes
<button className={`
  base-classes
  ${conditionalClass && 'conditional-classes'}
  ${variant === 'primary' ? 'primary-classes' : 'secondary-classes'}
`}>
  Button
</button>
```

## 🔐 Security Measures

### Frontend
- JWT token in localStorage
- Automatic token injection in requests
- Token expiry handling
- Protected routes
- Input validation

### Backend
- JWT authentication
- Password hashing (bcrypt)
- SQL injection prevention (parameterized queries)
- CORS configuration
- Helmet security headers
- Input validation (express-validator)
- Rate limiting (future)

## 📊 Performance Optimizations

### Frontend
- Redux cache with expiration
- Lazy loading routes (future)
- Image optimization
- Debounced search
- Memoized selectors
- Optimistic updates

### Backend
- Database connection pooling
- Query optimization with indexes
- Response compression
- Request timeout handling
- Caching strategies (future)

## 🛠️ Tools & Technologies

### Frontend
- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Jest + RTL** - Testing

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **PostgreSQL** - Database
- **pg** - PostgreSQL client
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Jest + Supertest** - Testing

### DevOps
- **Docker** - Database containerization
- **Docker Compose** - Multi-container management

---

**Note**: This structure is designed to be modular, scalable, and maintainable. Each package has a clear responsibility and can be developed/tested independently.
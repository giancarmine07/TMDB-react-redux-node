# 🎬 Movies Explorer - Project Summary

## 📊 Project Overview

**Movies Explorer** is a full-stack web application that allows users to explore movies, save favorites, and write reviews. This project demonstrates proficiency in modern web development technologies including React, Redux, Node.js, Express, and PostgreSQL.

---

## 🎯 Purpose

This project is designed as a **portfolio piece** to showcase:
- ✅ Full-stack development skills
- ✅ Redux state management expertise
- ✅ RESTful API design
- ✅ Database design and raw SQL queries
- ✅ Error handling best practices
- ✅ Testing capabilities
- ✅ Docker containerization
- ✅ Clean, maintainable code architecture

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Redux Toolkit** - Predictable state management
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool
- **Jest + React Testing Library** - Testing framework

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **pg** - PostgreSQL client (raw SQL)
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing
- **Jest + Supertest** - Testing framework

### DevOps & Tools
- **Docker + Docker Compose** - Database containerization
- **TMDB API** - Movie data source (
free tier)
- **Git** - Version control

---

## ✨ Key Features (MVP + Enhancements)

### Core Features
1. **User Authentication**
   - Register with username, email, password
   - Login with JWT token
   - Protected routes
   - Token persistence in localStorage

2. **Movie Browsing**
   - View popular movies
   - Search movies by title
   - View detailed movie information
   - Movie posters and metadata from TMDB

3. **Favorites System**
   - Add/remove movies to favorites
   - Persist favorites in PostgreSQL
   - View all saved favorites
   - Optimistic UI updates

4. **Reviews & Ratings**
   - Write reviews for movies
   - Rate movies (1-5 stars)
   - Edit/delete own reviews
   - View reviews from other users
   - CRUD operations with database

### Enhanced Features
5. **Dark Mode**
   - Toggle between light/dark themes
   - Persist theme preference
   - Smooth transitions

6. **Error Handling**
   - Comprehensive error handling on frontend
   - Custom error classes on backend
   - User-friendly error messages
   - Network error handling
   - Validation errors with detailed feedback

7. **Responsive Design**
   - Mobile-first approach
   - Works on all screen sizes
   - Tailwind CSS utilities

---

## 🏗️ Architecture Highlights

### Backend Architecture
```
Client Request
    ↓
Express Middleware (CORS, Helmet, Compression)
    ↓
Route Handler
    ↓
Validation Middleware
    ↓
Authentication Middleware (JWT)
    ↓
Controller (Request Handling)
    ↓
Service Layer (Business Logic)
    ↓
Model (Database Queries - Raw SQL)
    ↓
PostgreSQL Database
    ↓
Response with Error Handling
```

### Frontend Architecture
```
User Interaction
    ↓
React Component
    ↓
Dispatch Redux Action (Async Thunk)
    ↓
API Service Layer (Axios)
    ↓
HTTP Request to Backend
    ↓
Response Interceptor
    ↓
Redux Reducer Updates State
    ↓
Component Re-renders
    ↓
UI Updates (with Loading/Error States)
```

### Redux State Shape
```javascript
{
  auth: {
    user: { id, username, email },
    token: 'jwt_token_here',
    isAuthenticated: true,
    loading: false,
    error: null
  },
  movies: {
    popular: [...movies],
    searchResults: [...movies],
    selectedMovie: {...movie},
    loading: false,
    error: null,
    cache: { timestamp, data }
  },
  favorites: {
    items: [...favorites],
    loading: false,
    error: null
  },
  reviews: {
    userReviews: [...reviews],
    movieReviews: {...},
    loading: false,
    error: null
  },
  ui: {
    theme: 'dark' | 'light',
    sidebarOpen: false,
    modal: { isOpen, content },
    toast: { show, message, type }
  }
}
```

---

## 📦 Package Organization

### Frontend Packages (`client/src/`)
- **components/** - Organized by domain (auth, movies, common, layout)
- **store/** - Redux slices and middleware
- **services/** - API communication layer
- **utils/** - Pure utility functions and error handlers
- **hooks/** - Custom React hooks
- **constants/** - API endpoints, routes, configuration
- **pages/** - Route-level components

### Backend Packages (`server/src/`)
- **controllers/** - HTTP request/response handling
- **models/** - Database queries (raw SQL)
- **services/** - Business logic and external APIs
- **middleware/** - Authentication, validation, error handling
- **routes/** - API endpoint definitions
- **utils/** - Helper functions and error classes
- **config/** - Application and database configuration

---

## 🔐 Security Features

1. **Password Security**
   - bcrypt hashing (salt rounds: 10)
   - Never stored in plain text

2. **JWT Authentication**
   - Token-based authentication
   - Secure token storage
   - Token expiration (7 days)
   - Token verification middleware

3. **SQL Injection Prevention**
   - Parameterized queries
   - No string concatenation in SQL

4. **CORS Configuration**
   - Controlled origins
   - Credentials support

5. **Security Headers**
   - Helmet.js middleware
   - XSS protection
   - Content Security Policy

6. **Input Validation**
   - express-validator
   - Frontend validation
   - Sanitization

---

## 🧪 Testing Strategy

### Backend Testing
- Unit tests for models (database queries)
- Unit tests for controllers
- Unit tests for services
- Integration tests for API endpoints
- Middleware testing
- Error handling testing

### Frontend Testing
- Component testing (React Testing Library)
- Redux slice testing (actions, reducers)
- Async thunk testing
- Custom hook testing
- Service layer testing
- Error handler testing
- Integration tests

### Test Coverage Goals
- Backend: 70%+ coverage
- Frontend: 70%+ coverage
- Critical paths: 90%+ coverage

---

## 📈 Redux Implementation Highlights

### Why Redux? (To Show Recruiters)
1. **Complex State Management** - Multiple data sources (API, DB, user input)
2. **Centralized State** - Single source of truth
3. **Predictable Updates** - Actions and reducers pattern
4. **Time-Travel Debugging** - Redux DevTools
5. **Middleware** - Custom logging and caching
6. **Performance** - Memoized selectors
7. **Testing** - Easy to test pure functions

### Redux Features Demonstrated
- ✅ **Redux Toolkit** - Modern Redux approach
- ✅ **createSlice** - Simplified reducers
- ✅ **createAsyncThunk** - Async action creators
- ✅ **Entity Adapters** - Normalized state (optional)
- ✅ **Selectors** - Derived state with reselect
- ✅ **Middleware** - Custom error logging
- ✅ **Optimistic Updates** - Better UX
- ✅ **Cache Management** - Reduce API calls

---

## 🗄️ Database Schema

### Users Table
```sql
- id (SERIAL PRIMARY KEY)
- username (VARCHAR UNIQUE)
- email (VARCHAR UNIQUE)
- password_hash (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Favorites Table
```sql
- id (SERIAL PRIMARY KEY)
- user_id (INTEGER FK -> users.id)
- movie_id (INTEGER)
- movie_title (VARCHAR)
- movie_poster (VARCHAR)
- movie_overview (TEXT)
- movie_release_date (VARCHAR)
- movie_vote_average (DECIMAL)
- added_at (TIMESTAMP)
- UNIQUE(user_id, movie_id)
```

### Reviews Table
```sql
- id (SERIAL PRIMARY KEY)
- user_id (INTEGER FK -> users.id)
- movie_id (INTEGER)
- movie_title (VARCHAR)
- rating (INTEGER CHECK 1-5)
- comment (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- UNIQUE(user_id, movie_id)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- Docker & Docker Compose
- TMDB API Key (free)

### Quick Setup
```bash
# 1. Clone repository
git clone <repo-url>
cd movies-explorer

# 2. Get TMDB API Key
# Visit: https://www.themoviedb.org/settings/api

# 3. Configure environment
cd server && cp .env.example .env
cd ../client && cp .env.example .env
# Add your TMDB_API_KEY to server/.env

# 4. Start PostgreSQL
docker-compose up -d

# 5. Install dependencies
cd server && npm install
cd ../client && npm install

# 6. Run application
# Terminal 1: cd server && npm run dev
# Terminal 2: cd client && npm run dev
```

### Access
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Movies (TMDB Proxy)
- `GET /api/movies/popular` - Get popular movies
- `GET /api/movies/search?query=` - Search movies
- `GET /api/movies/:id` - Get movie details

### Favorites
- `GET /api/favorites` - Get user favorites (protected)
- `POST /api/favorites` - Add favorite (protected)
- `DELETE /api/favorites/:movieId` - Remove favorite (protected)

### Reviews
- `GET /api/reviews/user` - Get user reviews (protected)
- `GET /api/reviews/movie/:movieId` - Get movie reviews
- `POST /api/reviews` - Create review (protected)
- `PUT /api/reviews/:id` - Update review (protected)
- `DELETE /api/reviews/:id` - Delete review (protected)

---

## 🎨 UI/UX Features

- **Responsive Design** - Mobile, tablet, desktop
- **Dark Mode** - System preference detection + manual toggle
- **Loading States** - Skeletons and spinners
- **Error States** - User-friendly error messages
- **Toast Notifications** - Success/error feedback
- **Optimistic Updates** - Instant UI feedback
- **Smooth Animations** - Tailwind transitions
- **Accessible** - Keyboard navigation, ARIA labels

---

## 🔄 Current Status

### ✅ Completed
- Project structure and organization
- Configuration files (all packages)
- Docker setup for PostgreSQL
- Database schema
- Error handling utilities (frontend & backend)
- API service layer (frontend)
- Express server setup (backend)
- Authentication middleware
- Database connection pool
- User model example (with raw SQL)
- Constants and configuration
- Testing setup

### 🚧 In Progress / TODO
- Complete backend models (favorites, reviews)
- Complete backend controllers
- Complete backend routes
- TMDB service integration
- Redux store implementation
- React components
- Pages and routing
- Custom hooks
- Testing implementation

---

## 📚 Learning Outcomes

This project demonstrates proficiency in:

1. **Full-Stack Development** - Frontend + Backend + Database
2. **State Management** - Redux Toolkit with complex async flows
3. **API Design** - RESTful endpoints, proper status codes
4. **Database Design** - Relational schema, indexes, constraints
5. **Authentication** - JWT, bcrypt, secure token handling
6. **Error Handling** - Comprehensive error strategy across stack
7. **Testing** - Unit, integration, and component tests
8. **DevOps** - Docker containerization
9. **Code Organization** - Clean architecture, separation of concerns
10. **Best Practices** - Security, performance, maintainability

---

## 🎯 Target Audience (Recruiters)

This project showcases skills relevant for:
- **Full-Stack Developer** roles
- **Frontend Developer** (React/Redux focus)
- **Backend Developer** (Node.js/Express focus)
- **JavaScript Developer** positions
- **Junior to Mid-Level** positions

---

## 📝 Development Principles

- **Clean Code** - Readable, maintainable, documented
- **Separation of Concerns** - Clear package boundaries
- **DRY** - Don't Repeat Yourself
- **SOLID Principles** - Where applicable
- **Error First** - Comprehensive error handling
- **Security First** - No compromises on security
- **Test-Driven** - Tests for critical functionality
- **Modular** - Easy to extend and modify

---

## 📄 License

MIT License - Open source for portfolio purposes

---

## 👤 Author

**[Your Name]**
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [Your Profile](https://linkedin.com/in/your-profile)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- **TMDB** - Free movie database API
- **Redux Team** - Redux Toolkit
- **Tailwind Labs** - Tailwind CSS
- **React Team** - React library

---

## 📌 Notes

- This is a demonstration project built for portfolio purposes
- API key required from TMDB (free tier)
- Not intended for production use without further hardening
- Designed to showcase technical skills to potential employers

---

**⭐ If this helped you, please star the repository!**

---

## 🔗 Useful Links

- [Full Documentation](./README.md)
- [Project Structure](./PROJECT_STRUCTURE.md)
- [Next Steps Guide](./NEXT_STEPS.md)
- [TMDB API Docs](https://developers.themoviedb.org/3)
- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
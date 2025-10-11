# 🎬 Movies Explorer

A full-stack movie exploration application built with React, Redux, Node.js, Express, and PostgreSQL. This project demonstrates modern web development practices including state management, RESTful APIs, authentication, and Docker containerization.

## 🚀 Features

### Core Features (MVP)
- 🔐 **User Authentication** - Register, login with JWT tokens
- 🎥 **Movie Browsing** - Explore popular and trending movies from TMDB API
- 🔍 **Search** - Find movies by title
- 📄 **Movie Details** - View detailed information, cast, and ratings
- ⭐ **Favorites** - Save your favorite movies (persisted in PostgreSQL)
- ✍️ **Reviews & Ratings** - Write reviews and rate movies (1-5 stars)
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 🎨 **Responsive Design** - Works seamlessly on desktop and mobile

### Technical Highlights
- **Redux Toolkit** for state management (auth, movies, favorites, reviews, UI)
- **Error Handling** - Comprehensive error handling on frontend and backend
- **Testing** - Unit and integration tests with Jest and React Testing Library
- **Docker** - PostgreSQL database containerization
- **Raw SQL** - Direct SQL queries for database operations
- **Tailwind CSS** - Modern utility-first styling

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Docker** and **Docker Compose**
- **Git**

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/movies-explorer.git
cd movies-explorer
```

### 2. Get TMDB API Key (Free)

1. Go to [TMDB Website](https://www.themoviedb.org/signup)
2. Create a free account and verify your email
3. Navigate to Settings → API → Request API Key
4. Choose "Developer" option
5. Fill in the required information
6. Copy your API Key (v3 auth)

### 3. Setup Environment Variables

#### Backend Configuration

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and add your configuration:

```env
# TMDB API
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3

# Database
DB_USER=postgres
DB_PASSWORD=postgres123
DB_HOST=localhost
DB_PORT=5432
DB_NAME=movies_explorer

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development
```

#### Frontend Configuration

```bash
cd ../client
cp .env.example .env
```

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start PostgreSQL with Docker

From the root directory:

```bash
docker-compose up -d
```

This will start a PostgreSQL container and automatically initialize the database schema.

Verify the database is running:

```bash
docker ps
```

### 5. Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd ../client
npm install
```

### 6. Run the Application

#### Start Backend (Terminal 1)

```bash
cd server
npm run dev
```

Backend will run on `http://localhost:5000`

#### Start Frontend (Terminal 2)

```bash
cd client
npm run dev
```

Frontend will run on `http://localhost:5173`

### 7. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## 🧪 Running Tests

### Backend Tests

```bash
cd server
npm test
```

### Frontend Tests

```bash
cd client
npm test
```

### Run Tests with Coverage

```bash
# Backend
cd server
npm run test:coverage

# Frontend
cd client
npm run test:coverage
```

## 📁 Project Structure

```
movies-explorer/
├── client/                      # React Frontend
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── auth/           # Login, Register
│   │   │   ├── common/         # Reusable components (Button, Card, etc.)
│   │   │   ├── layout/         # Header, Footer, Sidebar
│   │   │   └── movies/         # Movie-related components
│   │   ├── pages/              # Page components
│   │   ├── store/              # Redux store
│   │   │   ├── slices/         # Redux slices (auth, movies, etc.)
│   │   │   └── middleware/     # Custom Redux middleware
│   │   ├── services/           # API service layer
│   │   ├── hooks/              # Custom React hooks
│   │   ├── utils/              # Utility functions
│   │   │   └── errors/         # Error handling utilities
│   │   └── constants/          # Constants and configuration
│   ├── __tests__/              # Test files
│   └── package.json
│
├── server/                      # Node.js Backend
│   ├── src/
│   │   ├── config/             # Configuration files
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Express middleware
│   │   ├── models/             # Database models (SQL queries)
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic
│   │   ├── utils/              # Utility functions
│   │   │   └── errors/         # Error classes and handlers
│   │   └── server.js           # Express app entry point
│   ├── db/                     # Database files
│   │   └── init.sql            # Database initialization script
│   ├── __tests__/              # Test files
│   └── package.json
│
├── docker-compose.yml           # Docker configuration
├── .gitignore
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Movies
- `GET /api/movies/popular` - Get popular movies
- `GET /api/movies/search?query=` - Search movies
- `GET /api/movies/:id` - Get movie details

### Favorites
- `GET /api/favorites` - Get user's favorites (protected)
- `POST /api/favorites` - Add to favorites (protected)
- `DELETE /api/favorites/:movieId` - Remove from favorites (protected)

### Reviews
- `GET /api/reviews/user` - Get user's reviews (protected)
- `GET /api/reviews/movie/:movieId` - Get reviews for a movie
- `POST /api/reviews` - Create review (protected)
- `PUT /api/reviews/:id` - Update review (protected)
- `DELETE /api/reviews/:id` - Delete review (protected)

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Jest** & **React Testing Library** - Testing

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **PostgreSQL** - Database
- **pg** - PostgreSQL client
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Jest** & **Supertest** - Testing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL container is running
docker ps

# View container logs
docker logs movies_db

# Restart container
docker-compose restart
```

### Port Already in Use

```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### Clear Docker Volumes

```bash
docker-compose down -v
docker-compose up -d
```

## 📝 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `TMDB_API_KEY` | TMDB API Key | `abc123...` |
| `DB_PASSWORD` | PostgreSQL password | `postgres123` |
| `JWT_SECRET` | JWT signing secret | `my_secret_key` |

See `.env.example` files for complete list.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [Your Profile](https://linkedin.com/in/your-profile)

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for the free movie API
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Redux Toolkit](https://redux-toolkit.js.org/) for state management

---

⭐ If you found this project helpful, please consider giving it a star!
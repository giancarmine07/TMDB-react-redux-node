const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const config = require('./config/config');
const { testConnection } = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes (will be created later)
const authRoutes = require('./routes/authRoutes');
const moviesRoutes = require('./routes/moviesRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');
const reviewsRoutes = require('./routes/reviewsRoutes');

// Initialize Express app
const app = express();

// ===================================
// Security Middleware
// ===================================
app.use(helmet()); // Set security HTTP headers

// ===================================
// CORS Configuration
// ===================================
app.use(
  cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
  })
);

// ===================================
// Body Parser Middleware
// ===================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===================================
// Compression Middleware
// ===================================
app.use(compression());

// ===================================
// Logging Middleware
// ===================================
if (config.server.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ===================================
// Health Check Route
// ===================================
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: config.server.env,
  });
});

// ===================================
// API Routes
// ===================================
app.use('/api/auth', authRoutes);
app.use('/api/movies', moviesRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/reviews', reviewsRoutes);

// ===================================
// Root Route
// ===================================
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Movies Explorer API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      movies: '/api/movies',
      favorites: '/api/favorites',
      reviews: '/api/reviews',
    },
  });
});

// ===================================
// Error Handling
// ===================================
// Handle 404 errors
app.use(notFound);

// Global error handler
app.use(errorHandler);

// ===================================
// Start Server
// ===================================
const PORT = config.server.port;

const startServer = async () => {
  try {
    // Test database connection
    console.log('🔌 Testing database connection...');
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error('❌ Failed to connect to database. Exiting...');
      process.exit(1);
    }

    // Start listening
    app.listen(PORT, () => {
      console.log('');
      console.log('==========================================');
      console.log(`🚀 Server running in ${config.server.env} mode`);
      console.log(`🌐 Server URL: http://localhost:${PORT}`);
      console.log(`💾 Database: ${config.database.database}`);
      console.log('==========================================');
      console.log('');
      console.log('📍 Available endpoints:');
      console.log(`   - Health Check: http://localhost:${PORT}/health`);
      console.log(`   - API Root: http://localhost:${PORT}/api`);
      console.log(`   - Auth: http://localhost:${PORT}/api/auth`);
      console.log(`   - Movies: http://localhost:${PORT}/api/movies`);
      console.log(`   - Favorites: http://localhost:${PORT}/api/favorites`);
      console.log(`   - Reviews: http://localhost:${PORT}/api/reviews`);
      console.log('');
      console.log('Press CTRL+C to stop');
      console.log('==========================================');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('💥 UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;

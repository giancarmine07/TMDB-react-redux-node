require("dotenv").config();

const config = {
  // Server configuration
  server: {
    port: parseInt(process.env.PORT) || 5001,
    env: process.env.NODE_ENV || "development",
  },

  // Database configuration
  database: {
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "movies_explorer",
    password: process.env.DB_PASSWORD || "postgres123",
    port: parseInt(process.env.DB_PORT) || 5432,
  },

  // JWT configuration
  jwt: {
    secret:
      process.env.JWT_SECRET || "your_jwt_secret_key_change_in_production",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },

  // TMDB API configuration
  tmdb: {
    apiKey: process.env.TMDB_API_KEY,
    baseUrl: process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3",
    imageBaseUrl: "https://image.tmdb.org/t/p",
  },

  // CORS configuration
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },

  // Pagination defaults
  pagination: {
    defaultPage: 1,
    defaultLimit: 20,
    maxLimit: 100,
  },

  // Rate limiting (for future implementation)
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
  },
};

// Validate required environment variables
const validateConfig = () => {
  const requiredVars = ["TMDB_API_KEY", "JWT_SECRET", "DB_PASSWORD"];
  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0 && config.server.env !== "test") {
    console.warn(
      `⚠️  Warning: Missing environment variables: ${missing.join(", ")}`,
    );
    console.warn("⚠️  Please check your .env file");
  }

  // Check if TMDB API key is set
  if (!config.tmdb.apiKey && config.server.env !== "test") {
    console.error(
      "❌ TMDB_API_KEY is not set. Please add it to your .env file",
    );
    console.error(
      "   Get your free API key at: https://www.themoviedb.org/settings/api",
    );
  }
};

// Run validation on import
validateConfig();

module.exports = config;

# 🚀 Movies Explorer - Quick Commands Reference

## 📦 Installation Commands

### Initial Setup
```bash
# Clone the repository
git clone <repository-url>
cd movies-explorer

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Environment Setup
```bash
# Backend environment
cd server
cp .env.example .env
# Edit .env and add your TMDB_API_KEY

# Frontend environment
cd ../client
cp .env.example .env
```

---

## 🐳 Docker Commands

### Start PostgreSQL Database
```bash
# Start database in detached mode
docker-compose up -d

# View running containers
docker ps

# View database logs
docker logs movies_db

# Follow database logs in real-time
docker logs -f movies_db
```

### Stop/Restart Database
```bash
# Stop database
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v

# Restart database
docker-compose restart

# Rebuild and start
docker-compose up -d --build
```

### Database Access
```bash
# Access PostgreSQL shell
docker exec -it movies_db psql -U postgres -d movies_explorer

# Common PostgreSQL commands (inside psql):
\dt              # List all tables
\d users         # Describe users table
\d+ favorites    # Detailed info on favorites table
\q               # Quit psql

# Run SQL query from command line
docker exec -it movies_db psql -U postgres -d movies_explorer -c "SELECT * FROM users;"
```

### Database Backup & Restore
```bash
# Backup database
docker exec -t movies_db pg_dump -U postgres movies_explorer > backup.sql

# Restore database
docker exec -i movies_db psql -U postgres movies_explorer < backup.sql
```

---

## 🖥️ Development Commands

### Backend (Server)
```bash
# Navigate to server directory
cd server

# Start development server with hot reload
npm run dev

# Start production server
npm start

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Frontend (Client)
```bash
# Navigate to client directory
cd client

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint
```

---

## 🧪 Testing Commands

### Run All Tests
```bash
# Backend tests
cd server && npm test

# Frontend tests
cd client && npm test
```

### Coverage Reports
```bash
# Backend coverage
cd server && npm run test:coverage

# Frontend coverage
cd client && npm run test:coverage
```

### Test Specific File
```bash
# Backend - test specific file
cd server
npm test -- path/to/test.test.js

# Frontend - test specific file
cd client
npm test -- path/to/test.test.js
```

---

## 🔍 Debugging Commands

### Check Port Usage
```bash
# Check if port 5000 is in use (backend)
lsof -ti:5000

# Check if port 5173 is in use (frontend)
lsof -ti:5173

# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### View Logs
```bash
# Backend logs (if using nodemon)
cd server && npm run dev

# Frontend logs
cd client && npm run dev

# Docker logs
docker-compose logs

# Follow Docker logs
docker-compose logs -f
```

### Check Database Connection
```bash
# Test PostgreSQL connection
docker exec -it movies_db pg_isready -U postgres

# Check database size
docker exec -it movies_db psql -U postgres -d movies_explorer -c "SELECT pg_size_pretty(pg_database_size('movies_explorer'));"

# List all databases
docker exec -it movies_db psql -U postgres -c "\l"
```

---

## 🛠️ Maintenance Commands

### Clean Installation
```bash
# Remove node_modules and reinstall (backend)
cd server
rm -rf node_modules package-lock.json
npm install

# Remove node_modules and reinstall (frontend)
cd client
rm -rf node_modules package-lock.json
npm install
```

### Clear Caches
```bash
# Clear npm cache
npm cache clean --force

# Clear Vite cache (frontend)
cd client
rm -rf node_modules/.vite
```

### Reset Database
```bash
# Stop database and remove volumes
docker-compose down -v

# Start fresh database (will run init.sql)
docker-compose up -d

# Verify database is ready
docker exec -it movies_db psql -U postgres -d movies_explorer -c "\dt"
```

---

## 📊 Database Query Commands

### Check Data
```bash
# Count users
docker exec -it movies_db psql -U postgres -d movies_explorer -c "SELECT COUNT(*) FROM users;"

# View all users (limit 10)
docker exec -it movies_db psql -U postgres -d movies_explorer -c "SELECT id, username, email, created_at FROM users LIMIT 10;"

# View favorites
docker exec -it movies_db psql -U postgres -d movies_explorer -c "SELECT * FROM favorites LIMIT 10;"

# View reviews with ratings
docker exec -it movies_db psql -U postgres -d movies_explorer -c "SELECT user_id, movie_title, rating, created_at FROM reviews ORDER BY created_at DESC LIMIT 10;"
```

### Database Maintenance
```bash
# Analyze database
docker exec -it movies_db psql -U postgres -d movies_explorer -c "ANALYZE;"

# Vacuum database
docker exec -it movies_db psql -U postgres -d movies_explorer -c "VACUUM;"

# Check table sizes
docker exec -it movies_db psql -U postgres -d movies_explorer -c "SELECT tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size FROM pg_tables WHERE schemaname = 'public' ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;"
```

---

## 🔐 Security Commands

### Generate JWT Secret
```bash
# Generate random secret (Node.js)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate random secret (OpenSSL)
openssl rand -hex 64
```

### Hash Password (for testing)
```bash
# Use Node.js REPL
node
> const bcrypt = require('bcrypt');
> bcrypt.hashSync('password123', 10);
```

---

## 📝 Git Commands

### Initial Commit
```bash
# Initialize git repository
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: Movies Explorer project setup"

# Add remote
git remote add origin <your-github-repo-url>

# Push to GitHub
git push -u origin main
```

### Regular Workflow
```bash
# Check status
git status

# Add changes
git add .

# Commit with message
git commit -m "feat: add user authentication"

# Push to remote
git push

# Pull latest changes
git pull
```

### Branch Management
```bash
# Create new branch
git checkout -b feature/movie-search

# Switch branch
git checkout main

# Merge branch
git merge feature/movie-search

# Delete branch
git branch -d feature/movie-search
```

---

## 🚀 Production Build Commands

### Build Frontend
```bash
cd client
npm run build

# Output will be in client/dist/
```

### Test Production Build Locally
```bash
cd client
npm run preview
```

---

## 📦 Package Management

### Update Dependencies
```bash
# Check outdated packages (backend)
cd server && npm outdated

# Check outdated packages (frontend)
cd client && npm outdated

# Update all packages
npm update

# Update specific package
npm update package-name
```

### Add New Package
```bash
# Backend
cd server
npm install package-name

# Frontend
cd client
npm install package-name

# Dev dependency
npm install -D package-name
```

---

## 🔧 Useful One-Liners

### Check Everything is Running
```bash
# Check if all services are running
curl http://localhost:5000/health && curl http://localhost:5173 && docker ps | grep movies_db
```

### Full Reset (Nuclear Option)
```bash
# Stop everything, clean, and restart
docker-compose down -v && \
cd server && rm -rf node_modules && npm install && \
cd ../client && rm -rf node_modules && npm install && \
cd .. && docker-compose up -d
```

### Quick Start (After Initial Setup)
```bash
# Start database
docker-compose up -d

# Start backend (in one terminal)
cd server && npm run dev

# Start frontend (in another terminal)
cd client && npm run dev
```

---

## 📱 API Testing Commands

### Using curl
```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get popular movies (replace TOKEN with actual JWT)
curl http://localhost:5000/api/movies/popular \
  -H "Authorization: Bearer TOKEN"
```

### Using httpie (if installed)
```bash
# Register
http POST http://localhost:5000/api/auth/register username=testuser email=test@example.com password=password123

# Login
http POST http://localhost:5000/api/auth/login email=test@example.com password=password123

# Get favorites (with token)
http GET http://localhost:5000/api/favorites Authorization:"Bearer TOKEN"
```

---

## 🎯 Troubleshooting Commands

### Database Not Connecting
```bash
# Check if database is running
docker ps | grep movies_db

# Check database logs for errors
docker logs movies_db

# Restart database
docker-compose restart

# Check connection from host
psql -h localhost -U postgres -d movies_explorer
```

### Port Already in Use
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Find and kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Node Modules Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Documentation Commands

### Generate API Documentation (Future)
```bash
# If using JSDoc
npm run docs

# If using Swagger/OpenAPI
npm run swagger
```

---

## 💡 Tips

1. **Always start Docker first**: `docker-compose up -d`
2. **Use two terminals**: One for backend, one for frontend
3. **Check health endpoint**: Visit `http://localhost:5000/health`
4. **View Redux state**: Use Redux DevTools browser extension
5. **Database GUI**: Use pgAdmin or DBeaver to visualize database
6. **API Testing**: Use Postman, Insomnia, or Thunder Client (VS Code extension)

---

## 🆘 Getting Help

```bash
# View package scripts
npm run

# View available npm commands
npm --help

# View Docker Compose help
docker-compose --help

# View PostgreSQL help
docker exec -it movies_db psql --help
```

---

**Quick Start Reminder:**

```bash
# Terminal 1
docker-compose up -d && cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

Then open: http://localhost:5173
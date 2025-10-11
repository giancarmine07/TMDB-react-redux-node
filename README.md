# 🎬 Movies Explorer

[🇮🇹 Versione Italiana](#versione-italiana) | [🇬🇧 English Version](#english-version)

---

## Versione Italiana

Un'applicazione full-stack per l'esplorazione di film costruita con React, Redux, Node.js, Express e PostgreSQL. Questo progetto dimostra pratiche moderne di sviluppo web tra cui gestione dello stato, API RESTful, autenticazione e containerizzazione Docker.

### 🚀 Funzionalità

#### Funzionalità Principali (MVP)
- 🔐 **Autenticazione Utente** - Registrazione e login con token JWT
- 🎥 **Navigazione Film** - Esplora film popolari e di tendenza dall'API TMDB
- 🔍 **Ricerca** - Trova film per titolo
- 📄 **Dettagli Film** - Visualizza informazioni dettagliate, cast e valutazioni
- ⭐ **Preferiti** - Salva i tuoi film preferiti (persistenti in PostgreSQL)
- ✍️ **Recensioni e Valutazioni** - Scrivi recensioni e valuta i film (1-5 stelle)
- 🌙 **Modalità Scura** - Alterna tra tema chiaro e scuro
- 🎨 **Design Responsive** - Funziona perfettamente su desktop e mobile

#### Caratteristiche Tecniche
- **Redux Toolkit** per la gestione dello stato (auth, movies, favorites, reviews, UI)
- **Gestione Errori** - Gestione completa degli errori su frontend e backend
- **Testing** - Test unitari e di integrazione con Jest e React Testing Library
- **Docker** - Containerizzazione del database PostgreSQL
- **SQL Puro** - Query SQL dirette per le operazioni sul database
- **Tailwind CSS** - Styling moderno utility-first

### 📋 Prerequisiti

Prima di iniziare, assicurati di avere installato:
- **Node.js** (v16 o superiore)
- **npm** o **yarn**
- **Docker** e **Docker Compose**
- **Git**

### 🛠️ Istruzioni di Setup

#### 1. Clona il Repository

```bash
git clone https://github.com/your-username/movies-explorer.git
cd movies-explorer
```

#### 2. Ottieni la Chiave API TMDB (Gratuita)

1. Vai al [Sito TMDB](https://www.themoviedb.org/signup)
2. Crea un account gratuito e verifica la tua email
3. Vai su Impostazioni → API → Richiedi Chiave API
4. Scegli l'opzione "Developer"
5. Compila le informazioni richieste
6. Copia la tua Chiave API (v3 auth)

#### 3. Configura le Variabili d'Ambiente

##### Configurazione Backend

```bash
cd server
cp .env.example .env
```

Modifica `server/.env` e aggiungi la tua configurazione:

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

##### Configurazione Frontend

```bash
cd ../client
cp .env.example .env
```

Modifica `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

#### 4. Avvia PostgreSQL con Docker

Dalla directory root:

```bash
docker-compose up -d
```

Questo avvierà un container PostgreSQL e inizializzerà automaticamente lo schema del database.

Verifica che il database sia in esecuzione:

```bash
docker ps
```

#### 5. Installa le Dipendenze

##### Backend

```bash
cd server
npm install
```

##### Frontend

```bash
cd ../client
npm install
```

#### 6. Avvia l'Applicazione

##### Avvia il Backend (Terminale 1)

```bash
cd server
npm run dev
```

Il backend sarà in esecuzione su `http://localhost:5000`

##### Avvia il Frontend (Terminale 2)

```bash
cd client
npm run dev
```

Il frontend sarà in esecuzione su `http://localhost:5173`

#### 7. Accedi all'Applicazione

Apri il tuo browser e vai su:
```
http://localhost:5173
```

### 🧪 Esecuzione dei Test

#### Test Backend

```bash
cd server
npm test
```

#### Test Frontend

```bash
cd client
npm test
```

#### Esegui Test con Coverage

```bash
# Backend
cd server
npm run test:coverage

# Frontend
cd client
npm run test:coverage
```

### 📁 Struttura del Progetto

```
movies-explorer/
├── client/                      # Frontend React
│   ├── public/                  # Asset statici
│   ├── src/
│   │   ├── components/          # Componenti React
│   │   │   ├── auth/           # Login, Register
│   │   │   ├── common/         # Componenti riutilizzabili (Button, Card, etc.)
│   │   │   ├── layout/         # Header, Footer, Sidebar
│   │   │   └── movies/         # Componenti relativi ai film
│   │   ├── pages/              # Componenti pagina
│   │   ├── store/              # Store Redux
│   │   │   ├── slices/         # Slice Redux (auth, movies, etc.)
│   │   │   └── middleware/     # Middleware Redux personalizzato
│   │   ├── services/           # Layer di servizio API
│   │   ├── hooks/              # Hook React personalizzati
│   │   ├── utils/              # Funzioni di utilità
│   │   │   └── errors/         # Utilità gestione errori
│   │   └── constants/          # Costanti e configurazione
│   ├── __tests__/              # File di test
│   └── package.json
│
├── server/                      # Backend Node.js
│   ├── src/
│   │   ├── config/             # File di configurazione
│   │   ├── controllers/        # Controller delle route
│   │   ├── middleware/         # Middleware Express
│   │   ├── models/             # Modelli database (query SQL)
│   │   ├── routes/             # Route API
│   │   ├── services/           # Logica di business
│   │   ├── utils/              # Funzioni di utilità
│   │   │   └── errors/         # Classi e handler errori
│   │   └── server.js           # Entry point app Express
│   ├── db/                     # File database
│   │   └── init.sql            # Script inizializzazione database
│   ├── __tests__/              # File di test
│   └── package.json
│
├── docker-compose.yml           # Configurazione Docker
├── .gitignore
└── README.md
```

### 🔑 Endpoint API

#### Autenticazione
- `POST /api/auth/register` - Registra nuovo utente
- `POST /api/auth/login` - Login utente
- `GET /api/auth/me` - Ottieni utente corrente (protetto)

#### Film
- `GET /api/movies/popular` - Ottieni film popolari
- `GET /api/movies/search?query=` - Cerca film
- `GET /api/movies/:id` - Ottieni dettagli film

#### Preferiti
- `GET /api/favorites` - Ottieni preferiti utente (protetto)
- `POST /api/favorites` - Aggiungi ai preferiti (protetto)
- `DELETE /api/favorites/:movieId` - Rimuovi dai preferiti (protetto)

#### Recensioni
- `GET /api/reviews/user` - Ottieni recensioni utente (protetto)
- `GET /api/reviews/movie/:movieId` - Ottieni recensioni per un film
- `POST /api/reviews` - Crea recensione (protetto)
- `PUT /api/reviews/:id` - Aggiorna recensione (protetto)
- `DELETE /api/reviews/:id` - Elimina recensione (protetto)

### 🛠️ Stack Tecnologico

#### Frontend
- **React 18** - Libreria UI
- **Redux Toolkit** - Gestione dello stato
- **React Router** - Routing
- **Axios** - Client HTTP
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Jest** & **React Testing Library** - Testing

#### Backend
- **Node.js** - Runtime
- **Express** - Framework web
- **PostgreSQL** - Database
- **pg** - Client PostgreSQL
- **JWT** - Autenticazione
- **bcrypt** - Hashing password
- **Jest** & **Supertest** - Testing

#### DevOps
- **Docker** - Containerizzazione
- **Docker Compose** - Orchestrazione multi-container

### 🤝 Contribuire

I contributi sono benvenuti! Sentiti libero di inviare una Pull Request.

### 📄 Licenza

Questo progetto è open source e disponibile sotto la [Licenza MIT](LICENSE).

### 👤 Autore

**Giancarmine Santoro**
- GitHub: [@giancarminesantoro](https://github.com/giancarminesantoro)

### 🙏 Ringraziamenti

- [TMDB](https://www.themoviedb.org/) per l'API gratuita dei film
- [Tailwind CSS](https://tailwindcss.com/) per il framework di styling
- [Redux Toolkit](https://redux-toolkit.js.org/) per la gestione dello stato

---

⭐ Se hai trovato questo progetto utile, considera di dargli una stella!

---

## English Version

A full-stack movie exploration application built with React, Redux, Node.js, Express, and PostgreSQL. This project demonstrates modern web development practices including state management, RESTful APIs, authentication, and Docker containerization.

### 🚀 Features

#### Core Features (MVP)
- 🔐 **User Authentication** - Register, login with JWT tokens
- 🎥 **Movie Browsing** - Explore popular and trending movies from TMDB API
- 🔍 **Search** - Find movies by title
- 📄 **Movie Details** - View detailed information, cast, and ratings
- ⭐ **Favorites** - Save your favorite movies (persisted in PostgreSQL)
- ✍️ **Reviews & Ratings** - Write reviews and rate movies (1-5 stars)
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 🎨 **Responsive Design** - Works seamlessly on desktop and mobile

#### Technical Highlights
- **Redux Toolkit** for state management (auth, movies, favorites, reviews, UI)
- **Error Handling** - Comprehensive error handling on frontend and backend
- **Testing** - Unit and integration tests with Jest and React Testing Library
- **Docker** - PostgreSQL database containerization
- **Raw SQL** - Direct SQL queries for database operations
- **Tailwind CSS** - Modern utility-first styling

### 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Docker** and **Docker Compose**
- **Git**

### 🛠️ Setup Instructions

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/movies-explorer.git
cd movies-explorer
```

#### 2. Get TMDB API Key (Free)

1. Go to [TMDB Website](https://www.themoviedb.org/signup)
2. Create a free account and verify your email
3. Navigate to Settings → API → Request API Key
4. Choose "Developer" option
5. Fill in the required information
6. Copy your API Key (v3 auth)

#### 3. Setup Environment Variables

##### Backend Configuration

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

##### Frontend Configuration

```bash
cd ../client
cp .env.example .env
```

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

#### 4. Start PostgreSQL with Docker

From the root directory:

```bash
docker-compose up -d
```

This will start a PostgreSQL container and automatically initialize the database schema.

Verify the database is running:

```bash
docker ps
```

#### 5. Install Dependencies

##### Backend

```bash
cd server
npm install
```

##### Frontend

```bash
cd ../client
npm install
```

#### 6. Run the Application

##### Start Backend (Terminal 1)

```bash
cd server
npm run dev
```

Backend will run on `http://localhost:5000`

##### Start Frontend (Terminal 2)

```bash
cd client
npm run dev
```

Frontend will run on `http://localhost:5173`

#### 7. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

### 🧪 Running Tests

#### Backend Tests

```bash
cd server
npm test
```

#### Frontend Tests

```bash
cd client
npm test
```

#### Run Tests with Coverage

```bash
# Backend
cd server
npm run test:coverage

# Frontend
cd client
npm run test:coverage
```

### 📁 Project Structure

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

### 🔑 API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

#### Movies
- `GET /api/movies/popular` - Get popular movies
- `GET /api/movies/search?query=` - Search movies
- `GET /api/movies/:id` - Get movie details

#### Favorites
- `GET /api/favorites` - Get user's favorites (protected)
- `POST /api/favorites` - Add to favorites (protected)
- `DELETE /api/favorites/:movieId` - Remove from favorites (protected)

#### Reviews
- `GET /api/reviews/user` - Get user's reviews (protected)
- `GET /api/reviews/movie/:movieId` - Get reviews for a movie
- `POST /api/reviews` - Create review (protected)
- `PUT /api/reviews/:id` - Update review (protected)
- `DELETE /api/reviews/:id` - Delete review (protected)

### 🛠️ Tech Stack

#### Frontend
- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Jest** & **React Testing Library** - Testing

#### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **PostgreSQL** - Database
- **pg** - PostgreSQL client
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Jest** & **Supertest** - Testing

#### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

### 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### 📄 License

This project is open source and available under the [MIT License](LICENSE).

### 👤 Author

**Giancarmine Santoro**
- GitHub: [@giancarminesantoro](https://github.com/giancarminesantoro)

### 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for the free movie API
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Redux Toolkit](https://redux-toolkit.js.org/) for state management

---

⭐ If you found this project helpful, please consider giving it a star!
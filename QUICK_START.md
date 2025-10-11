# 🚀 Quick Start Guide - Movies Explorer Backend

## ⚡ Avvio Rapido (Senza Docker)

Se non hai Docker installato o preferisci usare PostgreSQL locale, segui questa guida.

---

## 📋 Prerequisiti

- Node.js v16+ installato
- PostgreSQL installato localmente
- TMDB API Key (gratuita)

---

## 🔧 Setup in 5 Minuti

### 1️⃣ Installa PostgreSQL Locale (se non già installato)

#### macOS
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Windows
Scarica da: https://www.postgresql.org/download/windows/

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

---

### 2️⃣ Crea Database

```bash
# Accedi a PostgreSQL
psql -U postgres

# Crea il database (dentro psql)
CREATE DATABASE movies_explorer;

# Esci
\q
```

---

### 3️⃣ Inizializza Schema Database

```bash
# Dalla root del progetto
cd react-redux-api1

# Esegui lo script di inizializzazione
psql -U postgres -d movies_explorer -f server/db/init.sql
```

Se hai errori di permessi:
```bash
# Su macOS/Linux, potrebbe essere necessario specificare l'host
psql -h localhost -U postgres -d movies_explorer -f server/db/init.sql
```

---

### 4️⃣ Ottieni TMDB API Key

1. Vai su: https://www.themoviedb.org/signup
2. Crea un account gratuito
3. Verifica la tua email
4. Vai su: https://www.themoviedb.org/settings/api
5. Richiedi una API Key (scegli "Developer")
6. Copia la tua **API Key (v3 auth)**

---

### 5️⃣ Configura Environment Variables

```bash
cd server

# Il file .env è già creato, modificalo:
# macOS/Linux
nano .env

# Windows
notepad .env
```

**Modifica questa riga:**
```env
TMDB_API_KEY=your_tmdb_api_key_here
```

**Sostituisci con la tua vera API key:**
```env
TMDB_API_KEY=abc123def456ghi789...
```

Se hai modificato le credenziali PostgreSQL, aggiorna anche:
```env
DB_USER=postgres
DB_PASSWORD=postgres123  # La tua password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=movies_explorer
```

---

### 6️⃣ Installa Dipendenze

```bash
# Assicurati di essere in react-redux-api1/server
npm install
```

---

### 7️⃣ Avvia il Server

```bash
npm run dev
```

Dovresti vedere:
```
==========================================
🚀 Server running in development mode
🌐 Server URL: http://localhost:5000
💾 Database: movies_explorer
==========================================
```

---

## ✅ Test del Server

### Test 1: Health Check
```bash
curl http://localhost:5000/health
```

**Risposta attesa:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

### Test 2: API Root
```bash
curl http://localhost:5000/
```

### Test 3: Registrazione Utente
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Risposta attesa:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Test 4: Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test 5: Film Popolari (richiede TMDB API Key)
```bash
curl http://localhost:5000/api/movies/popular
```

**Risposta attesa:**
```json
{
  "success": true,
  "data": {
    "page": 1,
    "results": [
      {
        "id": 123,
        "title": "Movie Title",
        "poster_path": "/path.jpg",
        "overview": "Description...",
        "vote_average": 8.5
      }
    ],
    "totalPages": 500,
    "totalResults": 10000
  }
}
```

---

## 🧪 Test Completo del Flusso

### 1. Registra un utente
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "email": "john@example.com",
    "password": "secure123"
  }' | jq
```

Salva il `token` dalla risposta.

### 2. Aggiungi un film ai preferiti
```bash
# Sostituisci YOUR_TOKEN con il token ricevuto
curl -X POST http://localhost:5000/api/favorites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "id": 550,
    "title": "Fight Club",
    "poster_path": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    "overview": "A ticking-time-bomb...",
    "release_date": "1999-10-15",
    "vote_average": 8.4
  }' | jq
```

### 3. Ottieni i preferiti
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/favorites | jq
```

### 4. Scrivi una recensione
```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "movieId": 550,
    "movieTitle": "Fight Club",
    "rating": 5,
    "comment": "Amazing movie! Highly recommended."
  }' | jq
```

### 5. Ottieni le recensioni del film
```bash
curl http://localhost:5000/api/reviews/movie/550 | jq
```

---

## 🐛 Troubleshooting

### Errore: "Cannot connect to database"

**Soluzione:**
```bash
# Verifica che PostgreSQL sia in esecuzione
psql -U postgres -c "SELECT version();"

# Su macOS
brew services list | grep postgresql

# Su Linux
sudo systemctl status postgresql
```

### Errore: "TMDB API error"

**Soluzione:**
1. Verifica che la tua API key sia corretta in `.env`
2. Controlla che non ci siano spazi extra
3. Testa la key su TMDB:
   ```bash
   curl "https://api.themoviedb.org/3/movie/popular?api_key=YOUR_API_KEY"
   ```

### Errore: "Port 5000 already in use"

**Soluzione:**
```bash
# Trova il processo
lsof -ti:5000

# Termina il processo
kill -9 $(lsof -ti:5000)

# Oppure cambia porta in server/.env
PORT=5001
```

### Errore: "Table does not exist"

**Soluzione:**
```bash
# Ri-esegui lo script di inizializzazione
psql -U postgres -d movies_explorer -f server/db/init.sql
```

### Errore: "bcrypt not found"

**Soluzione:**
```bash
cd server
npm rebuild bcrypt --build-from-source
```

---

## 📊 Verifica Database

### Accedi al database
```bash
psql -U postgres -d movies_explorer
```

### Query utili
```sql
-- Lista tutte le tabelle
\dt

-- Conta utenti
SELECT COUNT(*) FROM users;

-- Vedi struttura tabella users
\d users

-- Vedi ultimi 10 utenti registrati
SELECT id, username, email, created_at FROM users ORDER BY created_at DESC LIMIT 10;

-- Vedi tutte le recensioni
SELECT r.id, u.username, r.movie_title, r.rating, r.comment 
FROM reviews r 
JOIN users u ON r.user_id = u.id 
ORDER BY r.created_at DESC;

-- Esci
\q
```

---

## 🛠️ Tool Consigliati per Test API

### 1. **Postman** (Più popolare)
- Download: https://www.postman.com/downloads/
- Import collection ready-to-use

### 2. **Insomnia** (Più leggero)
- Download: https://insomnia.rest/download

### 3. **Thunder Client** (VS Code Extension)
- Install: VS Code → Extensions → "Thunder Client"
- Direttamente in VS Code!

### 4. **curl** + **jq** (Linea di comando)
```bash
# macOS
brew install jq

# Linux
sudo apt install jq

# Uso
curl http://localhost:5000/api/movies/popular | jq
```

---

## 📝 Comandi Utili

### Server
```bash
# Avvia in development (auto-reload)
npm run dev

# Avvia in production
npm start

# Test
npm test

# Test con coverage
npm run test:coverage
```

### Database
```bash
# Backup database
pg_dump -U postgres movies_explorer > backup.sql

# Restore database
psql -U postgres movies_explorer < backup.sql

# Reset database (attenzione: cancella tutti i dati!)
psql -U postgres -c "DROP DATABASE movies_explorer;"
psql -U postgres -c "CREATE DATABASE movies_explorer;"
psql -U postgres -d movies_explorer -f server/db/init.sql
```

---

## 🎯 Prossimi Passi

Ora che il backend è funzionante:

1. **Testa tutti gli endpoint** con Postman o curl
2. **Verifica il database** con le query SQL
3. **Inizia il frontend** (Settimana 3-4)
4. **Scrivi i test** (Settimana 5-6)

---

## 📚 Documentazione API Completa

Tutti gli endpoint disponibili sono documentati in:
- `IMPLEMENTATION_COMPLETE.md` - Lista completa API
- `CODE_EXAMPLES.md` - Esempi di utilizzo
- `COMMANDS.md` - Comandi per testing

---

## 💡 Tips

1. **Salva il JWT token** dopo login per usarlo nei test
2. **Usa environment variables** in Postman per il token
3. **Controlla i log del server** per debugging
4. **Usa pgAdmin** per una GUI del database (opzionale)

---

## ✅ Checklist di Verifica

- [ ] PostgreSQL in esecuzione
- [ ] Database `movies_explorer` creato
- [ ] Schema inizializzato (tabelle create)
- [ ] TMDB API Key configurata in `.env`
- [ ] Dipendenze installate (`npm install`)
- [ ] Server avviato (`npm run dev`)
- [ ] Health check funzionante (http://localhost:5000/health)
- [ ] Registrazione utente funzionante
- [ ] Login funzionante
- [ ] Endpoint movies funzionanti (con TMDB key)

---

**Server Status**: 🟢 **RUNNING**
**Database Status**: 🟢 **CONNECTED**
**API Status**: 🟢 **READY**

**Buon Sviluppo! 🚀**
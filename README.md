# Asterr Assessment - Full Stack Application

A full-stack application with a TypeScript/Express backend, React frontend, and Python data processing scripts.

## Project Structure

```
asterra/
├── backend/          # TypeScript/Express.js API server
├── frontend/         # React + Vite frontend application
├── scripts/          # Python data processing scripts
└── output/           # Generated output files
```

## Quick Start

### Prerequisites

- **Node.js** (v16+) - for backend and frontend
- **npm or yarn** - package manager
- **Python 3.8+** - for scripts
- **PostgreSQL** - for database (optional for local testing)

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd asterra
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend (in a new terminal)
   cd frontend
   npm install

   # Scripts (optional - Python virtual environment)
   python3 -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install numpy matplotlib
   ```

---

## Backend Setup

### Quick Start

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database configuration
npm run dev
```

The backend will start on `http://localhost:3001/api`

### Scripts

- `npm run dev` - Start development server (ts-node with hot-reload)
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types without emitting code

### Environment Configuration

Create a `.env` file in the `backend` directory (copy from `.env.example`):

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=test_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_SCHEMA=public
DB_POOL_SIZE=10

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Database Setup

1. Create PostgreSQL database:
   ```sql
   CREATE DATABASE test_db;
   ```

2. Create required tables:
   ```sql
   CREATE TABLE users (
     user_id SERIAL PRIMARY KEY,
     first_name VARCHAR(255) NOT NULL,
     last_name VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE hobbies (
     hobby_id SERIAL PRIMARY KEY,
     user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
     hobby_name VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

### API Endpoints

**Base URL:** `http://localhost:3001/api`

#### Users
- `GET /users` - Get all users
- `GET /users/:userId` - Get user by ID
- `GET /users/with-hobbies/all` - Get all users with their hobbies
- `POST /users` - Create new user
  ```json
  {
    "first_name": "John",
    "last_name": "Doe"
  }
  ```
- `DELETE /users/:userId` - Delete user (cascades to hobbies)

#### Hobbies
- `GET /hobbies` - Get all hobbies
- `POST /hobbies` - Create hobby
  ```json
  {
    "user_id": 1,
    "hobbies": "Reading"
  }
  ```
- `DELETE /hobbies/:userId/:hobby` - Delete hobby for user

---

## Frontend Setup

### Quick Start

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

### Scripts

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build for production
- `npm run build:dev` - Build with development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests once
- `npm run test:watch` - Watch mode for tests

### Connecting to Backend

The frontend automatically connects to the backend at:
- **Development:** `http://localhost:3001/api`
- **Production:** `/api` (relative URL for same-origin requests)

API configuration is in `src/config/api.ts`:
```typescript
export const API_URL = '/api';
export const ENDPOINTS = {
  USERS: '/users',
  USERS_HOBBIES: '/users/with-hobbies/all',
  HOBBIES: '/hobbies',
};
```

### Pages

- **Home (`/`)** - Dashboard with all users and their hobbies
- **Add User (`/add-user`)** - Form to create new users
- **Add Hobby (`/add-hobby`)** - Form to add hobbies to users

---

## Scripts (Python)

Python data processing scripts for analysis and transformation.

### Setup

```bash
cd scripts

# Create and activate virtual environment
python3 -m venv ../.venv
source ../.venv/bin/activate  # On Windows: ..\.venv\Scripts\activate

# Install dependencies
pip install numpy matplotlib
```

### Scripts

#### `part1.py`
Processes data from CSV files and generates sorted analysis.

```bash
python part1.py
```

**Features:**
- Reads data from `data/` directory
- Sorts by grade (descending)
- Outputs results to `../output/`

#### `part2.py`
Performs raster transformations and visualization.

```bash
python part2.py
```

**Features:**
- Generates synthetic raster data
- Applies transformations (rotation, scaling, filtering)
- Creates visualization plots
- Outputs results to `../output/`

### Data Location

- **Input:** `scripts/data/`
- **Output:** `output/`

---

## Deployment

### Combined Development (Frontend + Backend)

To serve the frontend from the backend's static files:

```bash
# Build frontend
cd frontend
npm run build

# Copy built files to backend's public directory
cp -r dist/* ../backend/public/

# Run backend
cd ../backend
npm run dev
```

Access the application at: `http://localhost:3001`

### Production Build

1. Build frontend with production configuration:
   ```bash
   cd frontend
   npm run build
   ```

2. Build backend:
   ```bash
   cd backend
   npm run build
   ```

3. Ensure `.env` file is configured with production database and settings

4. Start server:
   ```bash
   cd backend
   npm start
   ```

---

## Development Workflow

### Starting All Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Scripts (if needed):**
```bash
cd scripts
source ../.venv/bin/activate
python part1.py  # or part2.py
```

### Debugging

- **Backend:** Check logs in `backend/combined.log` and `backend/error.log`
- **Frontend:** Use browser DevTools (F12)
- **Network:** Use DevTools Network tab to inspect API calls
- **Database:** Connect with `psql` or GUI tools like DBeaver

---

## Troubleshooting

### Backend Won't Start
- Check PostgreSQL is running
- Verify `.env` file exists and has correct credentials
- Check port 3001 is available: `lsof -i :3001`

### Frontend Can't Connect to API
- Verify backend is running on port 3001
- Check CORS configuration in `backend/.env`
- Check browser console for network errors

### Python Scripts Error
- Ensure virtual environment is activated
- Verify data files exist in `scripts/data/`
- Check NumPy/Matplotlib are installed: `pip list`

### Database Connection Issues
- Verify PostgreSQL service is running
- Check database credentials in `.env`
- Confirm database and tables exist
- Test connection: `psql -h localhost -U postgres -d test_db`

---

## Technology Stack

### Backend
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL with pg
- **Security:** Helmet, CORS, Rate Limiting
- **Logging:** Winston
- **Validation:** Joi

### Frontend
- **Library:** React 18+
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** Shadcn/ui
- **Routing:** React Router
- **State:** React Query

### Scripts
- **Language:** Python 3.8+
- **Data Processing:** NumPy
- **Visualization:** Matplotlib

---

## Support

For issues or questions, check the individual README files in each directory:
- `backend/README.md`
- `frontend/README.md`

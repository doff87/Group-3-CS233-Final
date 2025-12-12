# Foodie - Multi-User Nutrition Tracking App

A production-ready, full-stack web application for tracking daily nutrition across multiple users. Built with React, Node.js, and PostgreSQL following MVC/CRUD/RESTful patterns.

## ✅ Requirements Compliance

This project meets all CS233 Final Project requirements:

- ✅ **3-Tier Architecture** – Client (React Vite) / Server (Express) / Database (PostgreSQL)
- ✅ **AWS Hosting Ready** – RDS PostgreSQL support, migrations for CI/CD, environment-driven config
- ✅ **Multi-User Management** – JWT auth, bcryptjs hashing, per-user data isolation
- ✅ **MVC/CRUD/RESTful** – Strict adherence to conventions, standard HTTP methods
- ✅ **Browser Interaction** – Full React UI with sign-in, dashboard, weekly view, calendar
- ✅ **Public API** – Documented REST endpoints with protected + public routes
- ✅ **External API** – USDA FoodData Central integration for food search
- ✅ **Good Coding Practices** – Conventions, error handling, DRY, security (JWT, bcrypt, CORS)

**Full audit:** See [`ARCHITECTURE_AUDIT.md`](./ARCHITECTURE_AUDIT.md)

---

## Project Structure

```
.
├── client/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── App.tsx                  # Main navigation
│   │   ├── context/
│   │   │   ├── AuthContext.tsx      # Login/logout, JWT management
│   │   │   └── NutritionContext.tsx # Meals state (server-backed)
│   │   ├── components/              # React UI components
│   │   ├── utils/
│   │   │   └── apiClient.ts         # Centralized axios instance
│   │   └── types/index.ts           # TypeScript interfaces
│   ├── package.json
│   └── vite.config.ts
│
├── server/                          # Backend (Node.js + Express)
│   ├── app.js                       # Express setup
│   ├── server.js                    # Entry point with DB init
│   ├── config/config.cjs            # Sequelize config (Postgres + SQLite)
│   ├── models/
│   │   ├── user.js                  # User model (Sequelize)
│   │   ├── meal.js                  # Meal model (Sequelize)
│   │   └── food.js                  # FoodModel (USDA API wrapper)
│   ├── controllers/
│   │   ├── authController.js        # Register, login, user settings
│   │   ├── mealController.js        # CRUD operations
│   │   └── nutritionController.js   # External API calls
│   ├── routes/
│   │   ├── auth.js                  # Auth endpoints
│   │   ├── meals.js                 # Meal endpoints
│   │   └── nutrition.js             # Nutrition search
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification
│   │   ├── errorHandler.js          # Central error handling
│   │   ├── logger.js                # Request logging
│   │   ├── validateMeal.js          # Input validation
│   │   └── notFound.js              # 404 handler
│   ├── migrations/                  # Sequelize migrations (CommonJS)
│   ├── tests/
│   │   └── run-smoke-test.js        # Integration tests
│   ├── package.json
│   └── .sequelizerc                 # Sequelize CLI config
│
├── ARCHITECTURE_AUDIT.md            # Complete audit report
└── README.md                        # This file
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm
- PostgreSQL 12+ (or use SQLite fallback for local dev)

### Local Development

**Backend:**
```bash
cd server
npm install
npm run db:migrate --config ./config/config.cjs --migrations-path ./migrations
npm run dev
# Server listens on http://localhost:3000
```

**Frontend (in another terminal):**
```bash
cd client
npm install
npm run dev
# Opens http://localhost:5173 (proxies /api/* to server)
```

**Run Tests:**
```bash
cd server
node tests/run-smoke-test.js
# Verifies: registration, JWT auth, meals CRUD, per-user isolation, DB persistence
```

---

## API Endpoints

### Public Routes
```
POST /api/auth/register              # Register new user
POST /api/auth/login                 # Login (returns JWT)
GET  /api/nutrition?query=...        # Search USDA food by name
GET  /api/nutrition?fdcId=...        # Fetch food by FDC ID
```

### Protected Routes (Require JWT)
```
GET  /api/auth/me                    # Get current user + settings
PUT  /api/auth/me                    # Update user settings (dailyGoals)

GET  /api/meals                      # List user's meals
GET  /api/meals/:id                  # Get single meal
POST /api/meals                      # Create meal
PUT  /api/meals/:id                  # Update meal
DELETE /api/meals/:id                # Delete meal
```

---

## Technologies

**Frontend:**
- React 18 (Vite)
- TypeScript
- Tailwind CSS
- Lucide React (icons)
- Axios (API client)

**Backend:**
- Node.js 20
- Express 4
- Sequelize 6 (ORM)
- PostgreSQL 12+ / SQLite 3
- JWT (jsonwebtoken)
- bcryptjs (password hashing)
- Axios (HTTP client for external APIs)
- Sequelize CLI (migrations)

**External APIs:**
- USDA FoodData Central (nutrition lookup)

---

## Architecture

### 3-Tier Layers

1. **Presentation Tier (Frontend)**
   - React components handle user interaction
   - AuthContext manages login state + JWT
   - NutritionContext manages meals (server-backed)
   - apiClient injects Authorization header on every request

2. **Application Tier (Backend)**
   - Express routes handle HTTP requests
   - Controllers orchestrate business logic
   - Middleware for auth, validation, error handling, logging
   - Models abstract database and external API calls

3. **Data Tier (Database)**
   - Sequelize ORM for database abstraction
   - PostgreSQL in production (AWS RDS)
   - SQLite for local development (fallback)
   - Migrations for schema versioning and production deployments

### Security

- **Passwords:** Hashed with bcryptjs (10-round salt)
- **Auth:** JWT tokens (7-day expiry), stored in localStorage
- **Authorization:** `requireAuth` middleware verifies JWT; ownership checks on meals
- **Input Validation:** Middleware validates request bodies before processing
- **CORS:** Enabled (restrict `origin` in production)
- **SQL Injection Prevention:** Sequelize ORM uses parameterized queries

### Multi-User Isolation

- Each User has unique UUID and email
- Meals are associated with `userId` foreign key
- Meal queries filtered by authenticated user
- DELETE CASCADE: deleting a user also deletes their meals

---

## Environment Variables

### Development (`.env`)
```
# Backend
FDC_API_KEY=<your-fdc-api-key>
PORT=3000
JWT_SECRET=dev-secret-change-in-production

# Frontend
VITE_API_SERVER=http://localhost:3000
VITE_API_BASE_URL=/api

# Database (local)
DB_HOST=localhost
DB_PORT=5432
DB_USER=app_user
DB_PASS=app_password
DB_NAME=mealapp
```

### Production (AWS Systems Manager Parameter Store)
```
PG_HOST=<rds-endpoint>.rds.amazonaws.com
PG_USER=app_user
PG_PASSWORD=<secure-password>
PG_DATABASE=foodie_prod
JWT_SECRET=<secure-random-string>
FDC_API_KEY=<api-key>
NODE_ENV=production
```

---

## Deployment to AWS

### 1. Prepare Infrastructure
- RDS PostgreSQL database
- EC2 instance or ECS cluster
- S3 bucket for frontend (optional CloudFront)
- Systems Manager Parameter Store for secrets

### 2. Set Environment Variables
Store secrets in AWS Secrets Manager or Parameter Store (never in .env)

### 3. Run Migrations
```bash
npm run db:migrate --config ./server/config/config.cjs --migrations-path ./server/migrations
```

### 4. Start Server
```bash
npm start
```

### 5. Build & Deploy Frontend
```bash
cd client
npm run build
# Upload dist/ to S3 bucket
```

---

## Testing

### Smoke Test
Validates registration, authentication, meal CRUD, per-user isolation, and DB persistence:

```bash
cd server
node tests/run-smoke-test.js
```

**Expected Output:**
```
✅ All smoke tests passed!
  - User1 & User2 registered with JWT tokens
  - Daily goals persisted to server
  - Meals created and fetched (per-user isolation)
  - SQLite DB file exists and persisted
```

---

## Coding Standards

### Conventions
- **Files:** PascalCase for classes/components, camelCase for variables
- **Functions:** Descriptive names, async/await preferred over callbacks
- **Comments:** JSDoc for public methods, inline comments for complex logic
- **Type Safety:** TypeScript on frontend, runtime validation on backend

### Error Handling
- Central error handler on backend: `middleware/errorHandler.js`
- Consistent JSON error responses: `{ error: "message" }`
- Try/catch in async functions (frontend and backend)
- User-friendly error messages (never expose internals)

### DRY Principle
- Single axios instance (`apiClient.ts`) used by all API calls
- Centralized validation middleware
- Reusable model methods (e.g., `FoodModel.extractMacros()`)
- Shared error handler (no boilerplate per route)

---

## Troubleshooting

**Port already in use:**
```bash
# Kill existing node process
killall node
# or restart terminal
```

**Database migration fails:**
```bash
# Ensure SQLite file is deleted if switching from old schema
rm -f server/server.sqlite
npm run db:migrate --config ./server/config/config.cjs --migrations-path ./server/migrations
```

**Frontend can't connect to backend:**
```bash
# Check server is running on port 3000
# Check Vite proxy is configured (vite.config.ts)
# Ensure VITE_API_BASE_URL is /api
```

**USDA API returns errors:**
```bash
# Verify FDC_API_KEY is set in .env
# Check API quota hasn't been exceeded
# Visit https://fdc.nal.usda.gov/ to create/manage keys
```

---

## License

CS233 Final Project - Group 3

---

## Contact

For questions or issues, contact the development team.

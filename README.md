# Task Manager API

A RESTful API for task management built with Node.js and Express.js. Users are stored in **PostgreSQL** and tasks are stored in **MongoDB**. Authentication is handled via **JWT**.

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **User Database**: PostgreSQL (via `pg`)
- **Task Database**: MongoDB (via Mongoose)
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcryptjs
- **Validation**: Joi
- **Local DB Setup**: Docker + Docker Compose

---

## Folder Structure

```
task-manager-api/
├── src/
│   ├── app.js                  # Entry point — sets up Express, DB connections, routes
│   ├── config/
│   │   ├── db.postgres.js      # PostgreSQL connection + auto-creates users table
│   │   └── db.mongo.js         # MongoDB connection via Mongoose
│   ├── middleware/
│   │   ├── auth.middleware.js  # JWT verification — protects routes
│   │   └── error.middleware.js # Global error handler
│   ├── models/
│   │   └── Task.model.js       # Mongoose schema for tasks
│   ├── validators/
│   │   ├── auth.validator.js   # Joi schemas for register/login
│   │   └── task.validator.js   # Joi schemas for create/update task
│   ├── controllers/
│   │   ├── auth.controller.js  # Register and login logic
│   │   ├── user.controller.js  # Get profile logic
│   │   └── task.controller.js  # Full CRUD logic for tasks
│   └── routes/
│       ├── auth.routes.js      # /api/auth
│       ├── user.routes.js      # /api/users
│       └── task.routes.js      # /api/tasks
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
└── README.md
```

---

## Setup & Run Locally

### Prerequisites
- Node.js v18+
- Docker (recommended) OR PostgreSQL + MongoDB installed locally

### 1. Clone the repository

```bash
git clone https://github.com/Harshit2607Sharma/task_2.git
cd task_2
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start databases with Docker

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port `5432`
- MongoDB on port `27017`

> If not using Docker, make sure PostgreSQL and MongoDB are running locally and create a database named `taskmanager`.

### 4. Configure environment variables

```bash
cp .env.example .env
```

The defaults in `.env.example` work with the Docker setup above. Edit if needed:

```
PORT=3000
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=taskmanager
PG_USER=postgres
PG_PASSWORD=yourpassword
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
```

### 5. Start the server

```bash
npm run dev       # development (nodemon, auto-restarts)
npm start         # production
```

You should see:
```
Server running on port 3000
PostgreSQL connected
Users table ready
MongoDB connected
```

The `users` table is created automatically on first run — no manual SQL needed.

---

## API Documentation

### Base URL
```
http://localhost:3000/api
```

For all **protected routes**, include this header:
```
Authorization: Bearer <your_jwt_token>
```

---

### Auth Endpoints

#### POST `/auth/register`
Register a new user.

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "createdAt": "2025-04-05T10:00:00.000Z"
  }
}
```

---

#### POST `/auth/login`
Login and get a JWT.

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

---

### User Endpoints

#### GET `/users/profile` 
Get the currently logged-in user's profile.

**Response `200`:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "createdAt": "2025-04-05T10:00:00.000Z"
  }
}
```

---

### Task Endpoints

#### POST `/tasks` 
Create a new task.

**Request body:**
```json
{
  "title": "Finish assignment",
  "description": "Build the task manager API",
  "dueDate": "2025-12-31",
  "status": "pending"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "task": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0d",
    "userId": 1,
    "title": "Finish assignment",
    "description": "Build the task manager API",
    "dueDate": "2025-12-31T00:00:00.000Z",
    "status": "pending",
    "createdAt": "2025-04-05T10:00:00.000Z"
  }
}
```

---

#### GET `/tasks` 
Get all tasks belonging to the authenticated user.

**Response `200`:**
```json
{
  "success": true,
  "count": 2,
  "tasks": [ ... ]
}
```

---

#### GET `/tasks/:id` 
Get a single task by its MongoDB ID.

**Response `200`:**
```json
{
  "success": true,
  "task": { ... }
}
```

> Returns `404` if not found. Returns `403` if the task belongs to another user.

---

#### PATCH `/tasks/:id` 
Partially update a task. Send only the fields you want to change.

**Request body (any subset):**
```json
{
  "status": "completed"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "task": { ... }
}
```

---

#### DELETE `/tasks/:id` 
Delete a task.

**Response `200`:**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

### Error Responses

| Status | Meaning |
|--------|---------|
| 400 | Bad Request — validation failed or duplicate email |
| 401 | Unauthorized — missing or invalid JWT |
| 403 | Forbidden — trying to access another user's task |
| 404 | Not Found — task or route doesn't exist |
| 500 | Internal Server Error |

**Example validation error `400`:**
```json
{
  "success": false,
  "errors": [
    "Email must be a valid email address",
    "Password must be at least 6 characters long"
  ]
}
```

---

## Design Decisions

- **Dual database**: Users live in PostgreSQL because relational data with unique email constraints fits naturally in SQL. Tasks live in MongoDB for flexible schema and easy extensibility.
- **userId as Number**: The `userId` field in the Task model is a plain Number (matching PostgreSQL's SERIAL id) so tasks and users can be cross-referenced without a join service.
- **Ownership check on every mutation**: Every task controller verifies `task.userId === req.user.id` before allowing update or delete, returning `403` on mismatch.
- **Global error handler**: All async errors are forwarded via `next(err)` to a single middleware — no repeated try-catch error formatting across controllers.
- **Partial updates with PATCH**: The update validator uses Joi's `.min(1)` to require at least one field, preventing empty update requests.
- **Auto table creation**: The PostgreSQL config creates the `users` table on startup if it doesn't exist — no manual migration step needed for local setup.

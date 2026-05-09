# Task Studio Backend

Scalable backend for a full-stack task manager featuring JWT auth, Redis-backed sessions, BullMQ reminder jobs, and Socket.IO real-time notifications.

## Why This Project

This backend was built to showcase practical backend engineering for portfolio and remote-job readiness:
- secure authentication and authorization
- queue-based reminder processing
- real-time event delivery
- operational visibility with health checks and logs

## Tech Stack

- Node.js
- Express 5
- MongoDB + Mongoose
- Redis
- BullMQ
- Socket.IO
- JWT (`jsonwebtoken`)
- Bcrypt
- Nodemon

## Core Features

- User registration and login
- Password hashing with bcrypt
- JWT token issuance and protected routes via middleware
- Redis session storage with TTL
- Task CRUD scoped to authenticated user
- Future reminder scheduling through BullMQ delayed jobs
- Worker-to-server reminder bridge via Redis pub/sub
- Real-time reminder emission to user room with Socket.IO
- Health endpoint for MongoDB + Redis checks

## API Endpoints

Base URL: `http://localhost:5000/api`

### Auth
- `POST /auth/register`
- `POST /auth/login`

### User
- `GET /user` (protected)

### Tasks
- `POST /task/create` (protected)
- `GET /task/all` (protected)
- `PUT /task/:id` (protected)
- `DELETE /task/:id` (protected)
- `PATCH /task/:id/toggle` (protected)

### Health
- `GET /api/health`

## Environment Variables

Create `.env.development` (local) from `.env.example`.

Required keys:
- `PORT`
- `NODE_ENV`
- `MONGO_DB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `SESSION_DURATION`
- `REDIS_URL`
- `REDIS_HOST` (optional fallback)
- `REDIS_PORT` (optional fallback)

## Run Locally

### 1) Install dependencies

```bash
npm install
```

### 2) Start API server

```bash
npm run dev:api
```

### 3) Start reminder worker (new terminal)

```bash
npm run dev:worker
```

## Production Commands

- `npm run start:api`
- `npm run start:worker`

## Reminder Flow (Architecture)

1. Client sends task create with future `willCompleteAt`
2. Backend validates date and creates task in MongoDB
3. Backend enqueues delayed BullMQ job
4. Worker processes job at scheduled time
5. Worker publishes reminder event to Redis channel
6. API server subscribes and forwards event through Socket.IO
7. Frontend receives reminder and shows toast notification

## What I Learned Building This

- Designing async workflows with queue + worker architecture
- Combining Redis use cases (session store + pub/sub bridge)
- Improving runtime debugging via structured logs and health checks
- Handling auth + realtime flows in a clean modular backend design

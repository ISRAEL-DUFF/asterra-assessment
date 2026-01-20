# Asterra Assessment Backend

This is the implementation of the Asterr Assessment backend using Node.js/TypeScript and Postgresql.

## Setup

```bash
npm install
cp .env.example .env
# Update .env with your database credentials

npm run dev
```

## Architecture

```
src/
├── config/          # Configuration (DB, env, etc.)
├── controllers/     # Request handlers
├── middleware/      # Custom middleware (validation, error handling)
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript types & interfaces
├── utils/           # Helper functions
└── index.ts         # Entry point
```

## Getting Started

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Server runs on: `http://localhost:3001`

---

## Key Files to Know

| File | Purpose | Edit? |
|------|---------|-------|
| `src/index.ts` | App entry point | Only for new middleware |
| `src/config/index.ts` | Environment setup | No, unless adding new config |
| `src/routes/` | API endpoints | To add new routes |
| `src/controllers/` | HTTP handlers | To add new handlers |
| `src/services/` | Business logic | To add new features |
| `src/middleware/errorHandler.ts` | Error handling | For custom error logic |
| `src/utils/validation.ts` | Input validation | To add new validation schemas |
| `.env` | Runtime config | Always (credentials, etc.) |
---

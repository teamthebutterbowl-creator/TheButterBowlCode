# Food Ordering Platform — Backend API

Express + MongoDB Atlas API for the user-facing food ordering app.

## Tech stack

- Node.js (ES modules)
- Express.js
- MongoDB Atlas + Mongoose
- JWT auth, Razorpay, bcrypt

## Project structure

```
backend/
├── config/          # Database configuration
├── controllers/     # Route handlers
├── middleware/      # Auth, roles, errors
├── models/          # Mongoose schemas
├── routes/          # API routes
├── app.js           # Express app setup
├── server.js        # Entry point
└── package.json
```

## Setup

From this folder (`userSide/backend`):

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment file and fill in values:

   ```bash
   copy .env.example .env
   ```

3. Run in development:

   ```bash
   npm run dev
   ```

4. Production:

   ```bash
   npm start
   ```

## Environment variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default 5000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret for JWT tokens |
| `RAZORPAY_KEY_ID` | Razorpay key id |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |

## API overview

| Area | Base path |
|------|-----------|
| Health | `/api/health` |
| Products | `/api/products` |
| Auth | `/api/auth` |
| Orders | `/api/orders` |
| Payment | `/api/payment` |

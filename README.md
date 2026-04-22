## Backend

Built with Node.js, Express, MongoDB, and Mongoose.

### Stack
- Node.js and Express for theAPI server
- MongoDB and Mongoose for the database
- bcryptjs for the password hashing
- jsonwebtoken for the authentication
- TypeScript for the type definitions

### Running locally

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Auth API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Create account. Body: name, email, password |
| POST | /api/auth/login | Public | Login. Body: email, password. Returns JWT token |
| GET | /api/auth/me | Protected | Get current user. Header: Authorization: Bearer token |

### Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | Port the server runs on (default 5000) |
| MONGO_URI | MongoDB Atlas connection string |
| JWT_SECRET | Secret key for signing JWT tokens |
| NODE_ENV | development or production |
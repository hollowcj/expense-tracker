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



### Expense & Category Endpoints

All routes require: Authorization: Bearer <token>

| Method | Endpoint                  | Description                      |
|--------|---------------------------|----------------------------------|
| GET    | /api/expenses             | Get all expenses                 |
| GET    | /api/expenses/:id         | Get one expense by ID            |
| POST   | /api/expenses             | Create a new expense             |
| PUT    | /api/expenses/:id         | Update an expense                |
| DELETE | /api/expenses/:id         | Delete an expense                |
| GET    | /api/expenses/summary     | Total spending by category       |
| GET    | /api/categories           | Get all categories               |
| POST   | /api/categories           | Create a new category            |
| PUT    | /api/categories/:id       | Update a category                |
| DELETE | /api/categories/:id       | Delete a category                |
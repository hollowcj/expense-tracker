import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import { errorHandler } from './src/middleware/errorHandler.js';

dotenv.config();          // Load .env variables into process.env
connectDB();              // Connect to MongoDB
const app = express();
app.use(cors());          // Allow requests from the React frontend
app.use(express.json());  // Parse JSON bodies (req.body will work)

// Mount routes — all auth routes live under /api/auth
app.use('/api/auth', authRoutes);

// Global error handler — must be LAST
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

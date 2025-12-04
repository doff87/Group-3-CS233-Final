import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import nutritionRoutes from './routes/nutrition.js';
import mealRoutes from './routes/meals.js';
import authRoutes from './routes/auth.js';

// Custom middleware
import { logger } from './middleware/logger.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requireAuth } from './middleware/auth.js';

const app = express();

// Warn if the external nutrition API key has not been configured
if (!process.env.FDC_API_KEY) {
  console.warn('⚠️ No FDC_API_KEY set in .env! External nutrition lookups will fail until configured.');
}

// Built‑in middleware to parse JSON and URL‑encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for browser access (adjust origin in production)
app.use(cors());

// Serve static assets from the public directory (front‑end build can be placed here)
app.use(express.static('public'));

// Attach request logging
app.use(logger);

// Public API routes
app.use('/api/auth', authRoutes);
app.use('/api/nutrition', nutritionRoutes);

// Protected routes (require authentication)
app.use('/api/meals', requireAuth, mealRoutes);

// If no route matched, return a 404 JSON response
app.use(notFound);

// Central error handler. Must come last.
app.use(errorHandler);

export default app;
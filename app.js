import "dotenv/config";
import express from "express";
import nutritionRoutes from "./routes/nutrition.js";
import mealRoutes from "./routes/meals.js";

// Custom middleware
import { logger } from "./middleware/logger.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Warn if the external nutrition API key has not been configured
if (!process.env.FDC_API_KEY) {
  console.warn("⚠️ No FDC_API_KEY set in .env! External nutrition lookups will fail until configured.");
}

// Built‑in middleware to parse JSON and URL‑encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from the public directory (e.g. front‑end build)
app.use(express.static("public"));

// Attach request logging
app.use(logger);

// API routes. Individual route modules may apply additional validation.
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/meals", mealRoutes);

// If no route matched, return a 404 JSON response
app.use(notFound);

// Central error handler. Must come last.
app.use(errorHandler);

export default app;
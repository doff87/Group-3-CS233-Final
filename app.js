import "dotenv/config";
import express from "express";
import nutritionRoutes from "./routes/nutrition.js";
import mealRoutes from "./routes/meals.js";

const app = express();

if (!process.env.FDC_API_KEY) {
  console.warn("⚠️ No FDC_API_KEY set in .env!");
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// API routes
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/meals", mealRoutes);

export default app;
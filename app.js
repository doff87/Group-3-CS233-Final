import express from "express";
import dotenv from "dotenv";
import nutritionRoutes from "./routes/nutrition.js";

dotenv.config();

const app = express();
const API_KEY = process.env.FDC_API_KEY;

if (!API_KEY) {
  console.warn("⚠️ No FDC_API_KEY set in .env!");
}

// Set view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Serve static files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use("/", nutritionRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
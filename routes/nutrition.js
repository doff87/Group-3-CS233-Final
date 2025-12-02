import express from "express";
import { nutritionController } from "../controllers/nutritionController.js";

const router = express.Router();

// Home page
router.get("/", nutritionController.getHome);

// Search form submission
router.post("/search", express.urlencoded({ extended: true }), nutritionController.postSearch);

// API endpoint
router.get("/api/nutrition", nutritionController.getNutrition);

export default router;
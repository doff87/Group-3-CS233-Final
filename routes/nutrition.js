import express from "express";
import { nutritionController } from "../controllers/nutritionController.js";

const router = express.Router();

router.get("/", nutritionController.getNutrition);

export default router;
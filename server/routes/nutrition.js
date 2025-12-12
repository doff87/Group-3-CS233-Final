import express from 'express';
import { nutritionController } from '../controllers/nutritionController.js';
import { validateNutritionQuery } from '../middleware/validateNutrition.js';

const router = express.Router();

// Single GET endpoint that accepts either a `query` or `fdcId`
// query parameter. The validation middleware ensures one of
// these parameters is provided before delegating to the controller.
router.get('/', validateNutritionQuery, nutritionController.getNutrition);

export default router;
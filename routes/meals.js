import express from 'express';
import { mealController } from '../controllers/mealController.js';
import { validateMealCreation, validateMealUpdate } from '../middleware/validateMeal.js';

const router = express.Router();

// Base route for all meals. Supports listing all meals and creating a new one.
router
  .route('/')
  .get(mealController.list)
  .post(validateMealCreation, mealController.create);

// Operations on a specific meal identified by its id. Allows retrieval,
// update and deletion. Validation is only applied to the update route.
router
  .route('/:id')
  .get(mealController.getById)
  .put(validateMealUpdate, mealController.update)
  .delete(mealController.remove);

export default router;
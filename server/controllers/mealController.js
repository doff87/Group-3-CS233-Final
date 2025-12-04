import { MealModel } from '../models/meal.js';

// Helper to normalise a serving unit to lower case. Default unit is grams.
const normalizeUnit = (value = 'g') => value.toLowerCase();

export const mealController = {
  // GET /api/meals
  // Returns a list of all stored meals. At present the data lives in
  // memory; the database layer will replace this once implemented.
  list: (req, res) => {
    const meals = MealModel.findAll();
    res.json(meals);
  },

  // GET /api/meals/:id
  // Fetch a single meal by its UUID. If the meal is not found, pass a
  // 404 error to the error handler.
  getById: (req, res, next) => {
    const meal = MealModel.findById(req.params.id);
    if (!meal) {
      const error = new Error('Meal not found');
      error.statusCode = 404;
      return next(error);
    }
    res.json(meal);
  },

  // POST /api/meals
  // Create a new meal. Field validation happens in middleware
  // validateMealCreation.
  create: (req, res) => {
    const { foodName, foodId, servingSize, servingUnit = 'g', servings = 1, nutrition, date, isPlanned = false } = req.body || {};

    // Build the payload using the provided values. The unit is normalised.
    const payload = {
      foodId,
      foodName,
      servingSize,
      servingUnit: normalizeUnit(servingUnit),
      servings,
      nutrition,
      date,
      isPlanned,
    };

    const meal = MealModel.create(payload);
    res.status(201).json(meal);
  },

  // PUT /api/meals/:id
  // Update a meal by id. Validation of provided fields happens in
  // validateMealUpdate. If the meal does not exist a 404 error is
  // forwarded to the error handler.
  update: (req, res, next) => {
    const updates = { ...req.body };
    if (updates.servingUnit) {
      updates.servingUnit = normalizeUnit(updates.servingUnit);
    }

    const meal = MealModel.update(req.params.id, updates);
    if (!meal) {
      const error = new Error('Meal not found');
      error.statusCode = 404;
      return next(error);
    }
    res.json(meal);
  },

  // DELETE /api/meals/:id
  // Remove a meal by id. If the meal does not exist a 404 error is
  // forwarded to the error handler.
  remove: (req, res, next) => {
    const removed = MealModel.remove(req.params.id);
    if (!removed) {
      const error = new Error('Meal not found');
      error.statusCode = 404;
      return next(error);
    }
    res.status(204).send();
  },
};
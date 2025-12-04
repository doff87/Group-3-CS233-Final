import { FoodModel } from '../models/food.js';

/**
 * Controller for nutrition endpoints. Handles searching the USDA Food Data
 * Central (FDC) API for food macro information based on either a search
 * query or a specific FDC ID. Utilises the FoodModel to abstract
 * details of the external API.
 */
export const nutritionController = {
  // GET /api/nutrition?query=... or /api/nutrition?fdcId=...
  // Accepts optional servingSize and unit query params to scale
  // nutritional information. Validation of parameters happens in
  // middleware before reaching this handler.
  getNutrition: async (req, res, next) => {
    const query = req.query.query;
    const fdcId = req.query.fdcId;
    const servingSize = req.query.servingSize ? parseFloat(req.query.servingSize) : null;
    const unit = (req.query.unit || 'g').toLowerCase();

    try {
      const food = fdcId
        ? await FoodModel.fetchByFdcId(fdcId, servingSize, unit)
        : await FoodModel.searchFood(query, servingSize, unit);

      if (!food) {
        const error = new Error('Food not found');
        error.statusCode = 404;
        throw error;
      }

      res.json(food);
    } catch (err) {
      // Capture common error codes from axios responses and attach
      // them to the error object. Our error handler will use
      // `statusCode` if present.
      const responseStatus = err?.response?.status;
      if (responseStatus) {
        err.statusCode = responseStatus;
      } else if (err.message === 'Food not found') {
        err.statusCode = 404;
      }
      next(err);
    }
  },
};
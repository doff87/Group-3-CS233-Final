import { FoodModel } from "../models/food.js";

export const nutritionController = {
  // GET /api/nutrition - API endpoint
  getNutrition: async (req, res) => {
    const query = req.query.query;
    const fdcId = req.query.fdcId;
    const servingSize = req.query.servingSize ? parseFloat(req.query.servingSize) : null;
    const unit = (req.query.unit || "g").toLowerCase();

    if (!query && !fdcId) {
      return res.status(400).json({ error: "Missing query or fdcId" });
    }

    try {
      const food = fdcId
        ? await FoodModel.fetchByFdcId(fdcId, servingSize, unit)
        : await FoodModel.searchFood(query, servingSize, unit);

      if (!food) {
        return res.status(404).json({ error: "Food not found" });
      }

      res.json(food);
    } catch (err) {
      console.error(err);
      const statusCode = err?.response?.status || (err?.message === "Food not found" ? 404 : 500);
      res.status(statusCode).json({ error: err?.message || "Server error" });
    }
  },
};
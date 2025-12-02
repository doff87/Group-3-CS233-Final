import { FoodModel } from "../models/food.js";

export const nutritionController = {
  // GET / - render the home page
  getHome: (req, res) => {
    res.render("index", { food: null, error: null });
  },

  // POST /search - handle search form
  postSearch: async (req, res) => {
    const query = req.body.query;
    const servingSize = req.body.servingSize ? parseFloat(req.body.servingSize) : null;
    const unit = req.body.unit || 'g';
    try {
      const food = await FoodModel.searchFood(query, servingSize, unit);
      res.render("index", { food, error: null });
    } catch (err) {
      res.render("index", { food: null, error: err.message });
    }
  },

  // GET /api/nutrition - API endpoint
  getNutrition: async (req, res) => {
    const query = req.query.query;
    const servingSize = req.query.servingSize ? parseFloat(req.query.servingSize) : null;
    const unit = req.query.unit || 'g';
    if (!query) {
      return res.status(400).json({ error: "Missing ?query" });
    }

    try {
      const food = await FoodModel.searchFood(query, servingSize, unit);
      res.json(food);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error", details: err.message });
    }
  },
};
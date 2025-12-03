import { MealModel } from "../models/meal.js";

const normalizeUnit = (value = "g") => value.toLowerCase();

export const mealController = {
  list: (req, res) => {
    const meals = MealModel.findAll();
    res.json(meals);
  },

  getById: (req, res) => {
    const meal = MealModel.findById(req.params.id);
    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }
    res.json(meal);
  },

  create: (req, res) => {
    const { foodName, foodId, servingSize, servingUnit = "g", servings = 1, nutrition, date, isPlanned = false } =
      req.body || {};

    if (!foodName || !nutrition) {
      return res.status(400).json({ error: "foodName and nutrition are required" });
    }

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

  update: (req, res) => {
    const updates = { ...req.body };
    if (updates.servingUnit) {
      updates.servingUnit = normalizeUnit(updates.servingUnit);
    }

    const meal = MealModel.update(req.params.id, updates);
    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }
    res.json(meal);
  },

  remove: (req, res) => {
    const removed = MealModel.remove(req.params.id);
    if (!removed) {
      return res.status(404).json({ error: "Meal not found" });
    }
    res.status(204).send();
  },
};

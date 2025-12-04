import Meal from '../models/meal.js';

const normalizeUnit = (value = 'g') => value.toLowerCase();

export const mealController = {
  // GET /api/meals - list meals belonging to authenticated user
  list: async (req, res, next) => {
    try {
      const where = {};
      if (req.user && req.user.id) where.userId = req.user.id;
      const meals = await Meal.findAll({ where, order: [['date', 'DESC']] });
      res.json(meals);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const meal = await Meal.findByPk(req.params.id);
      if (!meal) {
        const error = new Error('Meal not found');
        error.statusCode = 404;
        return next(error);
      }
      // enforce ownership if user present
      if (req.user && meal.userId !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      res.json(meal);
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const { foodName, foodId, servingSize, servingUnit = 'g', servings = 1, nutrition, date, isPlanned = false } = req.body || {};
      const payload = {
        foodId,
        foodName,
        servingSize: servingSize !== undefined ? Number(servingSize) : null,
        servingUnit: normalizeUnit(servingUnit),
        servings: Number(servings),
        nutrition,
        date: date || new Date().toISOString().split('T')[0],
        isPlanned: Boolean(isPlanned),
      };
      if (req.user && req.user.id) payload.userId = req.user.id;
      const meal = await Meal.create(payload);
      res.status(201).json(meal);
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const updates = { ...req.body };
      if (updates.servingUnit) updates.servingUnit = normalizeUnit(updates.servingUnit);
      const meal = await Meal.findByPk(req.params.id);
      if (!meal) return res.status(404).json({ error: 'Meal not found' });
      if (req.user && meal.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
      await meal.update(updates);
      res.json(meal);
    } catch (err) {
      next(err);
    }
  },

  remove: async (req, res, next) => {
    try {
      const meal = await Meal.findByPk(req.params.id);
      if (!meal) return res.status(404).json({ error: 'Meal not found' });
      if (req.user && meal.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
      await meal.destroy();
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
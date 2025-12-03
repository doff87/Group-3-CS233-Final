import { randomUUID } from "node:crypto";

const meals = [];

const cloneNutrition = (nutrition = {}) => ({
  calories: Number(nutrition.calories ?? 0),
  protein: Number(nutrition.protein ?? 0),
  carbs: Number(nutrition.carbs ?? 0),
  fats: Number(nutrition.fats ?? 0),
});

export class MealModel {
  static findAll() {
    return meals;
  }

  static findById(id) {
    return meals.find((meal) => meal.id === id);
  }

  static create(data) {
    const meal = {
      id: randomUUID(),
      foodId: data.foodId ?? null,
      foodName: data.foodName,
      servingSize: data.servingSize ?? "1",
      servingUnit: data.servingUnit ?? "g",
      servings: Number(data.servings ?? 1),
      nutrition: cloneNutrition(data.nutrition),
      date: data.date ?? new Date().toISOString().split("T")[0],
      isPlanned: Boolean(data.isPlanned),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    meals.push(meal);
    return meal;
  }

  static update(id, updates = {}) {
    const meal = MealModel.findById(id);
    if (!meal) {
      return null;
    }

    if (updates.foodName) meal.foodName = updates.foodName;
    if (Object.hasOwn(updates, "foodId")) meal.foodId = updates.foodId;
    if (Object.hasOwn(updates, "servingSize")) meal.servingSize = updates.servingSize;
    if (Object.hasOwn(updates, "servingUnit")) meal.servingUnit = updates.servingUnit;
    if (Object.hasOwn(updates, "servings")) meal.servings = Number(updates.servings);
    if (updates.nutrition) meal.nutrition = cloneNutrition(updates.nutrition);
    if (Object.hasOwn(updates, "date")) meal.date = updates.date;
    if (Object.hasOwn(updates, "isPlanned")) meal.isPlanned = Boolean(updates.isPlanned);

    meal.updatedAt = new Date().toISOString();
    return meal;
  }

  static remove(id) {
    const index = meals.findIndex((meal) => meal.id === id);
    if (index === -1) {
      return null;
    }
    const [removed] = meals.splice(index, 1);
    return removed;
  }
}

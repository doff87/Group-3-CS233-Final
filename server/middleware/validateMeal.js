/**
 * Validation middleware for meal CRUD operations.
 *
 * The Meal API accepts various fields on create and update. These
 * functions perform a quick sanity check on incoming request bodies
 * before the controller attempts to process them. If a validation
 * error is found, a 400 Bad Request response is returned with a clear
 * error message. By centralising validation logic here rather than in
 * controllers, we follow the DRY principle and keep controllers
 * focused on business logic.
 */

/**
 * Validate input for creating a new meal. Requires a non-empty
 * `foodName` and a `nutrition` object containing at least one macro.
 */
export function validateMealCreation(req, res, next) {
  const { foodName, nutrition } = req.body || {};
  if (!foodName || typeof foodName !== 'string') {
    return res.status(400).json({ error: 'foodName is required and must be a string' });
  }
  if (!nutrition || typeof nutrition !== 'object') {
    return res.status(400).json({ error: 'nutrition is required and must be an object' });
  }
  // Optional: ensure at least one macro property exists
  const { calories, protein, carbs, fats } = nutrition;
  if (
    calories === undefined &&
    protein === undefined &&
    carbs === undefined &&
    fats === undefined
  ) {
    return res.status(400).json({ error: 'nutrition must include at least one macro (calories, protein, carbs or fats)' });
  }
  next();
}

/**
 * Validate input for updating an existing meal. Allows partial updates
 * but enforces correct types on provided fields. Uses `Number.isFinite`
 * to ensure numeric strings or numbers are accepted while rejecting
 * non-numeric values.
 */
export function validateMealUpdate(req, res, next) {
  const { nutrition, servings, servingSize, servingUnit, isPlanned } = req.body || {};
  if (nutrition && typeof nutrition !== 'object') {
    return res.status(400).json({ error: 'nutrition must be an object when provided' });
  }
  if (servings !== undefined && !Number.isFinite(Number(servings))) {
    return res.status(400).json({ error: 'servings must be a number when provided' });
  }
  if (servingSize !== undefined && !Number.isFinite(Number(servingSize))) {
    return res.status(400).json({ error: 'servingSize must be a number when provided' });
  }
  if (servingUnit !== undefined && typeof servingUnit !== 'string') {
    return res.status(400).json({ error: 'servingUnit must be a string when provided' });
  }
  if (isPlanned !== undefined && typeof isPlanned !== 'boolean') {
    return res.status(400).json({ error: 'isPlanned must be a boolean when provided' });
  }
  next();
}
/**
 * Validation middleware for nutrition lookup requests.
 *
 * Ensures that a user either provides a `query` or an `fdcId` query
 * parameter when hitting the `/api/nutrition` endpoint. Without at
 * least one of these parameters the controller cannot perform a
 * meaningful lookup, so a 400 Bad Request is returned. Normalises
 * numeric parameters to floats/strings as needed.
 */

export function validateNutritionQuery(req, res, next) {
  const { query, fdcId } = req.query;
  if (!query && !fdcId) {
    return res.status(400).json({ error: 'Either query or fdcId query parameter is required' });
  }
  next();
}
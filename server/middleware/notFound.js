/**
 * 404 Not Found middleware.
 *
 * If no route matches the incoming request, Express will fall through to
 * the next middleware. By registering this after your routes, any
 * unmatched request will be handled here and a 404 JSON response
 * returned. This avoids Express's default HTML error page and ensures
 * consistent JSON responses across the API.
 *
 * Usage:
 *   import { notFound } from "./middleware/notFound.js";
 *   app.use(notFound);
 */

export function notFound(req, res, next) {
  res.status(404).json({ error: 'Resource not found' });
}
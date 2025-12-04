/**
 * Centralised error handler.
 *
 * Express recognises middleware functions with four arguments as error
 * handlers. When any route or middleware calls `next(err)` or throws an
 * exception inside an async function, Express forwards the error here.
 * This handler logs the error and returns a JSON response with a
 * meaningful message. If the error contains a `statusCode` property
 * (commonly set in custom errors), that status will be used; otherwise
 * a 500 Internal Server Error is returned. This ensures consistent
 * formatting of error responses across the API.
 *
 * Usage:
 *   import { errorHandler } from "./middleware/errorHandler.js";
 *   app.use(errorHandler);
 */

export function errorHandler(err, req, res, next) {
  // Provide a default status if none was set on the error object
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  // Log the full error stack for debugging; in production you may want
  // to use a proper logger instead of console.error
  console.error(err);
  res.status(status).json({ error: message });
}
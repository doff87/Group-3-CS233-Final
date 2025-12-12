/**
 * Request logging middleware.
 *
 * Logs the HTTP method, request URL and response status code along with
 * the time taken to process the request. This middleware is deliberately
 * lightweight and avoids pulling in external dependencies such as
 * `morgan` to keep the stack lean while still providing useful insight
 * into the behaviour of the API during development and production.
 *
 * Usage:
 *   import { logger } from "./middleware/logger.js";
 *   app.use(logger);
 */

export function logger(req, res, next) {
  const { method, originalUrl } = req;
  const start = Date.now();
  // Hook into the finish event to capture the status code and duration
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    // Use console.log rather than console.error so this can be piped or
    // redirected easily when running in Docker or on AWS
    console.log(`${method} ${originalUrl} ${status} - ${duration}ms`);
  });
  next();
}
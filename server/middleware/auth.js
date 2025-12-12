/**
 * Placeholder authentication middleware.
 *
 * This project requires managing multiple users, which typically
 * necessitates some form of authentication. A full implementation
 * would verify a session token, JWT, or API key against a user
 * database. Because the database layer is being implemented by
 * another teammate, this middleware currently acts as a stub that
 * simply passes control to the next handler. It is structured to
 * accept asynchronous logic in the future.
 */

import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-prod';

export async function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing Authorization token' });
    }
    const token = auth.slice(7);
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    const userId = payload.sub;
    const user = await User.findByPk(userId);
    if (!user) return res.status(401).json({ error: 'Invalid user' });
    req.user = { id: user.id, email: user.email };
    next();
  } catch (err) {
    next(err);
  }
}
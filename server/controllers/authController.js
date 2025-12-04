import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-prod';
const JWT_EXPIRES = '7d';

export const authController = {
  register: async (req, res, next) => {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ error: 'email and password are required' });
      }
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(409).json({ error: 'User already exists' });
      }
      const user = await User.createWithPassword(email, password);
      const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
      res.status(201).json({ token, user: { id: user.id, email: user.email } });
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ error: 'email and password are required' });
      }
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      const ok = await user.verifyPassword(password);
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
      res.json({ token, user: { id: user.id, email: user.email } });
    } catch (err) {
      next(err);
    }
  }
  ,

  // GET /api/auth/me - return current user info (requires auth middleware)
  me: async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) return res.status(401).json({ error: 'Not authenticated' });
      const user = await User.findByPk(req.user.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json({ id: user.id, email: user.email, dailyGoals: user.dailyGoals || null });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/auth/me - update current user settings (e.g., dailyGoals)
  updateMe: async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) return res.status(401).json({ error: 'Not authenticated' });
      const user = await User.findByPk(req.user.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      const updates = {};
      if (req.body && Object.prototype.hasOwnProperty.call(req.body, 'dailyGoals')) {
        updates.dailyGoals = req.body.dailyGoals;
      }
      await user.update(updates);
      res.json({ id: user.id, email: user.email, dailyGoals: user.dailyGoals || null });
    } catch (err) {
      next(err);
    }
  }
};

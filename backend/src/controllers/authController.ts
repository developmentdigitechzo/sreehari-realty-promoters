import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { db, memoryStore } from '../config/db.js';
import { comparePassword, generateToken } from '../utils/auth.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    let user: any = null;

    if (db.isPostgres()) {
      const userRes = await db.query(
        `SELECT id, name, email, password_hash, role, is_active FROM users WHERE email = $1`,
        [cleanEmail]
      );
      if (userRes.rows.length > 0) {
        user = userRes.rows[0];
      }
    } else {
      user = memoryStore.users.find((u) => u.email === cleanEmail);
    }

    if (!user) {
      return sendError(res, 'Invalid email or password', null, 401);
    }

    if (!user.is_active) {
      return sendError(res, 'Account is disabled. Please contact administrator.', null, 403);
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password', null, 401);
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return sendSuccess(res, 'Login successful', {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', null, 401);
    }

    let user: any = null;

    if (db.isPostgres()) {
      const userRes = await db.query(
        `SELECT id, name, email, role, is_active, created_at FROM users WHERE id = $1`,
        [req.user.id]
      );
      if (userRes.rows.length > 0) {
        user = userRes.rows[0];
      }
    } else {
      user = memoryStore.users.find((u) => u.id === req.user?.id || u.email === req.user?.email);
    }

    if (!user) {
      return sendError(res, 'User not found', null, 404);
    }

    return sendSuccess(res, 'User profile fetched successfully', {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response) => {
  return sendSuccess(res, 'Logged out successfully');
};

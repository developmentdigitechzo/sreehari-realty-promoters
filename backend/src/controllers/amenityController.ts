import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { db, memoryStore } from '../config/db.js';
import { sendSuccess } from '../utils/response.js';

export const amenitySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  icon: z.string().optional(),
  category: z.string().default('GENERAL'),
});

export const getAmenities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (db.isPostgres()) {
      const result = await db.query(`SELECT * FROM amenities ORDER BY category ASC, name ASC`);
      return sendSuccess(res, 'Amenities fetched successfully', result.rows);
    }
    return sendSuccess(res, 'Amenities fetched successfully', memoryStore.amenities);
  } catch (error) {
    next(error);
  }
};

export const createAmenity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, icon, category } = req.body;

    if (db.isPostgres()) {
      const result = await db.query(
        `
        INSERT INTO amenities (name, icon, category)
        VALUES ($1, $2, $3)
        ON CONFLICT (name) DO UPDATE SET icon = EXCLUDED.icon, category = EXCLUDED.category
        RETURNING *;
      `,
        [name, icon, category || 'GENERAL']
      );

      return sendSuccess(res, 'Amenity saved successfully', result.rows[0], 201);
    }

    const newAmenity = {
      id: `a-${Date.now()}`,
      name,
      icon,
      category: category || 'GENERAL',
    };
    memoryStore.amenities.push(newAmenity);
    return sendSuccess(res, 'Amenity saved successfully', newAmenity, 201);
  } catch (error) {
    next(error);
  }
};

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { db } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { generateSlug } from '../utils/slug.js';

export const propertySchema = z.object({
  project_id: z.string().optional().nullable(),
  title: z.string().min(2, 'Title is required'),
  plot_number: z.string().optional().nullable(),
  property_type: z.enum(['RESIDENTIAL_PLOT', 'COMMERCIAL_PLOT', 'VILLA_PLOT']).default('RESIDENTIAL_PLOT'),
  area_sqft: z.number().min(1, 'Area in sq.ft must be positive'),
  dimensions: z.string().optional().nullable(),
  facing: z.string().optional().nullable(),
  price: z.number().min(0, 'Price must be positive'),
  price_display: z.string().optional().nullable(),
  status: z.enum(['AVAILABLE', 'BOOKED', 'SOLD']).default('AVAILABLE'),
  is_featured: z.boolean().default(false),
  is_visible: z.boolean().default(true),
  description: z.string().optional().nullable(),
  main_image_url: z.string().optional().nullable(),
});

// GET /api/properties (Public)
export const getProperties = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { project_id, status, type, min_price, max_price, admin } = req.query;

    let query = `
      SELECT 
        pr.*,
        p.name as project_name,
        p.slug as project_slug,
        p.location as project_location
      FROM properties pr
      LEFT JOIN projects p ON p.id = pr.project_id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (admin !== 'true') {
      query += ` AND pr.is_visible = TRUE`;
    }

    if (project_id) {
      query += ` AND pr.project_id = $${paramIndex++}`;
      params.push(project_id);
    }

    if (status && status !== 'ALL') {
      query += ` AND pr.status = $${paramIndex++}`;
      params.push(status);
    }

    if (type && type !== 'ALL') {
      query += ` AND pr.property_type = $${paramIndex++}`;
      params.push(type);
    }

    if (min_price) {
      query += ` AND pr.price >= $${paramIndex++}`;
      params.push(min_price);
    }

    if (max_price) {
      query += ` AND pr.price <= $${paramIndex++}`;
      params.push(max_price);
    }

    query += ` ORDER BY pr.is_featured DESC, pr.created_at DESC`;

    const result = await db.query(query, params);
    return sendSuccess(res, 'Properties fetched successfully', result.rows);
  } catch (error) {
    next(error);
  }
};

// GET /api/properties/:slug (Public)
export const getPropertyBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;

    const propertyRes = await db.query(
      `
      SELECT 
        pr.*,
        p.name as project_name,
        p.slug as project_slug,
        p.location as project_location,
        p.city as project_city
      FROM properties pr
      LEFT JOIN projects p ON p.id = pr.project_id
      WHERE pr.slug = $1 OR pr.id::text = $1
    `,
      [slug]
    );

    if (propertyRes.rows.length === 0) {
      return sendError(res, 'Property / Plot not found', null, 404);
    }

    const property = propertyRes.rows[0];

    // Fetch images
    const imagesRes = await db.query(
      `SELECT * FROM media_images WHERE property_id = $1 ORDER BY sort_order ASC, created_at ASC`,
      [property.id]
    );
    property.images = imagesRes.rows;

    return sendSuccess(res, 'Property details fetched successfully', property);
  } catch (error) {
    next(error);
  }
};

// POST /api/properties (Protected Admin)
export const createProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const baseSlug = generateSlug(data.title);
    let slug = baseSlug;
    let count = 1;

    while (true) {
      const check = await db.query(`SELECT id FROM properties WHERE slug = $1`, [slug]);
      if (check.rows.length === 0) break;
      slug = `${baseSlug}-${count++}`;
    }

    // Auto calculate price display if not specified
    let priceDisplay = data.price_display;
    if (!priceDisplay && data.price) {
      const lakhs = (data.price / 100000).toFixed(2);
      priceDisplay = `₹${lakhs} Lakhs`;
    }

    const insertRes = await db.query(
      `
      INSERT INTO properties (
        project_id, title, slug, plot_number, property_type, area_sqft,
        dimensions, facing, price, price_display, status, is_featured,
        is_visible, description, main_image_url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *;
    `,
      [
        data.project_id || null,
        data.title,
        slug,
        data.plot_number || null,
        data.property_type || 'RESIDENTIAL_PLOT',
        data.area_sqft,
        data.dimensions || null,
        data.facing || null,
        data.price,
        priceDisplay,
        data.status || 'AVAILABLE',
        data.is_featured || false,
        data.is_visible !== undefined ? data.is_visible : true,
        data.description || null,
        data.main_image_url || null,
      ]
    );

    return sendSuccess(res, 'Property created successfully', insertRes.rows[0], 201);
  } catch (error) {
    next(error);
  }
};

// PUT /api/properties/:id (Protected Admin)
export const updateProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const existingRes = await db.query(`SELECT id, slug, title FROM properties WHERE id = $1`, [id]);
    if (existingRes.rows.length === 0) {
      return sendError(res, 'Property not found', null, 404);
    }

    let slug = existingRes.rows[0].slug;
    if (data.title && data.title !== existingRes.rows[0].title) {
      slug = generateSlug(data.title);
      const check = await db.query(`SELECT id FROM properties WHERE slug = $1 AND id != $2`, [slug, id]);
      if (check.rows.length > 0) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }
    }

    let priceDisplay = data.price_display;
    if (!priceDisplay && data.price) {
      const lakhs = (data.price / 100000).toFixed(2);
      priceDisplay = `₹${lakhs} Lakhs`;
    }

    const updateRes = await db.query(
      `
      UPDATE properties SET
        project_id = COALESCE($1, project_id),
        title = COALESCE($2, title),
        slug = COALESCE($3, slug),
        plot_number = COALESCE($4, plot_number),
        property_type = COALESCE($5, property_type),
        area_sqft = COALESCE($6, area_sqft),
        dimensions = COALESCE($7, dimensions),
        facing = COALESCE($8, facing),
        price = COALESCE($9, price),
        price_display = COALESCE($10, price_display),
        status = COALESCE($11, status),
        is_featured = COALESCE($12, is_featured),
        is_visible = COALESCE($13, is_visible),
        description = COALESCE($14, description),
        main_image_url = COALESCE($15, main_image_url),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $16
      RETURNING *;
    `,
      [
        data.project_id,
        data.title,
        slug,
        data.plot_number,
        data.property_type,
        data.area_sqft,
        data.dimensions,
        data.facing,
        data.price,
        priceDisplay,
        data.status,
        data.is_featured,
        data.is_visible,
        data.description,
        data.main_image_url,
        id,
      ]
    );

    return sendSuccess(res, 'Property updated successfully', updateRes.rows[0]);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/properties/:id (Protected Admin)
export const deleteProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await db.query(`DELETE FROM properties WHERE id = $1 RETURNING id, title`, [id]);

    if (result.rows.length === 0) {
      return sendError(res, 'Property not found', null, 404);
    }

    return sendSuccess(res, 'Property deleted successfully', result.rows[0]);
  } catch (error) {
    next(error);
  }
};

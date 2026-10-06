import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { db, memoryStore } from '../config/db.js';
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

    if (db.isPostgres()) {
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

      query += ` ORDER BY pr.is_featured DESC, pr.created_at DESC`;

      const result = await db.query(query, params);
      return sendSuccess(res, 'Properties fetched successfully', result.rows);
    }

    // In-memory fallback
    let list = [...memoryStore.properties];

    if (admin !== 'true') {
      list = list.filter((p) => p.is_visible);
    }

    if (project_id) {
      list = list.filter((p) => p.project_id === project_id);
    }

    if (status && status !== 'ALL') {
      list = list.filter((p) => p.status === status);
    }

    const enriched = list.map((pr) => {
      const parent = memoryStore.projects.find((proj) => proj.id === pr.project_id);
      return {
        ...pr,
        project_name: parent?.name,
        project_slug: parent?.slug,
        project_location: parent?.location,
      };
    });

    return sendSuccess(res, 'Properties fetched successfully', enriched);
  } catch (error) {
    next(error);
  }
};

// GET /api/properties/:slug (Public)
export const getPropertyBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;

    if (db.isPostgres()) {
      const propertyRes = await db.query(
        `
        SELECT 
          pr.*,
          p.name as project_name,
          p.slug as project_slug,
          p.location as project_location
        FROM properties pr
        LEFT JOIN projects p ON p.id = pr.project_id
        WHERE pr.slug = $1 OR pr.id::text = $1
      `,
        [slug]
      );

      if (propertyRes.rows.length === 0) {
        return sendError(res, 'Property / Plot not found', null, 404);
      }

      return sendSuccess(res, 'Property details fetched successfully', propertyRes.rows[0]);
    }

    const prop = memoryStore.properties.find((p) => p.slug === slug || p.id === slug);
    if (!prop) {
      return sendError(res, 'Property not found', null, 404);
    }

    const parent = memoryStore.projects.find((proj) => proj.id === prop.project_id);
    return sendSuccess(res, 'Property details fetched successfully', {
      ...prop,
      project_name: parent?.name,
      project_slug: parent?.slug,
      project_location: parent?.location,
    });
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

    let priceDisplay = data.price_display;
    if (!priceDisplay && data.price) {
      const lakhs = (data.price / 100000).toFixed(2);
      priceDisplay = `₹${lakhs} Lakhs`;
    }

    if (db.isPostgres()) {
      let count = 1;
      while (true) {
        const check = await db.query(`SELECT id FROM properties WHERE slug = $1`, [slug]);
        if (check.rows.length === 0) break;
        slug = `${baseSlug}-${count++}`;
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
    }

    // In-memory fallback
    const newProp: any = {
      id: `prop-${Date.now()}`,
      project_id: data.project_id,
      title: data.title,
      slug,
      plot_number: data.plot_number,
      property_type: data.property_type || 'RESIDENTIAL_PLOT',
      area_sqft: data.area_sqft,
      dimensions: data.dimensions,
      facing: data.facing,
      price: data.price,
      price_display: priceDisplay,
      status: data.status || 'AVAILABLE',
      is_featured: data.is_featured || false,
      is_visible: data.is_visible !== undefined ? data.is_visible : true,
      description: data.description,
      main_image_url: data.main_image_url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    memoryStore.properties.unshift(newProp);
    return sendSuccess(res, 'Property created successfully', newProp, 201);
  } catch (error) {
    next(error);
  }
};

// PUT /api/properties/:id (Protected Admin)
export const updateProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = req.body;

    let priceDisplay = data.price_display;
    if (!priceDisplay && data.price) {
      const lakhs = (data.price / 100000).toFixed(2);
      priceDisplay = `₹${lakhs} Lakhs`;
    }

    if (db.isPostgres()) {
      const existingRes = await db.query(`SELECT id, slug, title FROM properties WHERE id = $1`, [id]);
      if (existingRes.rows.length === 0) {
        return sendError(res, 'Property not found', null, 404);
      }

      let slug = existingRes.rows[0].slug;
      if (data.title && data.title !== existingRes.rows[0].title) {
        slug = generateSlug(data.title);
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
    }

    // In-memory fallback
    const index = memoryStore.properties.findIndex((p) => p.id === id);
    if (index === -1) {
      return sendError(res, 'Property not found', null, 404);
    }

    memoryStore.properties[index] = {
      ...memoryStore.properties[index],
      ...data,
      price_display: priceDisplay || memoryStore.properties[index].price_display,
      updated_at: new Date().toISOString(),
    };

    return sendSuccess(res, 'Property updated successfully', memoryStore.properties[index]);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/properties/:id (Protected Admin)
export const deleteProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (db.isPostgres()) {
      const result = await db.query(`DELETE FROM properties WHERE id = $1 RETURNING id, title`, [id]);
      if (result.rows.length === 0) {
        return sendError(res, 'Property not found', null, 404);
      }
      return sendSuccess(res, 'Property deleted successfully', result.rows[0]);
    }

    const index = memoryStore.properties.findIndex((p) => p.id === id);
    if (index === -1) {
      return sendError(res, 'Property not found', null, 404);
    }

    const deleted = memoryStore.properties.splice(index, 1);
    return sendSuccess(res, 'Property deleted successfully', deleted[0]);
  } catch (error) {
    next(error);
  }
};

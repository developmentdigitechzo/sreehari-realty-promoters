import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { db, memoryStore } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { generateSlug } from '../utils/slug.js';

export const projectSchema = z.object({
  name: z.string().min(2, 'Project name is required'),
  tagline: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(2, 'Location is required'),
  address: z.string().optional(),
  city: z.string().default('Chennai'),
  state: z.string().default('Tamil Nadu'),
  total_area: z.string().optional(),
  total_units: z.string().optional(),
  price_range: z.string().optional(),
  price_per_sqft: z.number().optional(),
  status: z.enum(['UPCOMING', 'ONGOING', 'COMPLETED', 'SOLD_OUT']).default('ONGOING'),
  is_featured: z.boolean().default(false),
  is_visible: z.boolean().default(true),
  main_image_url: z.string().min(1, 'Main image is required'),
  brochure_url: z.string().optional(),
  highlights: z.array(z.any()).default([]),
  connectivity: z.array(z.any()).default([]),
  amenity_ids: z.array(z.string()).optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

// GET /api/projects (Public)
export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, featured, search, admin } = req.query;

    if (db.isPostgres()) {
      let query = `
        SELECT 
          p.*,
          COUNT(DISTINCT pr.id) FILTER (WHERE pr.status = 'AVAILABLE') as available_plots_count,
          COUNT(DISTINCT pr.id) as total_plots_count
        FROM projects p
        LEFT JOIN properties pr ON pr.project_id = p.id
        WHERE 1=1
      `;
      const params: any[] = [];
      let paramIndex = 1;

      if (admin !== 'true') {
        query += ` AND p.is_visible = TRUE`;
      }

      if (status && status !== 'ALL') {
        query += ` AND p.status = $${paramIndex++}`;
        params.push(status);
      }

      if (featured === 'true') {
        query += ` AND p.is_featured = TRUE`;
      }

      if (search) {
        query += ` AND (p.name ILIKE $${paramIndex} OR p.location ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
      }

      query += ` GROUP BY p.id ORDER BY p.is_featured DESC, p.created_at DESC`;

      const result = await db.query(query, params);
      const projects = result.rows;

      for (const proj of projects) {
        const amenitiesRes = await db.query(
          `SELECT a.id, a.name, a.icon, a.category 
           FROM amenities a 
           JOIN project_amenities pa ON pa.amenity_id = a.id 
           WHERE pa.project_id = $1`,
          [proj.id]
        );
        proj.amenities = amenitiesRes.rows;
        if (typeof proj.highlights === 'string') {
          try { proj.highlights = JSON.parse(proj.highlights); } catch { proj.highlights = []; }
        }
        if (typeof proj.connectivity === 'string') {
          try { proj.connectivity = JSON.parse(proj.connectivity); } catch { proj.connectivity = []; }
        }
      }

      return sendSuccess(res, 'Projects fetched successfully', projects);
    }

    // In-memory fallback
    let projects = [...memoryStore.projects];

    if (admin !== 'true') {
      projects = projects.filter((p) => p.is_visible);
    }

    if (status && status !== 'ALL') {
      projects = projects.filter((p) => p.status === status);
    }

    if (featured === 'true') {
      projects = projects.filter((p) => p.is_featured);
    }

    if (search) {
      const q = (search as string).toLowerCase();
      projects = projects.filter(
        (p) => p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)
      );
    }

    // Enrich with plots count & amenities
    const enriched = projects.map((p) => {
      const plots = memoryStore.properties.filter((prop) => prop.project_id === p.id);
      return {
        ...p,
        total_plots_count: plots.length,
        available_plots_count: plots.filter((prop) => prop.status === 'AVAILABLE').length,
        amenities: memoryStore.amenities.slice(0, 6),
      };
    });

    return sendSuccess(res, 'Projects fetched successfully', enriched);
  } catch (error) {
    next(error);
  }
};

// GET /api/projects/:slug (Public)
export const getProjectBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;

    if (db.isPostgres()) {
      const projectRes = await db.query(
        `SELECT * FROM projects WHERE slug = $1 OR id::text = $1`,
        [slug]
      );

      if (projectRes.rows.length === 0) {
        return sendError(res, 'Project not found', null, 404);
      }

      const project = projectRes.rows[0];

      const amenitiesRes = await db.query(
        `SELECT a.id, a.name, a.icon, a.category 
         FROM amenities a 
         JOIN project_amenities pa ON pa.amenity_id = a.id 
         WHERE pa.project_id = $1`,
        [project.id]
      );
      project.amenities = amenitiesRes.rows;

      const propertiesRes = await db.query(
        `SELECT * FROM properties WHERE project_id = $1 AND is_visible = TRUE ORDER BY plot_number ASC, price ASC`,
        [project.id]
      );
      project.properties = propertiesRes.rows;

      if (typeof project.highlights === 'string') {
        try { project.highlights = JSON.parse(project.highlights); } catch { project.highlights = []; }
      }
      if (typeof project.connectivity === 'string') {
        try { project.connectivity = JSON.parse(project.connectivity); } catch { project.connectivity = []; }
      }

      return sendSuccess(res, 'Project details fetched successfully', project);
    }

    // In-memory fallback
    const project = memoryStore.projects.find((p) => p.slug === slug || p.id === slug);
    if (!project) {
      return sendError(res, 'Project not found', null, 404);
    }

    const properties = memoryStore.properties.filter(
      (pr) => pr.project_id === project.id && pr.is_visible
    );

    return sendSuccess(res, 'Project details fetched successfully', {
      ...project,
      amenities: memoryStore.amenities.slice(0, 8),
      properties,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/projects (Protected Admin)
export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const baseSlug = generateSlug(data.name);
    let slug = baseSlug;

    if (db.isPostgres()) {
      let count = 1;
      while (true) {
        const check = await db.query(`SELECT id FROM projects WHERE slug = $1`, [slug]);
        if (check.rows.length === 0) break;
        slug = `${baseSlug}-${count++}`;
      }

      const insertRes = await db.query(
        `
        INSERT INTO projects (
          name, slug, tagline, description, location, address, city, state,
          total_area, total_units, price_range, price_per_sqft, status,
          is_featured, is_visible, main_image_url, brochure_url, highlights,
          connectivity, seo_title, seo_description
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
        RETURNING *;
      `,
        [
          data.name,
          slug,
          data.tagline || null,
          data.description,
          data.location,
          data.address || null,
          data.city || 'Chennai',
          data.state || 'Tamil Nadu',
          data.total_area || null,
          data.total_units || null,
          data.price_range || null,
          data.price_per_sqft || null,
          data.status || 'ONGOING',
          data.is_featured || false,
          data.is_visible !== undefined ? data.is_visible : true,
          data.main_image_url,
          data.brochure_url || null,
          JSON.stringify(data.highlights || []),
          JSON.stringify(data.connectivity || []),
          data.seo_title || `${data.name} - Plots in ${data.location}`,
          data.seo_description || data.description.slice(0, 160),
        ]
      );

      return sendSuccess(res, 'Project created successfully', insertRes.rows[0], 201);
    }

    // In-memory fallback
    const newProject: any = {
      id: `proj-${Date.now()}`,
      name: data.name,
      slug,
      tagline: data.tagline,
      description: data.description,
      location: data.location,
      address: data.address,
      city: data.city || 'Chennai',
      state: data.state || 'Tamil Nadu',
      total_area: data.total_area,
      total_units: data.total_units,
      price_range: data.price_range,
      price_per_sqft: data.price_per_sqft,
      status: data.status || 'ONGOING',
      is_featured: data.is_featured || false,
      is_visible: data.is_visible !== undefined ? data.is_visible : true,
      main_image_url: data.main_image_url,
      brochure_url: data.brochure_url,
      highlights: data.highlights || [],
      connectivity: data.connectivity || [],
      seo_title: data.seo_title || `${data.name} - Plots in ${data.location}`,
      seo_description: data.seo_description || data.description.slice(0, 160),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    memoryStore.projects.unshift(newProject);
    return sendSuccess(res, 'Project created successfully', newProject, 201);
  } catch (error) {
    next(error);
  }
};

// PUT /api/projects/:id (Protected Admin)
export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (db.isPostgres()) {
      const existingRes = await db.query(`SELECT id, slug, name FROM projects WHERE id = $1`, [id]);
      if (existingRes.rows.length === 0) {
        return sendError(res, 'Project not found', null, 404);
      }

      let slug = existingRes.rows[0].slug;
      if (data.name && data.name !== existingRes.rows[0].name) {
        slug = generateSlug(data.name);
      }

      const updateRes = await db.query(
        `
        UPDATE projects SET
          name = COALESCE($1, name),
          slug = COALESCE($2, slug),
          tagline = COALESCE($3, tagline),
          description = COALESCE($4, description),
          location = COALESCE($5, location),
          address = COALESCE($6, address),
          city = COALESCE($7, city),
          state = COALESCE($8, state),
          total_area = COALESCE($9, total_area),
          total_units = COALESCE($10, total_units),
          price_range = COALESCE($11, price_range),
          price_per_sqft = COALESCE($12, price_per_sqft),
          status = COALESCE($13, status),
          is_featured = COALESCE($14, is_featured),
          is_visible = COALESCE($15, is_visible),
          main_image_url = COALESCE($16, main_image_url),
          brochure_url = COALESCE($17, brochure_url),
          highlights = COALESCE($18, highlights),
          connectivity = COALESCE($19, connectivity),
          seo_title = COALESCE($20, seo_title),
          seo_description = COALESCE($21, seo_description),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $22
        RETURNING *;
      `,
        [
          data.name,
          slug,
          data.tagline,
          data.description,
          data.location,
          data.address,
          data.city,
          data.state,
          data.total_area,
          data.total_units,
          data.price_range,
          data.price_per_sqft,
          data.status,
          data.is_featured,
          data.is_visible,
          data.main_image_url,
          data.brochure_url,
          data.highlights ? JSON.stringify(data.highlights) : null,
          data.connectivity ? JSON.stringify(data.connectivity) : null,
          data.seo_title,
          data.seo_description,
          id,
        ]
      );

      return sendSuccess(res, 'Project updated successfully', updateRes.rows[0]);
    }

    // In-memory fallback
    const index = memoryStore.projects.findIndex((p) => p.id === id);
    if (index === -1) {
      return sendError(res, 'Project not found', null, 404);
    }

    memoryStore.projects[index] = {
      ...memoryStore.projects[index],
      ...data,
      updated_at: new Date().toISOString(),
    };

    return sendSuccess(res, 'Project updated successfully', memoryStore.projects[index]);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/projects/:id (Protected Admin)
export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (db.isPostgres()) {
      const result = await db.query(`DELETE FROM projects WHERE id = $1 RETURNING id, name`, [id]);
      if (result.rows.length === 0) {
        return sendError(res, 'Project not found', null, 404);
      }
      return sendSuccess(res, 'Project deleted successfully', result.rows[0]);
    }

    const index = memoryStore.projects.findIndex((p) => p.id === id);
    if (index === -1) {
      return sendError(res, 'Project not found', null, 404);
    }

    const deleted = memoryStore.projects.splice(index, 1);
    return sendSuccess(res, 'Project deleted successfully', deleted[0]);
  } catch (error) {
    next(error);
  }
};

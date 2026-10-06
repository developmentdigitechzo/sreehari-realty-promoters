import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { db, memoryStore } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const leadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(7, 'A valid phone number is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  project_id: z.string().optional().nullable(),
  property_id: z.string().optional().nullable(),
  source: z.enum(['WEBSITE_FORM', 'PROJECT_PAGE', 'PROPERTY_PAGE', 'WHATSAPP_CLICK', 'DIRECT_CALL']).default('WEBSITE_FORM'),
  message: z.string().optional(),
});

export const updateLeadSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'FOLLOW_UP', 'CONVERTED', 'ARCHIVED']).optional(),
  notes: z.string().optional().nullable(),
});

// POST /api/leads (Public Lead Capture)
export const createLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;

    if (db.isPostgres()) {
      const result = await db.query(
        `
        INSERT INTO leads (name, phone, email, project_id, property_id, source, message, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'NEW')
        RETURNING *;
      `,
        [
          data.name.trim(),
          data.phone.trim(),
          data.email ? data.email.toLowerCase().trim() : null,
          data.project_id || null,
          data.property_id || null,
          data.source || 'WEBSITE_FORM',
          data.message || null,
        ]
      );

      return sendSuccess(
        res,
        'Thank you for your enquiry! Our real-estate advisor will get in touch with you shortly.',
        result.rows[0],
        201
      );
    }

    // In-memory fallback
    const newLead: any = {
      id: `lead-${Date.now()}`,
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email ? data.email.toLowerCase().trim() : undefined,
      project_id: data.project_id || null,
      property_id: data.property_id || null,
      source: data.source || 'WEBSITE_FORM',
      message: data.message || null,
      status: 'NEW',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    memoryStore.leads.unshift(newLead);

    return sendSuccess(
      res,
      'Thank you for your enquiry! Our real-estate advisor will get in touch with you shortly.',
      newLead,
      201
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/leads (Protected Admin)
export const getLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, project_id, search, limit = 50, page = 1 } = req.query;

    if (db.isPostgres()) {
      let query = `
        SELECT 
          l.*,
          p.name as project_name,
          pr.title as property_title
        FROM leads l
        LEFT JOIN projects p ON p.id = l.project_id
        LEFT JOIN properties pr ON pr.id = l.property_id
        WHERE 1=1
      `;
      const params: any[] = [];
      let paramIndex = 1;

      if (status && status !== 'ALL') {
        query += ` AND l.status = $${paramIndex++}`;
        params.push(status);
      }

      if (project_id) {
        query += ` AND l.project_id = $${paramIndex++}`;
        params.push(project_id);
      }

      if (search) {
        query += ` AND (l.name ILIKE $${paramIndex} OR l.phone ILIKE $${paramIndex} OR l.email ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
      }

      query += ` ORDER BY l.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
      params.push(Number(limit));
      params.push((Number(page) - 1) * Number(limit));

      const result = await db.query(query, params);
      const countRes = await db.query(`SELECT COUNT(*) FROM leads`);

      return sendSuccess(res, 'Leads fetched successfully', {
        leads: result.rows,
        total: parseInt(countRes.rows[0].count, 10),
        page: Number(page),
        limit: Number(limit),
      });
    }

    // In-memory fallback
    let list = [...memoryStore.leads];

    if (status && status !== 'ALL') {
      list = list.filter((l) => l.status === status);
    }

    if (project_id) {
      list = list.filter((l) => l.project_id === project_id);
    }

    if (search) {
      const q = (search as string).toLowerCase();
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          (l.email && l.email.toLowerCase().includes(q))
      );
    }

    const enriched = list.map((lead) => {
      const proj = memoryStore.projects.find((p) => p.id === lead.project_id);
      return {
        ...lead,
        project_name: proj?.name,
      };
    });

    return sendSuccess(res, 'Leads fetched successfully', {
      leads: enriched,
      total: enriched.length,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/leads/:id (Protected Admin)
export const getLeadById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (db.isPostgres()) {
      const result = await db.query(
        `
        SELECT 
          l.*,
          p.name as project_name,
          pr.title as property_title
        FROM leads l
        LEFT JOIN projects p ON p.id = l.project_id
        LEFT JOIN properties pr ON pr.id = l.property_id
        WHERE l.id = $1
      `,
        [id]
      );

      if (result.rows.length === 0) {
        return sendError(res, 'Lead not found', null, 404);
      }

      return sendSuccess(res, 'Lead details fetched successfully', result.rows[0]);
    }

    const lead = memoryStore.leads.find((l) => l.id === id);
    if (!lead) {
      return sendError(res, 'Lead not found', null, 404);
    }

    const proj = memoryStore.projects.find((p) => p.id === lead.project_id);
    return sendSuccess(res, 'Lead details fetched successfully', {
      ...lead,
      project_name: proj?.name,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/leads/:id (Protected Admin)
export const updateLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (db.isPostgres()) {
      const result = await db.query(
        `
        UPDATE leads SET
          status = COALESCE($1, status),
          notes = COALESCE($2, notes),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *;
      `,
        [status, notes, id]
      );

      if (result.rows.length === 0) {
        return sendError(res, 'Lead not found', null, 404);
      }

      return sendSuccess(res, 'Lead updated successfully', result.rows[0]);
    }

    const index = memoryStore.leads.findIndex((l) => l.id === id);
    if (index === -1) {
      return sendError(res, 'Lead not found', null, 404);
    }

    memoryStore.leads[index] = {
      ...memoryStore.leads[index],
      status: status || memoryStore.leads[index].status,
      notes: notes !== undefined ? notes : memoryStore.leads[index].notes,
      updated_at: new Date().toISOString(),
    };

    return sendSuccess(res, 'Lead updated successfully', memoryStore.leads[index]);
  } catch (error) {
    next(error);
  }
};

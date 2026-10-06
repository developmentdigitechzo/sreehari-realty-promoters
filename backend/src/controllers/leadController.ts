import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { db } from '../config/db.js';
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
  } catch (error) {
    next(error);
  }
};

// GET /api/leads (Protected Admin)
export const getLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, project_id, search, limit = 50, page = 1 } = req.query;

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

    // Total count query
    const countRes = await db.query(`SELECT COUNT(*) FROM leads`);

    return sendSuccess(res, 'Leads fetched successfully', {
      leads: result.rows,
      total: parseInt(countRes.rows[0].count, 10),
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
  } catch (error) {
    next(error);
  }
};

// PUT /api/leads/:id (Protected Admin)
export const updateLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

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
  } catch (error) {
    next(error);
  }
};

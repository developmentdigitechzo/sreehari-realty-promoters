import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { db } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(7, 'A valid phone number is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().optional(),
  message: z.string().min(5, 'Message must be at least 5 characters'),
});

// POST /api/contact (Public Contact Form Submission)
export const submitContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, phone, email, subject, message } = req.body;

    const result = await db.query(
      `
      INSERT INTO contact_enquiries (name, phone, email, subject, message, status)
      VALUES ($1, $2, $3, $4, $5, 'UNREAD')
      RETURNING *;
    `,
      [name.trim(), phone.trim(), email.toLowerCase().trim(), subject?.trim() || 'General Enquiry', message.trim()]
    );

    // Also register as a general lead
    await db.query(
      `
      INSERT INTO leads (name, phone, email, source, message, status)
      VALUES ($1, $2, $3, 'WEBSITE_FORM', $4, 'NEW');
    `,
      [name.trim(), phone.trim(), email.toLowerCase().trim(), `Contact Page Enquiry: ${message.trim()}`]
    );

    return sendSuccess(
      res,
      'Your message has been sent successfully. We will get back to you shortly!',
      result.rows[0],
      201
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/contact (Protected Admin)
export const getContacts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db.query(`SELECT * FROM contact_enquiries ORDER BY created_at DESC LIMIT 100`);
    return sendSuccess(res, 'Contact submissions fetched successfully', result.rows);
  } catch (error) {
    next(error);
  }
};

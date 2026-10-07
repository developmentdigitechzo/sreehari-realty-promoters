import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  leadSchema,
  updateLeadSchema,
} from '../controllers/leadController.js';
import { validateRequest } from '../middleware/validate.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

const publicLeadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: 'Too many enquiries submitted from this IP, please try again after 15 minutes or call us directly.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public lead submission
router.post('/', publicLeadLimiter, validateRequest(leadSchema), createLead);

// Protected admin routes
router.get('/', authenticateAdmin, getLeads);
router.get('/:id', authenticateAdmin, getLeadById);
router.put('/:id', authenticateAdmin, validateRequest(updateLeadSchema), updateLead);
router.delete('/:id', authenticateAdmin, deleteLead);

export default router;

import { Router } from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  leadSchema,
  updateLeadSchema,
} from '../controllers/leadController.js';
import { validateRequest } from '../middleware/validate.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

// Public lead submission
router.post('/', validateRequest(leadSchema), createLead);

// Protected admin routes
router.get('/', authenticateAdmin, getLeads);
router.get('/:id', authenticateAdmin, getLeadById);
router.put('/:id', authenticateAdmin, validateRequest(updateLeadSchema), updateLead);

export default router;

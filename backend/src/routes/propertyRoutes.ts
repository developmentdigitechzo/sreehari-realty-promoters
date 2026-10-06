import { Router } from 'express';
import {
  getProperties,
  getPropertyBySlug,
  createProperty,
  updateProperty,
  deleteProperty,
  propertySchema,
} from '../controllers/propertyController.js';
import { validateRequest } from '../middleware/validate.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', getProperties);
router.get('/:slug', getPropertyBySlug);

// Protected Admin routes
router.post('/', authenticateAdmin, validateRequest(propertySchema), createProperty);
router.put('/:id', authenticateAdmin, updateProperty);
router.delete('/:id', authenticateAdmin, deleteProperty);

export default router;

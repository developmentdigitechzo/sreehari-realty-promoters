import { Router } from 'express';
import {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  projectSchema,
} from '../controllers/projectController.js';
import { validateRequest } from '../middleware/validate.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', getProjects);
router.get('/:slug', getProjectBySlug);

// Protected Admin routes
router.post('/', authenticateAdmin, validateRequest(projectSchema), createProject);
router.put('/:id', authenticateAdmin, updateProject);
router.delete('/:id', authenticateAdmin, deleteProject);

export default router;

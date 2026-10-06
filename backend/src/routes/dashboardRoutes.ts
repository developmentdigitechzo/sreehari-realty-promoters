import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/stats', authenticateAdmin, getDashboardStats);

export default router;

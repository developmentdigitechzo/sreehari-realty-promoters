import { Router } from 'express';
import { login, getMe, logout, loginSchema } from '../controllers/authController.js';
import { validateRequest } from '../middleware/validate.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/login', validateRequest(loginSchema), login);
router.get('/me', authenticateAdmin, getMe);
router.post('/logout', authenticateAdmin, logout);

export default router;

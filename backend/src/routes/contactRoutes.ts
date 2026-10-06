import { Router } from 'express';
import { submitContact, getContacts, contactSchema } from '../controllers/contactController.js';
import { validateRequest } from '../middleware/validate.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

// Public contact submission
router.post('/', validateRequest(contactSchema), submitContact);

// Protected admin view
router.get('/', authenticateAdmin, getContacts);

export default router;

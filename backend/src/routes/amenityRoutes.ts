import { Router } from 'express';
import { getAmenities, createAmenity, amenitySchema } from '../controllers/amenityController.js';
import { validateRequest } from '../middleware/validate.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getAmenities);
router.post('/', authenticateAdmin, validateRequest(amenitySchema), createAmenity);

export default router;

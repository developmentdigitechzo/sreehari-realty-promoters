import { Router } from 'express';
import { handleImageUpload } from '../controllers/uploadController.js';
import { upload } from '../middleware/upload.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticateAdmin, upload.single('image'), handleImageUpload);

export default router;

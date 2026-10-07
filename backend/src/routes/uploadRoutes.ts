import { Router } from 'express';
import { handleFileUpload } from '../controllers/uploadController.js';
import { upload } from '../middleware/upload.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

// Accept either 'file' or 'image' form-data field
router.post(
  '/',
  authenticateAdmin,
  (req, res, next) => {
    upload.fields([
      { name: 'file', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ])(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files?.file?.[0]) {
        req.file = files.file[0];
      } else if (files?.image?.[0]) {
        req.file = files.image[0];
      }
      next();
    });
  },
  handleFileUpload
);

export default router;

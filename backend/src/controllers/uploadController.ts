import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';

export const handleImageUpload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return sendError(res, 'No file uploaded or file format invalid.', null, 400);
    }

    // Construct the accessible URL for the uploaded file
    const protocol = req.protocol;
    const host = req.get('host');
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    return sendSuccess(
      res,
      'Image uploaded successfully',
      {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: fileUrl,
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

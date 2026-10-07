import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';

export const handleFileUpload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return sendError(res, 'No file uploaded or file format invalid. Supported: JPG, PNG, WEBP, SVG, PDF.', null, 400);
    }

    // Construct the accessible URL for the uploaded file
    const protocol = req.protocol;
    const host = req.get('host');
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    return sendSuccess(
      res,
      'File uploaded successfully',
      {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: fileUrl,
        isPdf: req.file.mimetype === 'application/pdf',
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { ENV } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { checkPostgresConnection } from './config/db.js';
import { runMigrations } from './database/migrate.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import amenityRoutes from './routes/amenityRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app = express();

// Security and utility middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: [ENV.CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  })
);
app.use(morgan(ENV.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads
app.use('/uploads', express.static(path.resolve(process.cwd(), ENV.UPLOAD_DIR)));

// Rate Limiting for Public Enquiry endpoints
const leadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: {
    success: false,
    message: 'Too many enquiries submitted from this IP, please try again after 15 minutes or call us directly.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const isDbOnline = await checkPostgresConnection();
  res.status(200).json({
    status: 'OK',
    company: 'Sree Hari Realty Promoters',
    database: isDbOnline ? 'PostgreSQL Connected' : 'Local Memory Store (Zero-setup mode)',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/amenities', amenityRoutes);
app.use('/api/leads', leadLimiter, leadRoutes);
app.use('/api/contact', leadLimiter, contactRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Catch 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found`,
  });
});

// Global Error Handler
app.use(errorHandler);

// Bootstrap Server
const startServer = async () => {
  try {
    const isPostgresReady = await checkPostgresConnection();

    if (isPostgresReady) {
      console.log('✅ PostgreSQL database connected successfully.');
      try {
        await runMigrations();
      } catch (e) {
        console.warn('⚠️ Migrations skipped or already applied.');
      }
    } else {
      console.log('ℹ️  PostgreSQL is currently offline on port 5432.');
      console.log('🚀 Running in zero-setup Local Development mode with full in-memory seed data & CRUD support.');
    }

    app.listen(ENV.PORT, () => {
      console.log(`🌐 Sree Hari Realty Backend Server running on http://localhost:${ENV.PORT}`);
      console.log(`📡 Environment: ${ENV.NODE_ENV}`);
      console.log(`🔗 Allowed Client: ${ENV.CLIENT_URL}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

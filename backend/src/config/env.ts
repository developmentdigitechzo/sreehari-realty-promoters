import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/sree_hari_realty',
  JWT_SECRET: process.env.JWT_SECRET || 'super_secret_jwt_key_sreehari_realty_2026_dev_secure',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  WHATSAPP_NUMBER: process.env.WHATSAPP_NUMBER || '919876543210',
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
};

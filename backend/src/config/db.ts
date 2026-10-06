import { Pool, QueryResult, QueryResultRow } from 'pg';
import { ENV } from './env.js';

export const pool = new Pool({
  connectionString: ENV.DATABASE_URL,
  ssl: ENV.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

export const db = {
  query: async <T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>> => {
    const start = Date.now();
    try {
      const res = await pool.query<T>(text, params);
      const duration = Date.now() - start;
      if (ENV.NODE_ENV === 'development' && duration > 500) {
        console.warn(`Slow query executed in ${duration}ms: ${text.slice(0, 80)}...`);
      }
      return res;
    } catch (error) {
      console.error('Database query error:', { text: text.slice(0, 100), error });
      throw error;
    }
  },
  getClient: () => pool.connect(),
};

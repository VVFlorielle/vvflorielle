import pg from 'pg';
import dotenv from 'dotenv';
import { initialProducts, initialOrders, wrappingPapers, ribbons, availableAddons } from './data/mockData.js';

dotenv.config();

const { Pool } = pg;

export let pool = null;
export let isPostgresConnected = false;

// In-memory data storage (fallback for local dev and immediate out-of-the-box run)
export const inMemoryDB = {
  products: [...initialProducts],
  orders: [...initialOrders],
  wrappingPapers: [...wrappingPapers],
  ribbons: [...ribbons],
  addons: [...availableAddons]
};

if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false // Required for Neon.tech SSL
      }
    });

    pool.query('SELECT NOW()', (err, res) => {
      if (err) {
        console.warn('⚠️ [Neon DB] Connection failed, falling back to In-Memory DB:', err.message);
        isPostgresConnected = false;
      } else {
        console.log('✅ [Neon DB] Connected successfully to PostgreSQL at:', res.rows[0].now);
        isPostgresConnected = true;
      }
    });
  } catch (err) {
    console.warn('⚠️ [DB] Error initializing pg pool:', err.message);
  }
} else {
  console.log('ℹ️ [DB] DATABASE_URL not detected. Running smoothly in high-performance In-Memory Mode.');
}

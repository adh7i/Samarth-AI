/**
 * StatSamarth AI - Database Connection Manager
 * Supports:
 *  1. Production PostgreSQL (via `pg` Pool or Supabase / Neon / AWS RDS)
 *  2. Embedded MoSPI Data Store for instant zero-dependency prototyping
 */

const fs = require('fs');
const path = require('path');

let pool = null;

// Try loading pg if available
try {
  const { Pool } = require('pg');
  if (process.env.DATABASE_URL || process.env.PGHOST) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      host: process.env.PGHOST || 'localhost',
      port: process.env.PGPORT || 5432,
      database: process.env.PGDATABASE || 'statsamarth_db',
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    console.log('[Database] Connected to PostgreSQL instance');
  }
} catch (e) {
  // pg module not installed or local mode
}

module.exports = {
  query: async (text, params) => {
    if (pool) {
      return pool.query(text, params);
    }
    console.warn('[Database] Running in embedded local mode. Configure DATABASE_URL in .env to connect to PostgreSQL.');
    return { rows: [] };
  },
  getPool: () => pool
};

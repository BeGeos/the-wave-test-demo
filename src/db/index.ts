import 'dotenv/config';

import { drizzle } from 'drizzle-orm/node-postgres';

import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, {
  logger: process.env.DEBUG === 'true',
});

export default db;

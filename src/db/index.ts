import 'dotenv/config';

import { drizzle } from 'drizzle-orm/node-postgres';

import pkg from 'pg';
const { Pool } = pkg;

import * as Character from '$apps/characters/db/schema';
import * as Episode from '$apps/episodes/db/schema';
import * as Location from '$apps/locations/db/schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, {
  logger: process.env.DEBUG === 'true',
  schema: {
    ...Character,
    ...Episode,
    ...Location,
  },
});

export default db;

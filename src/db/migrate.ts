import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

import 'dotenv/config';

const main = async () => {
  const connectionString = process.env.DATABASE_URL || '';
  const db = drizzle(postgres(connectionString, { max: 1 }));

  try {
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.info('Migrations were successful');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

main();

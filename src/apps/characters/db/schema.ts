import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  index,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const GENDERS = pgEnum('genders', [
  'male',
  'female',
  'genderless',
  'unknown',
]);
export const STATUSES = pgEnum('statuses', ['alive', 'dead', 'unknown']);
export const SPECIES = pgEnum('species', [
  'human',
  'alien',
  'mythological creature',
]);

export const Character = pgTable(
  'Character',
  {
    // Required
    id: serial('id').primaryKey(),

    // Required
    name: varchar('name', { length: 64 }).notNull(),
    gender: GENDERS('gender').default('unknown').notNull(),
    status: STATUSES('status').default('alive').notNull(), // let's be good
    species: SPECIES('species').default('mythological creature').notNull(), // because why not

    // Optional
    description: text('description'),
    description_html: text('description_html'),

    // Timestamp
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      statusIdx: index('status_Idx').on(table.status),
      genderIdx: index('gender_Idx').on(table.gender),
      speciesIdx: index('species_Idx').on(table.species),
    };
  }
);

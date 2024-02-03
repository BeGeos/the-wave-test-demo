import {
  pgTable,
  serial,
  timestamp,
  varchar,
  index,
} from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';

import { Character } from '$apps/characters/db/schema';

export const Location = pgTable(
  'Location',
  {
    // Required
    id: serial('id').primaryKey(),

    // Required
    name: varchar('name', { length: 64 }).notNull(),
    type: varchar('type', { length: 128 }).notNull(),
    dimension: varchar('dimension', { length: 128 }).notNull(),

    // Timestamp
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      typeIdx: index('type_Idx').on(table.type),
      dimensionIdx: index('dimension_Idx').on(table.dimension),
    };
  }
);

export const LocationRelations = relations(Location, ({ many }) => ({
  characters: many(Character),
}));

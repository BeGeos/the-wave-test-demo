import {
  pgTable,
  serial,
  timestamp,
  varchar,
  index,
} from 'drizzle-orm/pg-core';

import { CharactersToEpisodes } from '$apps/characters/db/schema';

import { relations } from 'drizzle-orm';

export const Episode = pgTable(
  'Episode',
  {
    // Required
    id: serial('id').primaryKey(),

    // Required
    name: varchar('name', { length: 64 }).notNull(),
    airDate: varchar('air_date', { length: 32 }).notNull(),
    episode: varchar('episode', { length: 128 }).notNull(),

    // Timestamp
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      airDateIdx: index('air_date_Idx').on(table.airDate),
    };
  }
);

export const EpisodeRelations = relations(Episode, ({ many }) => ({
  // M2M
  character_through_set: many(CharactersToEpisodes),
}));

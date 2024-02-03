import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  integer,
  index,
  pgEnum,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { Episode } from '$apps/episodes/db/schema';
import { Location } from '$apps/locations/db/schema';

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
    locationId: integer('location_id').references(() => Location.id, {
      onDelete: 'set null',
    }),

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
      locationIdIdx: index('locationId_Idx').on(table.locationId),
      statusIdx: index('status_Idx').on(table.status),
      genderIdx: index('gender_Idx').on(table.gender),
      speciesIdx: index('species_Idx').on(table.species),
    };
  }
);

export const CharacterRelations = relations(Character, ({ one, many }) => ({
  location: one(Location, {
    fields: [Character.locationId],
    references: [Location.id],
  }),

  // M2M
  episode_through_set: many(CharactersToEpisodes),
}));

export const CharactersToEpisodes = pgTable(
  'CharactersToEpisodes',
  {
    characterId: integer('character_id')
      .notNull()
      .references(() => Character.id, { onDelete: 'cascade' }),
    episodeId: integer('episode_id')
      .notNull()
      .references(() => Episode.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    primaryKey: primaryKey({ columns: [table.characterId, table.episodeId] }),
  })
);

export const CharactersToEpisodesRelations = relations(
  CharactersToEpisodes,
  ({ one }) => ({
    character: one(Character, {
      fields: [CharactersToEpisodes.characterId],
      references: [Character.id],
    }),
    episode: one(Episode, {
      fields: [CharactersToEpisodes.episodeId],
      references: [Episode.id],
    }),
  })
);

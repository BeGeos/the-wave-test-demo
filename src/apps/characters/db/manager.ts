import { inArray } from 'drizzle-orm';
import type { PgSelect } from 'drizzle-orm/pg-core';

import { eq } from 'drizzle-orm';

import db from '$db';

import { Character, CharactersToEpisodes } from './schema';

import { CharacterInsertSchema, CharacterUpdateSchema } from './validators';
import { extractFilters, ALLOWED_FILTERS } from './utils';

//CRUD

export const create = async (data: Record<string, any>) => {
  const cleaned = CharacterInsertSchema.safeParse(data);

  if (cleaned.success)
    return await db.insert(Character).values(cleaned.data).returning();

  if (cleaned.error) throw new Error(JSON.stringify(cleaned.error.format()));
};

export const get = async (id: number) => {
  return await db.query.Character.findFirst({
    where: eq(Character.id, id),
  });
};

export const getMany__from_episodes = async (ids: number[]) => {
  if (ids.length === 0) return [];

  return await db.query.CharactersToEpisodes.findMany({
    where: inArray(CharactersToEpisodes.episodeId, ids),
  });
};

export const getMany__from_locations = async (ids: number[]) => {
  if (ids.length === 0) return [];

  return await db.query.Character.findMany({
    where: inArray(Character.locationId, ids),
  });
};

export const getAll = async (query?: Record<string, string>) => {
  const filters: Record<string, string[]> = {};

  if (query) {
    Object.assign(filters, { ...extractFilters(query) });
  }

  let characters = await db.select().from(Character).orderBy(Character.id);

  // TODO this filters part could be optimised with Raw SQL query
  // Where conditions cannot be chained on query unless it's `$ynamic()`
  // but the chain is apparently exclusive one eliminates the other - does a merge on the where
  // Known issue @ [https://github.com/drizzle-team/drizzle-orm-docs/issues/189]

  if (filters[ALLOWED_FILTERS.gender].length > 0) {
    characters = characters.filter((character) =>
      filters[ALLOWED_FILTERS.gender].includes(character.gender)
    );
  }

  if (filters[ALLOWED_FILTERS.status].length > 0) {
    characters = characters.filter((character) =>
      filters[ALLOWED_FILTERS.status].includes(character.status)
    );
  }

  if (filters[ALLOWED_FILTERS.species].length > 0) {
    characters = characters.filter((character) =>
      filters[ALLOWED_FILTERS.species].includes(character.species)
    );
  }

  if (query?.page) {
    const page = query.page;
    const size = query.size || 5;
    characters = characters.slice((+page - 1) * +size, +size * +page);
  }

  return characters;
};

export const update = async (id: number, data: Record<string, any>) => {
  const cleaned = CharacterUpdateSchema.safeParse(data);

  if (cleaned.success)
    return await db
      .update(Character)
      .set({ ...cleaned.data, updatedAt: new Date() })
      .where(eq(Character.id, id))
      .returning();

  if (cleaned.error) throw new Error(JSON.stringify(cleaned.error.format()));
};

export const del = async (id: number) => {
  // This function doesn't return anything
  return await db.delete(Character).where(eq(Character.id, id));
};

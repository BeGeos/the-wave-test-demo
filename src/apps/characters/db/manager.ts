import { inArray } from 'drizzle-orm';
import type { PgSelect } from 'drizzle-orm/pg-core';

import { eq } from 'drizzle-orm';

import db from '$db';

import { Character, CharactersToEpisodes } from './schema';

import { CharacterInsertSchema, CharacterUpdateSchema } from './validators';
import { extractFilters, ALLOWED_FILTERS } from './utils';

const withGenders = <T extends PgSelect>(query: T, genders: string[]) => {
  // TS doesn't like the fact that gender is an enum but genders could be whatever
  // @ts-ignore
  return query.where(inArray(Character.gender, genders));
};

const withStatuses = <T extends PgSelect>(query: T, statuses: string[]) => {
  // Read above
  // @ts-ignore
  return query.where(inArray(Character.status, statuses));
};

const withSpecies = <T extends PgSelect>(query: T, species: string[]) => {
  // Read above
  // @ts-ignore
  return query.where(inArray(Character.species, species));
};

const withPagination = <T extends PgSelect>(
  query: T,
  page: number,
  pageSize: number = 5
) => {
  return query.limit(pageSize).offset(page * pageSize - pageSize);
};

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

  let qb = db.select().from(Character).orderBy(Character.id).$dynamic();

  if (filters[ALLOWED_FILTERS.gender].length > 0) {
    qb = withGenders(qb, filters[ALLOWED_FILTERS.gender]);
  }

  if (filters[ALLOWED_FILTERS.status].length > 0) {
    qb = withStatuses(qb, filters[ALLOWED_FILTERS.status]);
  }

  if (filters[ALLOWED_FILTERS.species].length > 0) {
    qb = withSpecies(qb, filters[ALLOWED_FILTERS.species]);
  }

  if (query?.page) {
    qb = withPagination(qb, +query.page, +query.size || 5);
  }

  return qb;
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

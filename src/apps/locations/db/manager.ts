import type { PgSelect } from 'drizzle-orm/pg-core';

import { eq } from 'drizzle-orm';
import db from '$db';

import { Location } from './schema';

const withPagination = <T extends PgSelect>(
  query: T,
  page: number,
  pageSize: number = 5
) => {
  return query.limit(pageSize).offset(page * pageSize - pageSize);
};

export const get = async (id: number) => {
  return await db.query.Location.findFirst({
    where: eq(Location.id, id),
    with: {
      characters: true,
    },
  });
};

export const getAll = async (query?: Record<string, string>) => {
  let qb = db.select().from(Location).orderBy(Location.id).$dynamic();

  if (query?.page) {
    qb = withPagination(qb, +query.page, +query.size || 5);
  }

  return qb;
};

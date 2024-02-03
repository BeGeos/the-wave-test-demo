import type { PgSelect } from 'drizzle-orm/pg-core';

import { eq } from 'drizzle-orm';
import db from '$db';

import { Episode } from './schema';

const withPagination = <T extends PgSelect>(
  query: T,
  page: number,
  pageSize: number = 5
) => {
  return query.limit(pageSize).offset(page * pageSize - pageSize);
};

export const get = async (id: number) => {
  return await db.query.Episode.findFirst({
    where: eq(Episode.id, id),
    with: {
      character_through_set: {
        with: {
          character: {
            columns: {
              id: true,
            },
          },
        },
      },
    },
  });
};

export const getAll = async (query?: Record<string, string>) => {
  let qb = db.select().from(Episode).orderBy(Episode.id).$dynamic();

  if (query?.page) {
    qb = withPagination(qb, +query.page, +query.size || 5);
  }

  return qb;
};

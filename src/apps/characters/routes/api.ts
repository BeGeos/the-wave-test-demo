import type { Request, Response, NextFunction } from 'express';

import express from 'express';

import { getAll, get, create, update, del } from '../db/manager';
import {
  CharacterBasePublicResponse__many,
  CharacterBasePublicResponse,
} from '../serializers';

import { ROUTES } from '.';

const router = express.Router();

export const BASE_URL = '/characters';

router.get(ROUTES.base_v1.url, async (req: Request, res: Response) => {
  const { query } = req;
  const data = await getAll(query as unknown as Record<string, string>);
  const serializer = CharacterBasePublicResponse__many.safeParse(data);

  if (serializer.success) return res.status(200).json(serializer.data);

  return res
    .status(500)
    .json({ error: JSON.stringify(serializer.error.format()) });
});

router.get(
  ROUTES.details_v1.url,
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const intId = parseInt(id);

    if (isNaN(intId)) {
      res.status(400);
      return next(new Error('Params id must be of integer type'));
    }

    try {
      const instance = await get(intId); // turns it into number

      if (!instance) return next(); // Will be caught by notFound

      const serializer = CharacterBasePublicResponse.safeParse(instance);

      if (serializer.success) return res.status(200).json(serializer.data);

      return res
        .status(500)
        .json({ error: JSON.stringify(serializer.error.format()) });
    } catch (err: any) {
      console.error(err);
      res.status(500);
      return next(err);
    }
  }
);

router.post(
  ROUTES.base_v1.url,
  async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;

    try {
      const created = await create(body);
      return res.status(201).json(created);
    } catch (err: any) {
      res.status(400);
      return next(err);
    }
  }
);

router.put(
  ROUTES.details_v1.url,
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      body,
      params: { id },
    } = req;
    const intId = parseInt(id);

    if (isNaN(intId)) {
      res.status(400);
      return next(new Error('Params id must be of integer type'));
    }

    try {
      const updated = await update(intId, body);

      if (!updated || !updated[0]) return next();

      const response = CharacterBasePublicResponse.parse(updated[0]);
      return res.status(200).json(response);
    } catch (err: any) {
      res.status(400);
      return next(err);
    }
  }
);

router.delete(
  ROUTES.details_v1.url,
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      params: { id },
    } = req;
    const intId = parseInt(id);

    if (isNaN(intId)) {
      res.status(400);
      return next(new Error('Params id must be of integer type'));
    }

    try {
      await del(intId);
      // If any error were to happen I assume it's a 5xx and the genericError handler will catch it
      return res.status(204).end();
    } catch (err: any) {
      console.error(err);
      res.status(500);
      return next(err);
    }
  }
);

export { router };

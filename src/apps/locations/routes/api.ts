import type { Request, Response, NextFunction } from 'express';

import { reverse } from '$routes';

import express from 'express';

import { ROUTES } from '.';

import { getMany__from_locations } from '$apps/characters/db/manager';
import { get, getAll } from '../db/manager';

import {
  LocationPublicResponse,
  LocationPublicResponse__many,
} from '../serializers';

const router = express.Router();

router
  .route(ROUTES.details_v1.url)
  .get(async (req: Request, res: Response, next: NextFunction) => {
    const {
      params: { id },
    } = req;

    const intId = parseInt(id);

    if (isNaN(intId)) {
      res.status(400);
      return next(new Error('Params id must be of integer type'));
    }

    try {
      const data = await get(intId);

      if (!data) return next(); // aka 404

      const characterUrls = data?.characters.map((character) =>
        reverse('characters:details_v1', { id: character.id }, true)
      );

      const serializer = LocationPublicResponse.safeParse({
        ...data,
        characters: characterUrls,
      });

      if (serializer.success) {
        const self = reverse(
          'locations:details_v1',
          { id: serializer.data.id },
          true
        );
        return res.status(200).json({ ...serializer.data, url: self });
      }

      return res
        .status(500)
        .json({ error: JSON.stringify(serializer.error.format()) });
    } catch (err: any) {
      res.status(500);
      console.error(err);
      return next(err);
    }
  });

router
  .route(ROUTES.base_v1.url)
  .get(async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req;
    try {
      const locations = await getAll(query as Record<string, string>);
      const characters = await getMany__from_locations(
        locations.map((location) => location.id)
      );

      const aggregated = locations.map((location) => {
        const characterUrls = characters
          .filter((character) => character.locationId === location.id)
          .map((c) => reverse('characters:details_v1', { id: c.id }, true));

        const self = reverse('locations:details_v1', { id: location.id }, true);
        Object.assign(location, { characters: characterUrls, url: self });

        return location;
      });

      const serializer = LocationPublicResponse__many.safeParse(aggregated);

      if (serializer.success) return res.status(200).json(serializer.data);

      return res
        .status(500)
        .json({ error: JSON.stringify(serializer.error.format()) });
    } catch (err: any) {
      res.status(500);
      console.error(err);
      return next(err);
    }
  });

export { router };

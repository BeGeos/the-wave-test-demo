import type { Request, Response, NextFunction } from 'express';

import { reverse } from '$routes';

import express from 'express';

import { ROUTES } from '.';

import { get, getAll } from '../db/manager';
import { getMany__from_episodes } from '$apps/characters/db/manager';
import {
  EpisodePublicResponse__many,
  EpisodePublicResponse,
} from '../serializers';

const router = express.Router();

export const BASE_URL = '/episodes';

router.get(
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
      const data = await get(intId);

      if (!data) return next(); // aka 404

      // This step could be avoided if the shape of the response didn't matter
      // Basically I want to replace `charater_through_set` to `characters` as a string[]
      const characterUrls = data?.character_through_set.map(({ character }) =>
        reverse('characters:details_v1', { id: character.id }, true)
      );

      const serializer = EpisodePublicResponse.safeParse({
        ...data,
        characters: characterUrls,
      });

      if (serializer.success) {
        const self = reverse(
          'episodes:details_v1',
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
  }
);

router.get(
  ROUTES.base_v1.url,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query } = req;
      // I have to make 2 queries because Drizzle dynamic query acts weird when paginating
      // This is similar to a `prefetch_related()`
      const episodes = await getAll(query as Record<string, string>);
      const characters = await getMany__from_episodes(
        episodes.map((episode) => episode.id)
      );

      const aggregated = episodes.map((episode) => {
        const characterUrls = characters
          .filter((character) => character.episodeId === episode.id)
          .map((c) =>
            reverse('characters:details_v1', { id: c.characterId }, true)
          );

        const self = reverse('episodes:details_v1', { id: episode.id }, true);
        Object.assign(episode, { characters: characterUrls, url: self });
        return episode;
      });

      const serializer = EpisodePublicResponse__many.safeParse(aggregated);

      if (serializer.success) return res.status(200).json(serializer.data);

      return res
        .status(500)
        .json({ error: JSON.stringify(serializer.error.format()) });
    } catch (err: any) {
      res.status(500);
      console.error(err);
      return next(err);
    }
  }
);

export { router };

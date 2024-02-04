import type { NextFunction, Request, Response } from 'express';

import 'dotenv/config';

import express from 'express';

import { ROUTES as CharacterRoutes } from '$apps/characters/routes';
import { ROUTES as DocsRoutes } from './swagger';
import { ROUTES as EpisodesRoutes } from '$apps/episodes/routes';
import { ROUTES as LocationRoutes } from '$apps/locations/routes';

import {
  router as CharacterRouter,
  BASE_URL as CharacterBaseUrl,
} from '$apps/characters/routes/api';
import {
  router as EpisodeRouter,
  BASE_URL as EpisodeBaseUrl,
} from '$apps/episodes/routes/api';
import {
  router as LocationRouter,
  BASE_URL as LocationBaseUrl,
} from '$apps/locations/routes/api';
import { ui as SwaggerUi, setup as SwaggerSetup } from './swagger';

const apiRouterV1 = express.Router();
apiRouterV1.use((req, res, next) => {
  // Forwards the request to `/api/v1/...`
  next();
});
apiRouterV1.use(CharacterBaseUrl, CharacterRouter);
apiRouterV1.use(EpisodeBaseUrl, EpisodeRouter);
apiRouterV1.use(LocationBaseUrl, LocationRouter);

export const BASE_URL = '/';
const baseRouter = express.Router();
baseRouter.use((req: Request, res: Response, next: NextFunction) => {
  // Handles base requests
  return next();
});

baseRouter.get('/pulse', (req: Request, res: Response) => {
  // Healthcheck - pulse
  res.send('💗').status(200);
});

const docsRouter = express.Router();
docsRouter.use(DocsRoutes.base.url, SwaggerUi.serve, SwaggerSetup);

export { apiRouterV1, baseRouter, docsRouter };

// Register new routes here
const ROUTES: Record<string, any> = {
  characters: CharacterRoutes,
  docs: DocsRoutes,
  episodes: EpisodesRoutes,
  locations: LocationRoutes,
};

export const reverse = (
  name: string,
  kwargs?: Record<string, string | number> | null,
  external: boolean = false
) => {
  // This method provides the URL of a resource given the name
  // External provides the entire reference of the URL with root
  const root = process.env.ROOT_URL;

  const [app, route] = name.split(':');

  if (!ROUTES[app] || !ROUTES[app][route])
    throw new Error('No path found for ' + name);

  const origin = ROUTES[app][route]['origin'];
  let target: string = ROUTES[app][route]['url'];

  if (kwargs) {
    Object.entries(kwargs).forEach(
      ([key, value]) => (target = target.replace(`:${key}`, '' + value))
    );
  }

  if (external) return [root, origin, target].join('');

  return [origin, target].join('');
};

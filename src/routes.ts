import type { NextFunction, Request, Response } from 'express';

import 'dotenv/config';

import express from 'express';

import {
  router as CharacterRouter,
  BASE_URL as CharacterBaseUrl,
} from '$apps/characters/routes/api';

const apiRouterV1 = express.Router();
apiRouterV1.use((req, res, next) => {
  // Forwards the request to `/api/v1/...`
  next();
});
apiRouterV1.use(CharacterBaseUrl, CharacterRouter);

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

export { apiRouterV1, baseRouter };

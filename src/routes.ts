import type { NextFunction, Request, Response } from 'express';

import 'dotenv/config';

import express from 'express';

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

export { baseRouter };

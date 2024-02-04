import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import { API_V1_BASE_URL, BASE_URL } from './constants';
import { baseRouter, apiRouterV1, docsRouter } from '$routes';

import { notFound, genericError } from './errors';

// Swagger
import { BASE_URL as DocsBaseUrl } from './swagger';

const app = express();
const port = process.env.PORT;

app.listen(port, async () => {
  try {
    app.use(cors());
    app.use(express.json());

    // Routes
    app.use(API_V1_BASE_URL, apiRouterV1);
    app.use(DocsBaseUrl, docsRouter);
    app.use(BASE_URL, baseRouter);

    app.use(notFound);
    app.use(genericError);

    console.log(`✅ Server is listening at http://localhost:${port}`);
  } catch (err: any) {
    console.error(err);
    process.exit(1);
  }
});

export { app };

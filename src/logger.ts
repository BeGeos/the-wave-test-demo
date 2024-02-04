import 'dotenv/config';

import logger from 'pino-http';

const DEBUG = process.env.DEBUG === 'true';

const devLogger = logger({
  level: 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

const prodLogger = logger({
  level: 'info',
});

export const getLogger = () => {
  if (DEBUG) return devLogger;

  return prodLogger;
};

import fs from 'fs';
import path from 'path';

import ui from 'swagger-ui-express';
import YAML from 'yaml';

const filePath = path.resolve(__dirname, '../swagger.yaml');
const document = fs.readFileSync(filePath, 'utf-8');

const specs = YAML.parse(document);
const setup = ui.setup(specs);

export { ui, setup };

// Routes

export const BASE_URL = '/docs';
export const ROUTES = {
  base: {
    url: '/',
    origin: BASE_URL,
  },
} as const;

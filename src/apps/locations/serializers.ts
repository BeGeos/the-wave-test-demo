import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { Location } from './db/schema';

export const LocationBasePublicResponse = createSelectSchema(Location);

export const LocationBasePublicResponse__many =
  LocationBasePublicResponse.array();

export const LocationPublicResponse = LocationBasePublicResponse.extend({
  characters: z.array(z.string()).optional(),
  url: z.string().optional(),
});

export const LocationPublicResponse__many = LocationPublicResponse.array();

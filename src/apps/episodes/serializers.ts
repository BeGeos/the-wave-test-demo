import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { Episode } from './db/schema';

export const EpisodeBasePublicResponse = createSelectSchema(Episode);

export const EpisodeBasePublicResponse__many =
  EpisodeBasePublicResponse.array();

export const EpisodePublicResponse = EpisodeBasePublicResponse.extend({
  characters: z.array(z.string()).optional(),
  url: z.string().optional(),
});

export const EpisodePublicResponse__many = EpisodePublicResponse.array();

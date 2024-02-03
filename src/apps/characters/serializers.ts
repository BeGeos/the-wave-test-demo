import { createSelectSchema } from 'drizzle-zod';

import { Character } from './db/schema';

export const CharacterBasePublicResponse = createSelectSchema(Character).omit({
  locationId: true,
});

export const CharacterBasePublicResponse__many =
  CharacterBasePublicResponse.array();

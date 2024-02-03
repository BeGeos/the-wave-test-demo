import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { Character, GENDERS, STATUSES, SPECIES } from './schema';

export const CharacterInsertSchema = createInsertSchema(Character).omit({
  id: true,
  updatedAt: true,
  locationId: true,
  createdAt: true,
});

export const CharacterUpdateSchema = createInsertSchema(Character, {
  name: z.string().optional(),
  gender: z.enum(GENDERS.enumValues).optional(),
  status: z.enum(STATUSES.enumValues).optional(),
  species: z.enum(SPECIES.enumValues).optional(),
}).omit({ id: true, createdAt: true, updatedAt: true, locationId: true });

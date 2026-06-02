import { z } from 'zod';

/**
 * Zod schema for ITM1RSSAPClient validation
 */
export const ITM1RSSAPClientSchema = z.object({
  id: z.number().int(),
  title: z.string(),
});

/**
 * Schema for creating a new ITM1RSSAPClient (omits system-generated ID)
 */
export const CreateITM1RSSAPClientSchema = ITM1RSSAPClientSchema.omit({ id: true });

/**
 * Schema for updating an existing ITM1RSSAPClient
 */
export const UpdateITM1RSSAPClientSchema = ITM1RSSAPClientSchema;

export type ITM1RSSAPClientInput = z.infer<typeof ITM1RSSAPClientSchema>;
export type CreateITM1RSSAPClientInput = z.infer<typeof CreateITM1RSSAPClientSchema>;
export type UpdateITM1RSSAPClientInput = z.infer<typeof UpdateITM1RSSAPClientSchema>;
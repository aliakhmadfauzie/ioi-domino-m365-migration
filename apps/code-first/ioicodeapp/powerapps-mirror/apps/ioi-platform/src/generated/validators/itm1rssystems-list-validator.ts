import { z } from 'zod';

/**
 * Zod schema for ITM1RSSystemsList validation
 */
export const ITM1RSSystemsListSchema = z.object({
  id: z.number().int(),
  title: z.string(),
});

/**
 * Schema for creating a new ITM1RSSystemsList (omits system-generated ID)
 */
export const CreateITM1RSSystemsListSchema = ITM1RSSystemsListSchema.omit({ id: true });

/**
 * Schema for updating an existing ITM1RSSystemsList
 */
export const UpdateITM1RSSystemsListSchema = ITM1RSSystemsListSchema;

export type ITM1RSSystemsListInput = z.infer<typeof ITM1RSSystemsListSchema>;
export type CreateITM1RSSystemsListInput = z.infer<typeof CreateITM1RSSystemsListSchema>;
export type UpdateITM1RSSystemsListInput = z.infer<typeof UpdateITM1RSSystemsListSchema>;
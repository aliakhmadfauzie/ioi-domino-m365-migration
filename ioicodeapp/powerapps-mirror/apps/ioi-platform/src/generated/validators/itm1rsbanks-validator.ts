import { z } from 'zod';

/**
 * Zod schema for ITM1RSBanks validation
 */
export const ITM1RSBanksSchema = z.object({
  id: z.number().int(),
  title: z.string(),
});

/**
 * Schema for creating a new ITM1RSBanks (omits system-generated ID)
 */
export const CreateITM1RSBanksSchema = ITM1RSBanksSchema.omit({ id: true });

/**
 * Schema for updating an existing ITM1RSBanks
 */
export const UpdateITM1RSBanksSchema = ITM1RSBanksSchema;

export type ITM1RSBanksInput = z.infer<typeof ITM1RSBanksSchema>;
export type CreateITM1RSBanksInput = z.infer<typeof CreateITM1RSBanksSchema>;
export type UpdateITM1RSBanksInput = z.infer<typeof UpdateITM1RSBanksSchema>;
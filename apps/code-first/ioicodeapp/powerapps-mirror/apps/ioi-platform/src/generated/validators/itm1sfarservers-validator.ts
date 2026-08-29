import { z } from 'zod';

/**
 * Zod schema for ITM1SFARServers validation
 */
export const ITM1SFARServersSchema = z.object({
  id: z.number().int(),
  title: z.string(),
});

/**
 * Schema for creating a new ITM1SFARServers (omits system-generated ID)
 */
export const CreateITM1SFARServersSchema = ITM1SFARServersSchema.omit({ id: true });

/**
 * Schema for updating an existing ITM1SFARServers
 */
export const UpdateITM1SFARServersSchema = ITM1SFARServersSchema;

export type ITM1SFARServersInput = z.infer<typeof ITM1SFARServersSchema>;
export type CreateITM1SFARServersInput = z.infer<typeof CreateITM1SFARServersSchema>;
export type UpdateITM1SFARServersInput = z.infer<typeof UpdateITM1SFARServersSchema>;
import { z } from 'zod';

/**
 * Zod schema for ConfigNotesAdminRouting validation
 */
export const ConfigNotesAdminRoutingSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  category: z.string().optional(),
  configKey: z.string().min(1, { message: "Config Key is required" }),
  configValue: z.string().optional(),
  description: z.string().optional(),
});

/**
 * Schema for creating a new ConfigNotesAdminRouting (omits system-generated ID)
 */
export const CreateConfigNotesAdminRoutingSchema = ConfigNotesAdminRoutingSchema.omit({ id: true });

/**
 * Schema for updating an existing ConfigNotesAdminRouting
 */
export const UpdateConfigNotesAdminRoutingSchema = ConfigNotesAdminRoutingSchema;

export type ConfigNotesAdminRoutingInput = z.infer<typeof ConfigNotesAdminRoutingSchema>;
export type CreateConfigNotesAdminRoutingInput = z.infer<typeof CreateConfigNotesAdminRoutingSchema>;
export type UpdateConfigNotesAdminRoutingInput = z.infer<typeof UpdateConfigNotesAdminRoutingSchema>;
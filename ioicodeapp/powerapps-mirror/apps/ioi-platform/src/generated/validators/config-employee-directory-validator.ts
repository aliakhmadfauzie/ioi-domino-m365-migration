import { z } from 'zod';

/**
 * Zod schema for ConfigEmployeeDirectory validation
 */
export const ConfigEmployeeDirectorySchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  category: z.string().optional(),
  configKey: z.string().min(1, { message: "Config Key is required" }),
  configValue: z.string().optional(),
  description: z.string().optional(),
});

/**
 * Schema for creating a new ConfigEmployeeDirectory (omits system-generated ID)
 */
export const CreateConfigEmployeeDirectorySchema = ConfigEmployeeDirectorySchema.omit({ id: true });

/**
 * Schema for updating an existing ConfigEmployeeDirectory
 */
export const UpdateConfigEmployeeDirectorySchema = ConfigEmployeeDirectorySchema;

export type ConfigEmployeeDirectoryInput = z.infer<typeof ConfigEmployeeDirectorySchema>;
export type CreateConfigEmployeeDirectoryInput = z.infer<typeof CreateConfigEmployeeDirectorySchema>;
export type UpdateConfigEmployeeDirectoryInput = z.infer<typeof UpdateConfigEmployeeDirectorySchema>;
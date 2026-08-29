import { z } from 'zod';

/**
 * Zod schema for ConfigDepartments validation
 */
export const ConfigDepartmentsSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  category: z.string().optional(),
  configKey: z.string().min(1, { message: "Config Key is required" }),
  configValue: z.string().optional(),
  description: z.string().optional(),
});

/**
 * Schema for creating a new ConfigDepartments (omits system-generated ID)
 */
export const CreateConfigDepartmentsSchema = ConfigDepartmentsSchema.omit({ id: true });

/**
 * Schema for updating an existing ConfigDepartments
 */
export const UpdateConfigDepartmentsSchema = ConfigDepartmentsSchema;

export type ConfigDepartmentsInput = z.infer<typeof ConfigDepartmentsSchema>;
export type CreateConfigDepartmentsInput = z.infer<typeof CreateConfigDepartmentsSchema>;
export type UpdateConfigDepartmentsInput = z.infer<typeof UpdateConfigDepartmentsSchema>;
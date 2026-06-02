import { z } from 'zod';

/**
 * Zod schema for ConfigCompanies validation
 */
export const ConfigCompaniesSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  category: z.string().optional(),
  configKey: z.string().optional(),
  configValue: z.string().optional(),
  description: z.string().optional(),
});

/**
 * Schema for creating a new ConfigCompanies (omits system-generated ID)
 */
export const CreateConfigCompaniesSchema = ConfigCompaniesSchema.omit({ id: true });

/**
 * Schema for updating an existing ConfigCompanies
 */
export const UpdateConfigCompaniesSchema = ConfigCompaniesSchema;

export type ConfigCompaniesInput = z.infer<typeof ConfigCompaniesSchema>;
export type CreateConfigCompaniesInput = z.infer<typeof CreateConfigCompaniesSchema>;
export type UpdateConfigCompaniesInput = z.infer<typeof UpdateConfigCompaniesSchema>;
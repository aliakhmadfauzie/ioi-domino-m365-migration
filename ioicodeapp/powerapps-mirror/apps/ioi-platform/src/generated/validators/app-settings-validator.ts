import { z } from 'zod';

/**
 * Zod schema for AppSettings validation
 */
export const AppSettingsSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  categoryKey: z.enum(['CategoryKey0', 'CategoryKey1', 'CategoryKey2', 'CategoryKey3', 'CategoryKey4']).optional(),
  dataTypeKey: z.enum(['DataTypeKey0', 'DataTypeKey1', 'DataTypeKey2', 'DataTypeKey3', 'DataTypeKey4']).optional(),
  description: z.string().optional(),
  isEditable: z.boolean().optional(),
  settingKey: z.string().min(1, { message: "Setting Key is required" }),
  settingValue: z.string().optional(),
});

/**
 * Schema for creating a new AppSettings (omits system-generated ID)
 */
export const CreateAppSettingsSchema = AppSettingsSchema.omit({ id: true });

/**
 * Schema for updating an existing AppSettings
 */
export const UpdateAppSettingsSchema = AppSettingsSchema;

export type AppSettingsInput = z.infer<typeof AppSettingsSchema>;
export type CreateAppSettingsInput = z.infer<typeof CreateAppSettingsSchema>;
export type UpdateAppSettingsInput = z.infer<typeof UpdateAppSettingsSchema>;
import { z } from 'zod';

/**
 * Zod schema for ConfigApproverMatrix validation
 */
export const ConfigApproverMatrixSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  category: z.string().optional(),
  configKey: z.string().min(1, { message: "Config Key is required" }),
  configValue: z.string().optional(),
  description: z.string().optional(),
});

/**
 * Schema for creating a new ConfigApproverMatrix (omits system-generated ID)
 */
export const CreateConfigApproverMatrixSchema = ConfigApproverMatrixSchema.omit({ id: true });

/**
 * Schema for updating an existing ConfigApproverMatrix
 */
export const UpdateConfigApproverMatrixSchema = ConfigApproverMatrixSchema;

export type ConfigApproverMatrixInput = z.infer<typeof ConfigApproverMatrixSchema>;
export type CreateConfigApproverMatrixInput = z.infer<typeof CreateConfigApproverMatrixSchema>;
export type UpdateConfigApproverMatrixInput = z.infer<typeof UpdateConfigApproverMatrixSchema>;
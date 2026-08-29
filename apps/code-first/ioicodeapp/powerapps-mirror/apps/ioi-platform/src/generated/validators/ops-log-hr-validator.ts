import { z } from 'zod';

/**
 * Zod schema for OpsLogHR validation
 */
export const OpsLogHRSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  appName: z.string().optional(),
  flowError: z.string().optional(),
  payloadSummary: z.string().optional(),
  runID: z.string().optional(),
  siteKey: z.enum(['SiteKey0', 'SiteKey1']).optional(),
  timestamp: z.string().optional(),
  userUPN: z.string().optional(),
});

/**
 * Schema for creating a new OpsLogHR (omits system-generated ID)
 */
export const CreateOpsLogHRSchema = OpsLogHRSchema.omit({ id: true });

/**
 * Schema for updating an existing OpsLogHR
 */
export const UpdateOpsLogHRSchema = OpsLogHRSchema;

export type OpsLogHRInput = z.infer<typeof OpsLogHRSchema>;
export type CreateOpsLogHRInput = z.infer<typeof CreateOpsLogHRSchema>;
export type UpdateOpsLogHRInput = z.infer<typeof UpdateOpsLogHRSchema>;
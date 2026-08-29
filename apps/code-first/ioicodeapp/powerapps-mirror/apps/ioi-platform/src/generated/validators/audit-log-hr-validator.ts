import { z } from 'zod';

/**
 * Zod schema for AuditLogHR validation
 */
export const AuditLogHRSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  appName: z.string().optional(),
  changedBy: z.string().optional(),
  changedOnUTC: z.string().optional(),
  correlationId: z.string().optional(),
  fieldName: z.string().optional(),
  itemID: z.string().optional(),
  listName: z.string().optional(),
  newValue: z.string().optional(),
  oldValue: z.string().optional(),
  siteKey: z.enum(['SiteKey0', 'SiteKey1']).optional(),
});

/**
 * Schema for creating a new AuditLogHR (omits system-generated ID)
 */
export const CreateAuditLogHRSchema = AuditLogHRSchema.omit({ id: true });

/**
 * Schema for updating an existing AuditLogHR
 */
export const UpdateAuditLogHRSchema = AuditLogHRSchema;

export type AuditLogHRInput = z.infer<typeof AuditLogHRSchema>;
export type CreateAuditLogHRInput = z.infer<typeof CreateAuditLogHRSchema>;
export type UpdateAuditLogHRInput = z.infer<typeof UpdateAuditLogHRSchema>;
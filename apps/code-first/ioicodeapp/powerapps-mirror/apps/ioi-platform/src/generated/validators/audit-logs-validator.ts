import { z } from 'zod';

/**
 * Zod schema for AuditLogs validation
 */
export const AuditLogsSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  actionKey: z.enum(['ActionKey00', 'ActionKey01', 'ActionKey02', 'ActionKey03', 'ActionKey04', 'ActionKey05', 'ActionKey06', 'ActionKey07', 'ActionKey08', 'ActionKey09']),
  departmentKey: z.enum(['DepartmentKey00', 'DepartmentKey01', 'DepartmentKey02', 'DepartmentKey03', 'DepartmentKey04', 'DepartmentKey05', 'DepartmentKey06', 'DepartmentKey07', 'DepartmentKey08', 'DepartmentKey09']).optional(),
  details: z.string().optional(),
  iPAddress: z.string().optional(),
  resourceID: z.string().optional(),
  resourceType: z.string().optional(),
  timestamp: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  userID: z.string().optional(),
});

/**
 * Schema for creating a new AuditLogs (omits system-generated ID)
 */
export const CreateAuditLogsSchema = AuditLogsSchema.omit({ id: true });

/**
 * Schema for updating an existing AuditLogs
 */
export const UpdateAuditLogsSchema = AuditLogsSchema;

export type AuditLogsInput = z.infer<typeof AuditLogsSchema>;
export type CreateAuditLogsInput = z.infer<typeof CreateAuditLogsSchema>;
export type UpdateAuditLogsInput = z.infer<typeof UpdateAuditLogsSchema>;
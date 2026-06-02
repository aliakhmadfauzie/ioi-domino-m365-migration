import { z } from 'zod';

/**
 * Zod schema for WorkflowAuditLog validation
 */
export const WorkflowAuditLogSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  actionTaken: z.string().optional(),
  actorEmail: z.string().optional(),
  actorName: z.string().optional(),
  comment: z.string().optional(),
  formCode: z.string().min(1, { message: "Form Code is required" }),
  newStatus: z.string().optional(),
  oldStatus: z.string().optional(),
  requestItemID: z.number().int().optional(),
  siteTag: z.string().optional(),
  timestamp: z.string().optional(),
});

/**
 * Schema for creating a new WorkflowAuditLog (omits system-generated ID)
 */
export const CreateWorkflowAuditLogSchema = WorkflowAuditLogSchema.omit({ id: true });

/**
 * Schema for updating an existing WorkflowAuditLog
 */
export const UpdateWorkflowAuditLogSchema = WorkflowAuditLogSchema;

export type WorkflowAuditLogInput = z.infer<typeof WorkflowAuditLogSchema>;
export type CreateWorkflowAuditLogInput = z.infer<typeof CreateWorkflowAuditLogSchema>;
export type UpdateWorkflowAuditLogInput = z.infer<typeof UpdateWorkflowAuditLogSchema>;
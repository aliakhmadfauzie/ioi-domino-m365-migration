import { z } from 'zod';

/**
 * Zod schema for AssignmentsSTR validation
 */
export const AssignmentsSTRSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  appName: z.string().optional(),
  assignedOn: z.string().optional(),
  assignedRole: z.string().optional(),
  assignedToEmail: z.string().optional(),
  assignmentID: z.string().optional(),
  completedOn: z.string().optional(),
  completionStatus: z.string().optional(),
  dueDate: z.string().optional(),
  escalationLevel: z.string().optional(),
  nextReminderDate: z.string().optional(),
  recordID: z.string().optional(),
  remarks: z.string().optional(),
  reminderDate: z.string().optional(),
  siteKey: z.enum(['SiteKey0', 'SiteKey1']).optional(),
  taskType: z.string().optional(),
});

/**
 * Schema for creating a new AssignmentsSTR (omits system-generated ID)
 */
export const CreateAssignmentsSTRSchema = AssignmentsSTRSchema.omit({ id: true });

/**
 * Schema for updating an existing AssignmentsSTR
 */
export const UpdateAssignmentsSTRSchema = AssignmentsSTRSchema;

export type AssignmentsSTRInput = z.infer<typeof AssignmentsSTRSchema>;
export type CreateAssignmentsSTRInput = z.infer<typeof CreateAssignmentsSTRSchema>;
export type UpdateAssignmentsSTRInput = z.infer<typeof UpdateAssignmentsSTRSchema>;
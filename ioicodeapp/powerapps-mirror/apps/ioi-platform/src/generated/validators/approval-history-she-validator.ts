import { z } from 'zod';

/**
 * Zod schema for ApprovalHistorySHE validation
 */
export const ApprovalHistorySHESchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  actionByEmail: z.string().optional(),
  actionCode: z.string().optional(),
  actionComment: z.string().optional(),
  actionOn: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  appName: z.string().optional(),
  fromState: z.string().optional(),
  historyID: z.string().optional(),
  parentID: z.number().int().optional(),
  recordID: z.string().optional(),
  toState: z.string().optional(),
});

/**
 * Schema for creating a new ApprovalHistorySHE (omits system-generated ID)
 */
export const CreateApprovalHistorySHESchema = ApprovalHistorySHESchema.omit({ id: true });

/**
 * Schema for updating an existing ApprovalHistorySHE
 */
export const UpdateApprovalHistorySHESchema = ApprovalHistorySHESchema;

export type ApprovalHistorySHEInput = z.infer<typeof ApprovalHistorySHESchema>;
export type CreateApprovalHistorySHEInput = z.infer<typeof CreateApprovalHistorySHESchema>;
export type UpdateApprovalHistorySHEInput = z.infer<typeof UpdateApprovalHistorySHESchema>;
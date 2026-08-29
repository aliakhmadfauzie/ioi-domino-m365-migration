import { z } from 'zod';

/**
 * Zod schema for ApprovalHistorySTR validation
 */
export const ApprovalHistorySTRSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  actionByEmail: z.string().optional(),
  actionByName: z.string().optional(),
  actionCode: z.string().optional(),
  actionComment: z.string().optional(),
  actionOn: z.string().optional(),
  appName: z.string().optional(),
  fromState: z.string().optional(),
  historyID: z.string().optional(),
  parentID: z.number().int().optional(),
  recordID: z.string().optional(),
  siteKey: z.enum(['SiteKey0', 'SiteKey1']).optional(),
  toState: z.string().optional(),
});

/**
 * Schema for creating a new ApprovalHistorySTR (omits system-generated ID)
 */
export const CreateApprovalHistorySTRSchema = ApprovalHistorySTRSchema.omit({ id: true });

/**
 * Schema for updating an existing ApprovalHistorySTR
 */
export const UpdateApprovalHistorySTRSchema = ApprovalHistorySTRSchema;

export type ApprovalHistorySTRInput = z.infer<typeof ApprovalHistorySTRSchema>;
export type CreateApprovalHistorySTRInput = z.infer<typeof CreateApprovalHistorySTRSchema>;
export type UpdateApprovalHistorySTRInput = z.infer<typeof UpdateApprovalHistorySTRSchema>;
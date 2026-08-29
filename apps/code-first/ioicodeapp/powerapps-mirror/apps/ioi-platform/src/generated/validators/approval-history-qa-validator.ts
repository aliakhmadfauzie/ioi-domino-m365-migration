import { z } from 'zod';

/**
 * Zod schema for ApprovalHistoryQA validation
 */
export const ApprovalHistoryQASchema = z.object({
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
 * Schema for creating a new ApprovalHistoryQA (omits system-generated ID)
 */
export const CreateApprovalHistoryQASchema = ApprovalHistoryQASchema.omit({ id: true });

/**
 * Schema for updating an existing ApprovalHistoryQA
 */
export const UpdateApprovalHistoryQASchema = ApprovalHistoryQASchema;

export type ApprovalHistoryQAInput = z.infer<typeof ApprovalHistoryQASchema>;
export type CreateApprovalHistoryQAInput = z.infer<typeof CreateApprovalHistoryQASchema>;
export type UpdateApprovalHistoryQAInput = z.infer<typeof UpdateApprovalHistoryQASchema>;
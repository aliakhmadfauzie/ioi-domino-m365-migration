import { z } from 'zod';

/**
 * Zod schema for ApprovalHistoryHR validation
 */
export const ApprovalHistoryHRSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  actionbyemail: z.string().optional(),
  actionbyname: z.string().optional(),
  actioncode: z.string().optional(),
  actioncomment: z.string().optional(),
  actionon: z.string().optional(),
  appname: z.string().optional(),
  fromstate: z.string().optional(),
  historyid: z.string().optional(),
  parentid: z.number().int().optional(),
  recordid: z.string().optional(),
  siteKey: z.enum(['SiteKey0', 'SiteKey1']).optional(),
  tostate: z.string().optional(),
});

/**
 * Schema for creating a new ApprovalHistoryHR (omits system-generated ID)
 */
export const CreateApprovalHistoryHRSchema = ApprovalHistoryHRSchema.omit({ id: true });

/**
 * Schema for updating an existing ApprovalHistoryHR
 */
export const UpdateApprovalHistoryHRSchema = ApprovalHistoryHRSchema;

export type ApprovalHistoryHRInput = z.infer<typeof ApprovalHistoryHRSchema>;
export type CreateApprovalHistoryHRInput = z.infer<typeof CreateApprovalHistoryHRSchema>;
export type UpdateApprovalHistoryHRInput = z.infer<typeof UpdateApprovalHistoryHRSchema>;
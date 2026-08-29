import { z } from 'zod';

/**
 * Zod schema for ApprovalRecords validation
 */
export const ApprovalRecordsSchema = z.object({
  id: z.number().int(),
  stagename: z.string().min(1, { message: "StageName is required" }),
  actionbyid: z.string().optional(),
  actionbyname: z.string().optional(),
  actiondate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  actionKey: z.enum(['ActionKey0', 'ActionKey1', 'ActionKey2', 'ActionKey3', 'ActionKey4']).optional(),
  comments: z.string().optional(),
  formcode: z.string().min(1, { message: "FormCode is required" }),
  formid: z.string().min(1, { message: "FormID is required" }),
  nextstage: z.string().optional(),
  stagenumber: z.number().int().optional(),
});

/**
 * Schema for creating a new ApprovalRecords (omits system-generated ID)
 */
export const CreateApprovalRecordsSchema = ApprovalRecordsSchema.omit({ id: true });

/**
 * Schema for updating an existing ApprovalRecords
 */
export const UpdateApprovalRecordsSchema = ApprovalRecordsSchema;

export type ApprovalRecordsInput = z.infer<typeof ApprovalRecordsSchema>;
export type CreateApprovalRecordsInput = z.infer<typeof CreateApprovalRecordsSchema>;
export type UpdateApprovalRecordsInput = z.infer<typeof UpdateApprovalRecordsSchema>;
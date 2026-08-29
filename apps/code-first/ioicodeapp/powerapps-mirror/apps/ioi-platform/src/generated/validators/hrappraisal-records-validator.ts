import { z } from 'zod';

/**
 * Zod schema for HRAppraisalRecords validation
 */
export const HRAppraisalRecordsSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  appraisalNo: z.string().optional(),
  cycleYear: z.string().optional(),
  employeeNo: z.string().optional(),
  rating: z.string().optional(),
  reviewerEmail: z.string().optional(),
  statusKey: z.enum(['StatusKey0', 'StatusKey1', 'StatusKey2', 'StatusKey3', 'StatusKey4', 'StatusKey5', 'StatusKey6']).optional(),
});

/**
 * Schema for creating a new HRAppraisalRecords (omits system-generated ID)
 */
export const CreateHRAppraisalRecordsSchema = HRAppraisalRecordsSchema.omit({ id: true });

/**
 * Schema for updating an existing HRAppraisalRecords
 */
export const UpdateHRAppraisalRecordsSchema = HRAppraisalRecordsSchema;

export type HRAppraisalRecordsInput = z.infer<typeof HRAppraisalRecordsSchema>;
export type CreateHRAppraisalRecordsInput = z.infer<typeof CreateHRAppraisalRecordsSchema>;
export type UpdateHRAppraisalRecordsInput = z.infer<typeof UpdateHRAppraisalRecordsSchema>;
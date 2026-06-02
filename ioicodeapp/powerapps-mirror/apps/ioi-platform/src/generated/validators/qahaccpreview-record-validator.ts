import { z } from 'zod';

/**
 * Zod schema for QAHACCPReviewRecord validation
 */
export const QAHACCPReviewRecordSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  designation: z.string().optional(),
  parentHACCPID: z.string().optional(),
  reviewDate: z.string().optional(),
  reviewerName: z.string().optional(),
  reviewNo: z.string().optional(),
});

/**
 * Schema for creating a new QAHACCPReviewRecord (omits system-generated ID)
 */
export const CreateQAHACCPReviewRecordSchema = QAHACCPReviewRecordSchema.omit({ id: true });

/**
 * Schema for updating an existing QAHACCPReviewRecord
 */
export const UpdateQAHACCPReviewRecordSchema = QAHACCPReviewRecordSchema;

export type QAHACCPReviewRecordInput = z.infer<typeof QAHACCPReviewRecordSchema>;
export type CreateQAHACCPReviewRecordInput = z.infer<typeof CreateQAHACCPReviewRecordSchema>;
export type UpdateQAHACCPReviewRecordInput = z.infer<typeof UpdateQAHACCPReviewRecordSchema>;
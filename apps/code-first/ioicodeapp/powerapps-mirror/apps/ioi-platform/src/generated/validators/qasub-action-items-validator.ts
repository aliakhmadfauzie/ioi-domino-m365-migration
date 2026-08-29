import { z } from 'zod';

/**
 * Zod schema for QASubActionItems validation
 */
export const QASubActionItemsSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  actionItemRef: z.object({ id: z.string().uuid(), title: z.string() }).optional(),
  parentRecord: z.object({ id: z.string().uuid(), title: z.string() }).optional(),
  subActionRowNo: z.number().int().optional(),
  subTaskDescription: z.string().optional(),
  verificationStatusKey: z.enum(['VerificationStatusKey0', 'VerificationStatusKey1', 'VerificationStatusKey2']).optional(),
  verifiedBy: z.string().optional(),
  verifiedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
});

/**
 * Schema for creating a new QASubActionItems (omits system-generated ID)
 */
export const CreateQASubActionItemsSchema = QASubActionItemsSchema.omit({ id: true });

/**
 * Schema for updating an existing QASubActionItems
 */
export const UpdateQASubActionItemsSchema = QASubActionItemsSchema;

export type QASubActionItemsInput = z.infer<typeof QASubActionItemsSchema>;
export type CreateQASubActionItemsInput = z.infer<typeof CreateQASubActionItemsSchema>;
export type UpdateQASubActionItemsInput = z.infer<typeof UpdateQASubActionItemsSchema>;
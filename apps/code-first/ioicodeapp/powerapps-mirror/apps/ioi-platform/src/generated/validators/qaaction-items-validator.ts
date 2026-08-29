import { z } from 'zod';

/**
 * Zod schema for QAActionItems validation
 */
export const QAActionItemsSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  actionItem: z.string().optional(),
  actionRowID: z.string().optional(),
  actionTypeKey: z.enum(['ActionTypeKey0', 'ActionTypeKey1', 'ActionTypeKey2', 'ActionTypeKey3', 'ActionTypeKey4', 'ActionTypeKey5', 'ActionTypeKey6']).optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  owner: z.string().optional(),
  parentRecord: z.object({ id: z.string().uuid(), title: z.string() }).optional(),
  statusKey: z.enum(['StatusKey0', 'StatusKey1', 'StatusKey2']).optional(),
});

/**
 * Schema for creating a new QAActionItems (omits system-generated ID)
 */
export const CreateQAActionItemsSchema = QAActionItemsSchema.omit({ id: true });

/**
 * Schema for updating an existing QAActionItems
 */
export const UpdateQAActionItemsSchema = QAActionItemsSchema;

export type QAActionItemsInput = z.infer<typeof QAActionItemsSchema>;
export type CreateQAActionItemsInput = z.infer<typeof CreateQAActionItemsSchema>;
export type UpdateQAActionItemsInput = z.infer<typeof UpdateQAActionItemsSchema>;
import { z } from 'zod';

/**
 * Zod schema for AttachmentIndexSTR validation
 */
export const AttachmentIndexSTRSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  appName: z.string().optional(),
  attachmentCategory: z.string().optional(),
  attachmentID: z.string().optional(),
  fileHash: z.string().optional(),
  fileName: z.string().optional(),
  fileSizeKB: z.string().optional(),
  fileUrl: z.string().optional(),
  isMandatory: z.string().optional(),
  recordID: z.string().optional(),
  site1Key: z.enum(['Site1Key0', 'Site1Key1']).optional(),
  siteKey: z.enum(['SiteKey0', 'SiteKey1']).optional(),
  uploadedBy: z.string().optional(),
  uploadedOn: z.string().optional(),
});

/**
 * Schema for creating a new AttachmentIndexSTR (omits system-generated ID)
 */
export const CreateAttachmentIndexSTRSchema = AttachmentIndexSTRSchema.omit({ id: true });

/**
 * Schema for updating an existing AttachmentIndexSTR
 */
export const UpdateAttachmentIndexSTRSchema = AttachmentIndexSTRSchema;

export type AttachmentIndexSTRInput = z.infer<typeof AttachmentIndexSTRSchema>;
export type CreateAttachmentIndexSTRInput = z.infer<typeof CreateAttachmentIndexSTRSchema>;
export type UpdateAttachmentIndexSTRInput = z.infer<typeof UpdateAttachmentIndexSTRSchema>;
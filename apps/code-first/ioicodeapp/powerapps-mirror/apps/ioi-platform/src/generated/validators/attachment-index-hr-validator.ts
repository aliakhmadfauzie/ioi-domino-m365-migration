import { z } from 'zod';

/**
 * Zod schema for AttachmentIndexHR validation
 */
export const AttachmentIndexHRSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  appName: z.string().optional(),
  attachmentID: z.string().optional(),
  fileName: z.string().optional(),
  fileURL: z.string().optional(),
  recordID: z.string().optional(),
  siteKey: z.enum(['SiteKey0', 'SiteKey1']).optional(),
  uploadedBy: z.string().optional(),
  uploadedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
});

/**
 * Schema for creating a new AttachmentIndexHR (omits system-generated ID)
 */
export const CreateAttachmentIndexHRSchema = AttachmentIndexHRSchema.omit({ id: true });

/**
 * Schema for updating an existing AttachmentIndexHR
 */
export const UpdateAttachmentIndexHRSchema = AttachmentIndexHRSchema;

export type AttachmentIndexHRInput = z.infer<typeof AttachmentIndexHRSchema>;
export type CreateAttachmentIndexHRInput = z.infer<typeof CreateAttachmentIndexHRSchema>;
export type UpdateAttachmentIndexHRInput = z.infer<typeof UpdateAttachmentIndexHRSchema>;
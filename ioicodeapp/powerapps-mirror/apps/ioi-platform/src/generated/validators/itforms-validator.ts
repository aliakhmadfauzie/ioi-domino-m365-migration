import { z } from 'zod';

/**
 * Zod schema for ITForms validation
 */
export const ITFormsSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  applicantName: z.string().optional(),
  comments: z.string().optional(),
  createdDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  currentAction: z.string().optional(),
  currentStage: z.string().optional(),
  department: z.string().optional(),
  designation: z.string().optional(),
  environmentTagKey: z.enum(['EnvironmentTagKey0', 'EnvironmentTagKey1', 'EnvironmentTagKey2']),
  formCode: z.string().min(1, { message: "FormCode is required" }),
  justification: z.string().optional(),
  modifiedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  siteKey: z.enum(['SiteKey0', 'SiteKey1']).optional(),
  statusKey: z.enum(['StatusKey0', 'StatusKey1', 'StatusKey2', 'StatusKey3', 'StatusKey4', 'StatusKey5', 'StatusKey6', 'StatusKey7']),
  submittedByID: z.string().optional(),
  submittedByName: z.string().optional(),
  submittedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
});

/**
 * Schema for creating a new ITForms (omits system-generated ID)
 */
export const CreateITFormsSchema = ITFormsSchema.omit({ id: true });

/**
 * Schema for updating an existing ITForms
 */
export const UpdateITFormsSchema = ITFormsSchema;

export type ITFormsInput = z.infer<typeof ITFormsSchema>;
export type CreateITFormsInput = z.infer<typeof CreateITFormsSchema>;
export type UpdateITFormsInput = z.infer<typeof UpdateITFormsSchema>;
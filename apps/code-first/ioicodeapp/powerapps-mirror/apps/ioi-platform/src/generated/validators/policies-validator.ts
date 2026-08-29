import { z } from 'zod';

/**
 * Zod schema for Policies validation
 */
export const PoliciesSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  approvedByID: z.string().optional(),
  approvedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  comments: z.string().optional(),
  currentActionKey: z.enum(['CurrentActionKey0', 'CurrentActionKey1', 'CurrentActionKey2', 'CurrentActionKey3', 'CurrentActionKey4', 'CurrentActionKey5']),
  dateIssued: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").min(1, { message: "DateIssued is required" }),
  documentAuthorID: z.string().min(1, { message: "DocumentAuthorID is required" }),
  environmentTagKey: z.enum(['EnvironmentTagKey0', 'EnvironmentTagKey1', 'EnvironmentTagKey2']),
  formCode: z.string().min(1, { message: "FormCode is required" }),
  policyNumber: z.string().min(1, { message: "PolicyNumber is required" }),
  policyOwnerID: z.string().min(1, { message: "PolicyOwnerID is required" }),
  revisionNumber: z.string().min(1, { message: "RevisionNumber is required" }),
  statusKey: z.enum(['StatusKey0', 'StatusKey1', 'StatusKey2', 'StatusKey3', 'StatusKey4']),
  subject: z.string().min(1, { message: "Subject is required" }),
  submittedByID: z.string().optional(),
  submittedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
});

/**
 * Schema for creating a new Policies (omits system-generated ID)
 */
export const CreatePoliciesSchema = PoliciesSchema.omit({ id: true });

/**
 * Schema for updating an existing Policies
 */
export const UpdatePoliciesSchema = PoliciesSchema;

export type PoliciesInput = z.infer<typeof PoliciesSchema>;
export type CreatePoliciesInput = z.infer<typeof CreatePoliciesSchema>;
export type UpdatePoliciesInput = z.infer<typeof UpdatePoliciesSchema>;
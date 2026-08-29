import { z } from 'zod';

/**
 * Zod schema for MainDBSHE validation
 */
export const MainDBSHESchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  appName: z.string().optional(),
  attachmentLinks: z.string().optional(),
  currentApproverEmail: z.string().optional(),
  currentStage: z.number().int().optional(),
  departmentKey: z.enum(['DepartmentKey00', 'DepartmentKey01', 'DepartmentKey02', 'DepartmentKey03', 'DepartmentKey04', 'DepartmentKey05', 'DepartmentKey06', 'DepartmentKey07', 'DepartmentKey08', 'DepartmentKey09', 'DepartmentKey10', 'DepartmentKey11', 'DepartmentKey12', 'DepartmentKey13', 'DepartmentKey14', 'DepartmentKey15', 'DepartmentKey16', 'DepartmentKey17', 'DepartmentKey18', 'DepartmentKey19']),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  finalStatus: z.string().optional(),
  formCode: z.string().min(1, { message: "Form Code is required" }),
  formVersion: z.string().optional(),
  iMSRefNo: z.string().optional(),
  iMSRelated: z.boolean().optional(),
  priorityKey: z.enum(['PriorityKey0', 'PriorityKey1', 'PriorityKey2']).optional(),
  requestorEmail: z.string().optional(),
  requestTitle: z.string().optional(),
  siteKey: z.enum(['SiteKey0', 'SiteKey1']).optional(),
  statusKey: z.enum(['StatusKey0', 'StatusKey1', 'StatusKey2', 'StatusKey3', 'StatusKey4', 'StatusKey5', 'StatusKey6']),
  submittedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  workflowAction: z.string().optional(),
});

/**
 * Schema for creating a new MainDBSHE (omits system-generated ID)
 */
export const CreateMainDBSHESchema = MainDBSHESchema.omit({ id: true });

/**
 * Schema for updating an existing MainDBSHE
 */
export const UpdateMainDBSHESchema = MainDBSHESchema;

export type MainDBSHEInput = z.infer<typeof MainDBSHESchema>;
export type CreateMainDBSHEInput = z.infer<typeof CreateMainDBSHESchema>;
export type UpdateMainDBSHEInput = z.infer<typeof UpdateMainDBSHESchema>;
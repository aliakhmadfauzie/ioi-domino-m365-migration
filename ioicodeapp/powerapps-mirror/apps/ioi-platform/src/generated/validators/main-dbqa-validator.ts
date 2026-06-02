import { z } from 'zod';

/**
 * Zod schema for MainDBQA validation
 */
export const MainDBQASchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  appName: z.string().optional(),
  attachmentLinks: z.string().optional(),
  changeControlNumber: z.string().min(1, { message: "Change Control Number is required" }),
  currentApproverEmail: z.string().optional(),
  currentStage: z.number().int().optional(),
  departmentKey: z.enum(['DepartmentKey00', 'DepartmentKey01', 'DepartmentKey02', 'DepartmentKey03', 'DepartmentKey04', 'DepartmentKey05', 'DepartmentKey06', 'DepartmentKey07', 'DepartmentKey08', 'DepartmentKey09', 'DepartmentKey10', 'DepartmentKey11', 'DepartmentKey12', 'DepartmentKey13', 'DepartmentKey14', 'DepartmentKey15', 'DepartmentKey16', 'DepartmentKey17', 'DepartmentKey18', 'DepartmentKey19']),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  finalStatus: z.string().optional(),
  formCode: z.string().min(1, { message: "Form Code is required" }),
  formReferenceID: z.string().min(1, { message: "Form Reference ID is required" }),
  formTypeKey: z.enum(['FormTypeKey00', 'FormTypeKey01', 'FormTypeKey02', 'FormTypeKey03', 'FormTypeKey04', 'FormTypeKey05', 'FormTypeKey06', 'FormTypeKey07', 'FormTypeKey08', 'FormTypeKey09']),
  formVersion: z.string().optional(),
  iMSRefNo: z.string().optional(),
  iMSRelated: z.boolean().optional(),
  incidentIssueType: z.string().optional(),
  plannedEndDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  plannedStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  priorityKey: z.enum(['PriorityKey0', 'PriorityKey1', 'PriorityKey2']).optional(),
  requestorEmail: z.string().optional(),
  requestTitle: z.string().optional(),
  rootCause: z.string().optional(),
  severityLevelKey: z.enum(['SeverityLevelKey0', 'SeverityLevelKey1', 'SeverityLevelKey2', 'SeverityLevelKey3']).optional(),
  siteKey: z.enum(['SiteKey0', 'SiteKey1']).optional(),
  statusKey: z.enum(['StatusKey0', 'StatusKey1', 'StatusKey2', 'StatusKey3', 'StatusKey4', 'StatusKey5', 'StatusKey6']),
  submittedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  targetResolutionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  workflowAction: z.string().optional(),
});

/**
 * Schema for creating a new MainDBQA (omits system-generated ID)
 */
export const CreateMainDBQASchema = MainDBQASchema.omit({ id: true });

/**
 * Schema for updating an existing MainDBQA
 */
export const UpdateMainDBQASchema = MainDBQASchema;

export type MainDBQAInput = z.infer<typeof MainDBQASchema>;
export type CreateMainDBQAInput = z.infer<typeof CreateMainDBQASchema>;
export type UpdateMainDBQAInput = z.infer<typeof UpdateMainDBQASchema>;
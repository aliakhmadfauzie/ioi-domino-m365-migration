import { z } from 'zod';

/**
 * Zod schema for MainDBPRD validation
 */
export const MainDBPRDSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  appName: z.string().optional(),
  approverRemarks: z.string().optional(),
  attachmentLinks: z.string().optional(),
  businessArea: z.string().optional(),
  correctiveActionSummary: z.string().optional(),
  currentApproverDisplayName: z.string().optional(),
  currentApproverEmail: z.string().optional(),
  currentApproverGroup: z.string().optional(),
  currentStage: z.string().optional(),
  departmentKey: z.enum(['DepartmentKey00', 'DepartmentKey01', 'DepartmentKey02', 'DepartmentKey03', 'DepartmentKey04', 'DepartmentKey05', 'DepartmentKey06', 'DepartmentKey07', 'DepartmentKey08', 'DepartmentKey09', 'DepartmentKey10', 'DepartmentKey11', 'DepartmentKey12', 'DepartmentKey13', 'DepartmentKey14', 'DepartmentKey15', 'DepartmentKey16', 'DepartmentKey17', 'DepartmentKey18', 'DepartmentKey19']),
  description: z.string().optional(),
  documentNo: z.string().optional(),
  documentType: z.string().optional(),
  dueDate: z.string().optional(),
  effectiveDate: z.string().optional(),
  finalStatus: z.string().optional(),
  formCode: z.string().min(1, { message: "Form Code is required" }),
  formReferenceID: z.string().min(1, { message: "Form Reference ID is required" }),
  formVersion: z.string().optional(),
  inspectedBy: z.string().optional(),
  inspectionDate: z.string().optional(),
  inspectionRemarks: z.string().optional(),
  inspectionTime: z.string().optional(),
  lastImmediateProduct: z.string().optional(),
  priority: z.string().optional(),
  productCode: z.string().optional(),
  productionBatchNumber: z.string().optional(),
  productionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  productToLoad: z.string().optional(),
  qCApprovalBy: z.string().optional(),
  qCApprovalDate: z.string().optional(),
  qCApprovalStatus: z.string().optional(),
  quantityMT: z.string().optional(),
  reasonForChange: z.string().optional(),
  recipientHODEmail: z.string().optional(),
  requestedBy: z.string().optional(),
  requestorDisplayName: z.string().optional(),
  requestorEmail: z.string().optional(),
  requestTitle: z.string().optional(),
  requiresCOOApproval: z.string().optional(),
  responseDueDate: z.string().optional(),
  responseExtendedDueDate: z.string().optional(),
  revisionNo: z.string().optional(),
  rootCauseSummary: z.string().optional(),
  shiftInformation: z.string().optional(),
  siteKey: z.enum(['SiteKey0', 'SiteKey1']).optional(),
  statusKey: z.enum(['StatusKey0', 'StatusKey1', 'StatusKey2', 'StatusKey3', 'StatusKey4', 'StatusKey5', 'StatusKey6']),
  submittedOn: z.string().optional(),
  systemCode: z.string().optional(),
  tankNo: z.string().optional(),
  targetDate: z.string().optional(),
  urgencyReason: z.string().optional(),
  workflowAction: z.string().optional(),
});

/**
 * Schema for creating a new MainDBPRD (omits system-generated ID)
 */
export const CreateMainDBPRDSchema = MainDBPRDSchema.omit({ id: true });

/**
 * Schema for updating an existing MainDBPRD
 */
export const UpdateMainDBPRDSchema = MainDBPRDSchema;

export type MainDBPRDInput = z.infer<typeof MainDBPRDSchema>;
export type CreateMainDBPRDInput = z.infer<typeof CreateMainDBPRDSchema>;
export type UpdateMainDBPRDInput = z.infer<typeof UpdateMainDBPRDSchema>;
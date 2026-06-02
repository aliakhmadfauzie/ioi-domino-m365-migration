import { z } from 'zod';

/**
 * Zod schema for MainDBFIN validation
 */
export const MainDBFINSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  amount: z.number().int().optional(),
  appName: z.string().optional(),
  approverRemarks: z.string().optional(),
  attachmentLinks: z.string().optional(),
  businessArea: z.string().optional(),
  companyKey: z.enum(['CompanyKey0', 'CompanyKey1', 'CompanyKey2']).optional(),
  contractAmount: z.number().int().optional(),
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
  formVersion: z.string().optional(),
  inspectedBy: z.string().optional(),
  inspectionDate: z.string().optional(),
  inspectionRemarks: z.string().optional(),
  inspectionTime: z.string().optional(),
  iRRPercent: z.string().optional(),
  lastImmediateProduct: z.string().optional(),
  module2Key: z.enum(['Module2Key0', 'Module2Key1', 'Module2Key2']).optional(),
  paybackPeriod: z.string().optional(),
  priority: z.string().optional(),
  problemDesc: z.string().optional(),
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
  section: z.string().optional(),
  siteKey: z.enum(['SiteKey0', 'SiteKey1']).optional(),
  statusKey: z.enum(['StatusKey0', 'StatusKey1', 'StatusKey2', 'StatusKey3', 'StatusKey4', 'StatusKey5', 'StatusKey6']),
  statusRequest: z.string().optional(),
  submittedOn: z.string().optional(),
  systemCode: z.string().optional(),
  tankNo: z.string().optional(),
  targetDate: z.string().optional(),
  urgencyReason: z.string().optional(),
  workflowAction: z.string().optional(),
});

/**
 * Schema for creating a new MainDBFIN (omits system-generated ID)
 */
export const CreateMainDBFINSchema = MainDBFINSchema.omit({ id: true });

/**
 * Schema for updating an existing MainDBFIN
 */
export const UpdateMainDBFINSchema = MainDBFINSchema;

export type MainDBFINInput = z.infer<typeof MainDBFINSchema>;
export type CreateMainDBFINInput = z.infer<typeof CreateMainDBFINSchema>;
export type UpdateMainDBFINInput = z.infer<typeof UpdateMainDBFINSchema>;
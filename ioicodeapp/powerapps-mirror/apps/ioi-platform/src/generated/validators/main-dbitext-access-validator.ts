import { z } from 'zod';

/**
 * Zod schema for MainDBITExtAccess validation
 */
export const MainDBITExtAccessSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  eAFApplication: z.string().optional(),
  eAFDDAppApprovedBy: z.string().optional(),
  eAFDDAppComment: z.string().optional(),
  eAFDDAppDate: z.string().optional(),
  eAFDDAppStatus: z.string().optional(),
  eAFDeptHeadComment: z.string().optional(),
  eAFDeptHeadDate: z.string().optional(),
  eAFDeptHeadEmail: z.string().optional(),
  eAFDeptHeadStatus: z.string().optional(),
  eAFIsPCN: z.string().optional(),
  eAFITCompletedBy: z.string().optional(),
  eAFITCompletedDate: z.string().optional(),
  eAFITCompletionStatus: z.string().optional(),
  eAFITManagerApprovedBy: z.string().optional(),
  eAFITManagerComment: z.string().optional(),
  eAFITManagerDate: z.string().optional(),
  eAFITManagerStatus: z.string().optional(),
  eAFJustification: z.string().optional(),
  eAFReminderTo: z.string().optional(),
  eAFSystemName: z.string().optional(),
  eAFTargetUserEmail: z.string().optional(),
  nIRDepartment: z.string().optional(),
  nIRFullName: z.string().optional(),
  nIRHODApprovalStatus: z.string().optional(),
  nIRHODApprovedBy: z.string().optional(),
  nIRHODApprovedDate: z.string().optional(),
  nIRITHardwareBy: z.string().optional(),
  nIRITHardwareStatus: z.string().optional(),
  nIRNotesAdminBy: z.string().optional(),
  nIRNotesAdminDate: z.string().optional(),
  nIRNotesAdminStatus: z.string().optional(),
  nIRRequestType: z.string().optional(),
  parentFormCode: z.string().min(1, { message: "Parent Form Code is required" }),
  parentRecord: z.object({ id: z.number().int(), title: z.string() }),
  parentSite: z.string().optional(),
  pRFStatus1: z.string().optional(),
  pRFStatus2: z.string().optional(),
  pRFStatus3: z.string().optional(),
  pRFStatus4: z.string().optional(),
  pRFFinalStatus: z.string().optional(),
  pRFStatusISG: z.string().optional(),
  pRFDateApp1: z.string().optional(),
  pRFDateApp2: z.string().optional(),
  pRFDateApp2_1: z.string().optional(),
  pRFDateApp3: z.string().optional(),
  pRFDateApp4: z.string().optional(),
  pRFDateSent: z.string().optional(),
  pRFDateISG: z.string().optional(),
  pRFDeptHead: z.string().optional(),
  pRFISG: z.string().optional(),
  pRFIsmgr2: z.string().optional(),
  pRFIsmgr: z.string().optional(),
  pRFAppByISG: z.string().optional(),
  pRFAppBySAP: z.string().optional(),
  pRFByISStaff: z.string().optional(),
  pRFNotifiedBy: z.string().optional(),
  pRFABAP: z.string().optional(),
  pRFFuncOwnerSAP: z.string().optional(),
  pRFAttachedBy: z.string().optional(),
  pRFComments1: z.string().optional(),
  pRFComment1: z.string().optional(),
  pRFCommentsISG: z.string().optional(),
  pRFITReason: z.string().optional(),
  pRFRating: z.number().int().optional(),
  pRFRFC: z.string().optional(),
  rSEDApprovedBy: z.string().optional(),
  rSEDApprovedDate: z.string().optional(),
  rSITProcessedBy: z.string().optional(),
  rSITProcessedDate: z.string().optional(),
  rSNeedsEDApproval: z.string().optional(),
  rSRequestType: z.string().optional(),
  rSTargetUserEmail: z.string().optional(),
  sFARAccessLevel: z.string().optional(),
  sFARFolderPath: z.string().optional(),
  sFARReviewedBy: z.string().optional(),
  sFARReviewedDate: z.string().optional(),
  uRITAdminBy: z.string().optional(),
  uRITAdminDate: z.string().optional(),
  uRSystemAccess: z.string().optional(),
  uRUserDepartment: z.string().optional(),
  uRUserFullName: z.string().optional(),
});

/**
 * Schema for creating a new MainDBITExtAccess (omits system-generated ID)
 */
export const CreateMainDBITExtAccessSchema = MainDBITExtAccessSchema.omit({ id: true });

/**
 * Schema for updating an existing MainDBITExtAccess
 */
export const UpdateMainDBITExtAccessSchema = MainDBITExtAccessSchema;

export type MainDBITExtAccessInput = z.infer<typeof MainDBITExtAccessSchema>;
export type CreateMainDBITExtAccessInput = z.infer<typeof CreateMainDBITExtAccessSchema>;
export type UpdateMainDBITExtAccessInput = z.infer<typeof UpdateMainDBITExtAccessSchema>;

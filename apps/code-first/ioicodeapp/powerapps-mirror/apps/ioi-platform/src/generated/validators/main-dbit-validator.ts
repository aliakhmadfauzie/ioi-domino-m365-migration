import { z } from 'zod';

/**
 * Zod schema for MainDBIT validation
 */
export const MainDBITSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  currentStatus: z.enum(['CurrentstatusKey0', 'CurrentstatusKey1', 'CurrentstatusKey2', 'CurrentstatusKey3', 'CurrentstatusKey4', 'CurrentstatusKey5', 'CurrentstatusKey6', 'CurrentstatusKey7', 'CurrentstatusKey8', 'CurrentstatusKey9', 'CurrentstatusKey10', 'CurrentstatusKey11', 'CurrentstatusKey12', 'CurrentstatusKey13', 'CurrentstatusKey14', 'CurrentstatusKey15', 'CurrentstatusKey16', 'CurrentstatusKey17', 'CurrentstatusKey18', 'CurrentstatusKey19','CurrentstatusKey20', 'CurrentstatusKey21', 'CurrentstatusKey22', 'CurrentstatusKey23', 'CurrentstatusKey24', 'CurrentstatusKey25', 'CurrentstatusKey26', 'CurrentstatusKey27', 'CurrentstatusKey28', 'CurrentstatusKey29', 'CurrentstatusKey30', 'CurrentstatusKey31', 'CurrentstatusKey32', 'CurrentstatusKey33', 'CurrentstatusKey34', 'CurrentstatusKey35', 'CurrentstatusKey36', 'CurrentstatusKey37', 'CurrentstatusKey38', 'CurrentstatusKey39', 'CurrentstatusKey40','CurrentstatusKey41,CurrentstatusKey42 ,CurrentstatusKey43,CurrentstatusKey44 ,CurrentstatusKey45,CurrentstatusKey46,CurrentstatusKey47,CurrentstatusKey48,CurrentstatusKey49,CurrentstatusKey50,CurrentstatusKey51,CurrentstatusKey52,CurrentstatusKey53,CurrentstatusKey54,CurrentstatusKey55,CurrentstatusKey56,CurrentstatusKey57,CurrentstatusKey58,CurrentstatusKey59,CurrentstatusKey60,CurrentstatusKey61,CurrentstatusKey62,CurrentstatusKey63,CurrentstatusKey64,CurrentstatusKey65,CurrentstatusKey66,CurrentstatusKey67,CurrentstatusKey68,CurrentstatusKey69,CurrentstatusKey70']),
  environmenttagKey: z.enum(['EnvironmenttagKey0', 'EnvironmenttagKey1', 'EnvironmenttagKey2']).optional(),
  formcode: z.string().min(1, { message: "FormCode is required" }),
  formTypeKey: z.enum(['FormTypeKey0', 'FormTypeKey1', 'FormTypeKey2']).optional(),
  hODApproverRemarks: z.string().optional(),
  hTMLEMAILTEMPLATE: z.string().optional(),
  islocked: z.boolean().optional(),
  remarks: z.string().optional(),
  requestoremail: z.string().optional(),
  siteKey: z.enum(['SiteKey0', 'SiteKey1', 'SiteKey2', 'SiteKey3', 'SiteKey4']).optional(),
  submitteddate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  workflowstage: z.number().int().optional(),
  rSUserName: z.string().optional(),
  rSDesignation: z.string().optional(),
  rSCompany: z.string().optional(),
  rSDepartment: z.string().optional(),
  rSLocation: z.string().optional(),
  rSResetType: z.string().optional(),
  rSReasonForReset: z.string().optional(),
  rSBankTokenSerial: z.string().optional(),
  rSExecutiveDirectorEmail: z.string().optional(),
  rSSAPClient: z.string().optional(),
  rSIEPClientName: z.string().optional(),
  sFARCompany: z.string().optional(),
  sFARDepartment: z.string().optional(),
  sFARExtension: z.string().optional(),
  sFARFolderType: z.string().optional(),
  sFARServerName: z.string().optional(),
  sFARRequestType: z.string().optional(),
  sFARHODEmail: z.string().optional(),
  sFAROwner: z.string().optional(),
  sFARAccessTo: z.string().optional(),
  sFARAccessToName: z.string().optional(),
  sFARPurpose: z.string().optional(),
  sFARJustification: z.string().optional(),
  uRRequestType: z.string().optional(),
  uREmployeeNumber: z.string().optional(),
  uRDesignation: z.string().optional(),
  uRCompany: z.string().optional(),
  uRDivision: z.string().optional(),
  uRExtension: z.string().optional(),
  uREmailAddress: z.string().optional(),
  uRBankName: z.string().optional(),
  uRBankUserEmail: z.string().optional(),
  uRPlant: z.string().optional(),
  pRFSAPClient: z.string().optional(),
  pRFSAPModule: z.string().optional(),
  pRFDepartment: z.string().optional(),
  pRFPriority: z.string().optional(),
  pRFDeadline: z.string().optional(),
  pRFPhoneExt: z.string().optional(),
  pRFCCEmails: z.string().optional(),
  pRFObjective: z.string().optional(),
  pRFJustification: z.string().optional(),
  pRFCurrentProcess: z.string().optional(),
  pRFExpectedOutcome: z.string().optional(),
  hIPONumber: z.string().optional(),
  hIWarrantyExpiry: z.string().optional(),
  hICondition: z.string().optional(),
  hISpecifications: z.string().optional(),
  hIPurchasePrice: z.number().optional(),
});

/**
 * Schema for creating a new MainDBIT (omits system-generated ID)
 */
export const CreateMainDBITSchema = MainDBITSchema.omit({ id: true });

/**
 * Schema for updating an existing MainDBIT
 */
export const UpdateMainDBITSchema = MainDBITSchema;

export type MainDBITInput = z.infer<typeof MainDBITSchema>;
export type CreateMainDBITInput = z.infer<typeof CreateMainDBITSchema>;
export type UpdateMainDBITInput = z.infer<typeof UpdateMainDBITSchema>;

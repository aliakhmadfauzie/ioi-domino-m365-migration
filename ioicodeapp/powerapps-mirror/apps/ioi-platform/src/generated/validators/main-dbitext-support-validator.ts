import { z } from 'zod';

/**
 * Zod schema for MainDBITExtSupport validation
 */
export const MainDBITExtSupportSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  iTDR2AssignedTo: z.string().optional(),
  iTDR2ClosedDate: z.string().optional(),
  iTDR2DueDate: z.string().optional(),
  iTDR2TaskDescription: z.string().optional(),
  iTDR2TaskStatus: z.string().optional(),
  iTDR2Year: z.string().optional(),
  iTDR2Month: z.string().optional(),
  iTDR2Title: z.string().optional(),
  iTDRActivityType: z.string().optional(),
  iTDRCategory: z.string().optional(),
  iTDRDateFrom: z.string().optional(),
  iTDRDateTo: z.string().optional(),
  iTDRParticipants: z.string().optional(),
  iTDRVenue: z.string().optional(),
  iTSSRAssignedToEmail: z.string().optional(),
  iTSSRCaseNo: z.string().optional(),
  iTSSRDateAccepted: z.string().optional(),
  iTSSRDateResolved: z.string().optional(),
  iTSSRDateStarted: z.string().optional(),
  iTSSRProblemCategory: z.string().optional(),
  iTSSRProblemDescription: z.string().optional(),
  iTSSRReportedByEmail: z.string().optional(),
  iTSSRSatisfactionRating: z.number().int().optional(),
  iTSSRServiceType: z.string().optional(),
  iTSSRSolution: z.string().optional(),
  iTSSRSupportMethod: z.string().optional(),
  iTSSRDepartment: z.string().optional(),
  iTSSRExtension: z.string().optional(),
  iTSSRServiceType2: z.string().optional(),
  iTSSRHardware: z.string().optional(),
  iTSSRHardware2: z.string().optional(),
  iTSSRApplication: z.string().optional(),
  iTSSRModule: z.string().optional(),
  iTSSRSAPModule: z.string().optional(),
  iTSSRBankModule: z.string().optional(),
  iTSSRCC: z.string().optional(),
  iTSSRITRemarks: z.string().optional(),
  iTSSRDateNotified: z.string().optional(),
  iTSSRDateClosed: z.string().optional(),
  iTSSRITName: z.string().optional(),
  iTSSRProblemCategory2: z.string().optional(),
  iTSSRCS: z.string().optional(),
  iTSSRUS: z.string().optional(),
  iTSSRCOOApproval: z.string().optional(),
  iTSSRHWComment: z.string().optional(),
  iTSSRVerifiedBy: z.string().optional(),
  iTSSRVerificationDate: z.string().optional(),
  iTSSRVerificationStatus: z.string().optional(),
  iTSSRManagerBy: z.string().optional(),
  iTSSRManagerDate: z.string().optional(),
  iTSSRManagerComment: z.string().optional(),
  iTSSRManagerStatus: z.string().optional(),
  iTSSRCOOBy: z.string().optional(),
  iTSSRCOODate: z.string().optional(),
  iTSSRCOOComment: z.string().optional(),
  iTSSRCOOStatus: z.string().optional(),
  iTSSRRequestorComment: z.string().optional(),
  parentFormCode: z.string().min(1, { message: "Parent Form Code is required" }),
  parentRecord: z.object({ id: z.union([z.number().int(), z.string()]), title: z.string() }),
  parentSite: z.string().optional(),
});

/**
 * Schema for creating a new MainDBITExtSupport (omits system-generated ID)
 */
export const CreateMainDBITExtSupportSchema = MainDBITExtSupportSchema.omit({ id: true });

/**
 * Schema for updating an existing MainDBITExtSupport
 */
export const UpdateMainDBITExtSupportSchema = MainDBITExtSupportSchema;

export type MainDBITExtSupportInput = z.infer<typeof MainDBITExtSupportSchema>;
export type CreateMainDBITExtSupportInput = z.infer<typeof CreateMainDBITExtSupportSchema>;
export type UpdateMainDBITExtSupportInput = z.infer<typeof UpdateMainDBITExtSupportSchema>;

import { z } from 'zod';

/**
 * Zod schema for MainDBITExtSAP validation
 */
export const MainDBITExtSAPSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  parentFormCode: z.string().min(1, { message: "Parent Form Code is required" }),
  parentRecord: z.object({ id: z.string().uuid(), title: z.string() }),
  parentSite: z.string().optional(),
  pRFDeptManagerEmail: z.string().optional(),
  pRFIsSAP: z.string().optional(),
  pRFITApprovedDate: z.string().optional(),
  pRFITApprovedEmail: z.string().optional(),
  pRFRequestNo: z.string().optional(),
  pRFRequestType: z.string().optional(),
  sAPClient: z.string().optional(),
  sAPModule: z.string().optional(),
  sAPPlant: z.string().optional(),
  sAPRemarks: z.string().optional(),
  sAPReviewedBy: z.string().optional(),
  sAPReviewedDate: z.string().optional(),
  sAPSOFCurrentStage: z.string().optional(),
  sAPSOFFinalDecision: z.string().optional(),
  sAPSOFIsBPORequired: z.string().optional(),
  sAPSOFITSubmittedDate: z.string().optional(),
  sAPTRNumber: z.string().optional(),
});

/**
 * Schema for creating a new MainDBITExtSAP (omits system-generated ID)
 */
export const CreateMainDBITExtSAPSchema = MainDBITExtSAPSchema.omit({ id: true });

/**
 * Schema for updating an existing MainDBITExtSAP
 */
export const UpdateMainDBITExtSAPSchema = MainDBITExtSAPSchema;

export type MainDBITExtSAPInput = z.infer<typeof MainDBITExtSAPSchema>;
export type CreateMainDBITExtSAPInput = z.infer<typeof CreateMainDBITExtSAPSchema>;
export type UpdateMainDBITExtSAPInput = z.infer<typeof UpdateMainDBITExtSAPSchema>;
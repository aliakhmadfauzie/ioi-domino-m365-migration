import { z } from 'zod';

/**
 * Zod schema for MainDBITExtAssets validation
 */
export const MainDBITExtAssetsSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  hIAssetNo: z.string().optional(),
  hICompany: z.string().optional(),
  hIComputerName: z.string().optional(),
  hIDepartment: z.string().optional(),
  hILastAuditedDate: z.string().optional(),
  hILocation: z.string().optional(),
  hIMachineID: z.string().optional(),
  hIMonth: z.number().int().optional(),
  hIOfficeVersion: z.string().optional(),
  hIPurchaseDate: z.string().optional(),
  hISerialNo: z.string().optional(),
  hIStatus: z.string().optional(),
  hITagNo: z.string().optional(),
  hIType: z.string().optional(),
  hIUsedByEmail: z.string().optional(),
  hIVendor: z.string().optional(),
  hIWindowsVersion: z.string().optional(),
  hIYear: z.number().int().optional(),
  iTSCChecklistYear: z.string().optional(),
  iTSCReviewedBy: z.string().optional(),
  iTSCReviewedDate: z.string().optional(),
  iTSCServerName: z.string().optional(),
  parentFormCode: z.string().min(1, { message: "Parent Form Code is required" }),
  parentRecord: z.object({ id: z.string().uuid(), title: z.string() }),
  parentSite: z.string().optional(),
});

/**
 * Schema for creating a new MainDBITExtAssets (omits system-generated ID)
 */
export const CreateMainDBITExtAssetsSchema = MainDBITExtAssetsSchema.omit({ id: true });

/**
 * Schema for updating an existing MainDBITExtAssets
 */
export const UpdateMainDBITExtAssetsSchema = MainDBITExtAssetsSchema;

export type MainDBITExtAssetsInput = z.infer<typeof MainDBITExtAssetsSchema>;
export type CreateMainDBITExtAssetsInput = z.infer<typeof CreateMainDBITExtAssetsSchema>;
export type UpdateMainDBITExtAssetsInput = z.infer<typeof UpdateMainDBITExtAssetsSchema>;
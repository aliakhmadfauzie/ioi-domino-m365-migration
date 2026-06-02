import { z } from 'zod';

/**
 * Zod schema for HRRoutingMatrix validation
 */
export const HRRoutingMatrixSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  appCode: z.string().optional(),
  approverTypeKey: z.enum(['ApproverTypeKey0', 'ApproverTypeKey1']).optional(),
  approverValue: z.string().optional(),
  backupApproverEmail: z.string().optional(),
  department: z.string().optional(),
  formName: z.string().optional(),
  isActive: z.string().optional(),
  site1Key: z.enum(['Site1Key0', 'Site1Key1']).optional(),
  siteKey: z.enum(['SiteKey0', 'SiteKey1']).optional(),
  stageKey: z.string().optional(),
  stageNo: z.number().int().optional(),
});

/**
 * Schema for creating a new HRRoutingMatrix (omits system-generated ID)
 */
export const CreateHRRoutingMatrixSchema = HRRoutingMatrixSchema.omit({ id: true });

/**
 * Schema for updating an existing HRRoutingMatrix
 */
export const UpdateHRRoutingMatrixSchema = HRRoutingMatrixSchema;

export type HRRoutingMatrixInput = z.infer<typeof HRRoutingMatrixSchema>;
export type CreateHRRoutingMatrixInput = z.infer<typeof CreateHRRoutingMatrixSchema>;
export type UpdateHRRoutingMatrixInput = z.infer<typeof UpdateHRRoutingMatrixSchema>;
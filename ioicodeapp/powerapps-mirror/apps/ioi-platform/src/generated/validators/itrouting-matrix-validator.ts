import { z } from 'zod';

/**
 * Zod schema for ITRoutingMatrix validation
 */
export const ITRoutingMatrixSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  approverRole: z.string().optional(),
  approverSPGroup: z.string().optional(),
  escalationDays: z.number().int().optional(),
  formName: z.string().min(1, { message: "FormName is required" }),
  isActive: z.boolean().optional(),
  siteScopeKey: z.enum(['SiteScopeKey0', 'SiteScopeKey1', 'SiteScopeKey2', 'SiteScopeKey3', 'SiteScopeKey4']).optional(),
  stageKey: z.string().min(1, { message: "StageKey is required" }),
  stageLabel: z.string().optional(),
});

/**
 * Schema for creating a new ITRoutingMatrix (omits system-generated ID)
 */
export const CreateITRoutingMatrixSchema = ITRoutingMatrixSchema.omit({ id: true });

/**
 * Schema for updating an existing ITRoutingMatrix
 */
export const UpdateITRoutingMatrixSchema = ITRoutingMatrixSchema;

export type ITRoutingMatrixInput = z.infer<typeof ITRoutingMatrixSchema>;
export type CreateITRoutingMatrixInput = z.infer<typeof CreateITRoutingMatrixSchema>;
export type UpdateITRoutingMatrixInput = z.infer<typeof UpdateITRoutingMatrixSchema>;
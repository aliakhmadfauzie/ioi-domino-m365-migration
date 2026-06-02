import { z } from 'zod';

/**
 * Zod schema for HRHealthRegister validation
 */
export const HRHealthRegisterSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  employeeNo: z.string().optional(),
  healthItem: z.string().optional(),
  recordNo: z.string().optional(),
  result: z.string().optional(),
  site1Key: z.enum(['Site1Key0', 'Site1Key1']).optional(),
  siteKey: z.enum(['SiteKey0', 'SiteKey1']).optional(),
  statusKey: z.enum(['StatusKey0', 'StatusKey1', 'StatusKey2', 'StatusKey3', 'StatusKey4', 'StatusKey5', 'StatusKey6']).optional(),
});

/**
 * Schema for creating a new HRHealthRegister (omits system-generated ID)
 */
export const CreateHRHealthRegisterSchema = HRHealthRegisterSchema.omit({ id: true });

/**
 * Schema for updating an existing HRHealthRegister
 */
export const UpdateHRHealthRegisterSchema = HRHealthRegisterSchema;

export type HRHealthRegisterInput = z.infer<typeof HRHealthRegisterSchema>;
export type CreateHRHealthRegisterInput = z.infer<typeof CreateHRHealthRegisterSchema>;
export type UpdateHRHealthRegisterInput = z.infer<typeof UpdateHRHealthRegisterSchema>;
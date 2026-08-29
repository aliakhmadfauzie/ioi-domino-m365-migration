import { z } from 'zod';

/**
 * Zod schema for ConfigGlobalUserRoleAssignments validation
 */
export const ConfigGlobalUserRoleAssignmentsSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  assignmentScopeKey: z.enum(['AssignmentScopeKey0', 'AssignmentScopeKey1', 'AssignmentScopeKey2']).optional(),
  departmentScope: z.string().optional(),
  isActive: z.boolean().optional(),
  moduleScope: z.string().optional(),
  notes: z.string().optional(),
  roleKey: z.string().min(1, { message: "Role Key is required" }),
  userPrincipalName: z.string().min(1, { message: "User Principal Name is required" }),
});

/**
 * Schema for creating a new ConfigGlobalUserRoleAssignments (omits system-generated ID)
 */
export const CreateConfigGlobalUserRoleAssignmentsSchema = ConfigGlobalUserRoleAssignmentsSchema.omit({ id: true });

/**
 * Schema for updating an existing ConfigGlobalUserRoleAssignments
 */
export const UpdateConfigGlobalUserRoleAssignmentsSchema = ConfigGlobalUserRoleAssignmentsSchema;

export type ConfigGlobalUserRoleAssignmentsInput = z.infer<typeof ConfigGlobalUserRoleAssignmentsSchema>;
export type CreateConfigGlobalUserRoleAssignmentsInput = z.infer<typeof CreateConfigGlobalUserRoleAssignmentsSchema>;
export type UpdateConfigGlobalUserRoleAssignmentsInput = z.infer<typeof UpdateConfigGlobalUserRoleAssignmentsSchema>;
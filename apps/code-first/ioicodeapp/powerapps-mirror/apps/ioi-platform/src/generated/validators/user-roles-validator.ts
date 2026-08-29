import { z } from 'zod';

/**
 * Zod schema for UserRoles validation
 */
export const UserRolesSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  canAdmin: z.boolean().optional(),
  canApprove: z.boolean().optional(),
  departmentKey: z.enum(['DepartmentKey00', 'DepartmentKey01', 'DepartmentKey02', 'DepartmentKey03', 'DepartmentKey04', 'DepartmentKey05', 'DepartmentKey06', 'DepartmentKey07', 'DepartmentKey08', 'DepartmentKey09', 'DepartmentKey10']).optional(),
  effectiveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  email: z.string().optional(),
  expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  moduleAccessKeys: z.array(z.enum(['ModuleAccessKeys00', 'ModuleAccessKeys01', 'ModuleAccessKeys02', 'ModuleAccessKeys03', 'ModuleAccessKeys04', 'ModuleAccessKeys05', 'ModuleAccessKeys06', 'ModuleAccessKeys07', 'ModuleAccessKeys08', 'ModuleAccessKeys09'])).optional(),
  roleKey: z.enum(['RoleKey0', 'RoleKey1', 'RoleKey2', 'RoleKey3', 'RoleKey4']),
  userID: z.string().min(1, { message: "User ID is required" }),
});

/**
 * Schema for creating a new UserRoles (omits system-generated ID)
 */
export const CreateUserRolesSchema = UserRolesSchema.omit({ id: true });

/**
 * Schema for updating an existing UserRoles
 */
export const UpdateUserRolesSchema = UserRolesSchema;

export type UserRolesInput = z.infer<typeof UserRolesSchema>;
export type CreateUserRolesInput = z.infer<typeof CreateUserRolesSchema>;
export type UpdateUserRolesInput = z.infer<typeof UpdateUserRolesSchema>;
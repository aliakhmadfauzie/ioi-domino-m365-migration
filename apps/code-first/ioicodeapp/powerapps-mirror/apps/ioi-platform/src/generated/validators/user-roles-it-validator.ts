import { z } from 'zod';

/**
 * Zod schema for UserRolesIT validation
 */
export const UserRolesITSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  appName: z.string().optional(),
  department: z.string().optional(),
  effectiveFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  effectiveTo: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  entitySiteKey: z.enum(['EntitySiteKey0', 'EntitySiteKey1', 'EntitySiteKey2']).optional(),
  isActive: z.boolean().optional(),
  roleCodeKey: z.enum(['RoleCodeKey0', 'RoleCodeKey1', 'RoleCodeKey2', 'RoleCodeKey3', 'RoleCodeKey4', 'RoleCodeKey5', 'RoleCodeKey6', 'RoleCodeKey7']),
  roleDisplay: z.string().optional(),
  securityRole: z.string().min(1, { message: "SecurityRole is required" }),
  siteKey: z.enum(['SiteKey0', 'SiteKey1', 'SiteKey2']).optional(),
  userDisplayName: z.string().min(1, { message: "UserDisplayName is required" }),
  userEmail: z.string().min(1, { message: "UserEmail is required" }),
});

/**
 * Schema for creating a new UserRolesIT (omits system-generated ID)
 */
export const CreateUserRolesITSchema = UserRolesITSchema.omit({ id: true });

/**
 * Schema for updating an existing UserRolesIT
 */
export const UpdateUserRolesITSchema = UserRolesITSchema;

export type UserRolesITInput = z.infer<typeof UserRolesITSchema>;
export type CreateUserRolesITInput = z.infer<typeof CreateUserRolesITSchema>;
export type UpdateUserRolesITInput = z.infer<typeof UpdateUserRolesITSchema>;
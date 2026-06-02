import { z } from 'zod';

/**
 * Zod schema for RoutePermissions validation
 */
export const RoutePermissionsSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  allowedRolesKeys: z.array(z.enum(['AllowedRolesKeys0', 'AllowedRolesKeys1', 'AllowedRolesKeys2', 'AllowedRolesKeys3', 'AllowedRolesKeys4'])).optional(),
  departmentKey: z.enum(['DepartmentKey00', 'DepartmentKey01', 'DepartmentKey02', 'DepartmentKey03', 'DepartmentKey04', 'DepartmentKey05', 'DepartmentKey06', 'DepartmentKey07', 'DepartmentKey08', 'DepartmentKey09']).optional(),
  isPublic: z.boolean().optional(),
  redirectPath: z.string().optional(),
  requiresAuth: z.boolean().optional(),
  routeName: z.string().optional(),
  routePath: z.string().min(1, { message: "Route Path is required" }),
});

/**
 * Schema for creating a new RoutePermissions (omits system-generated ID)
 */
export const CreateRoutePermissionsSchema = RoutePermissionsSchema.omit({ id: true });

/**
 * Schema for updating an existing RoutePermissions
 */
export const UpdateRoutePermissionsSchema = RoutePermissionsSchema;

export type RoutePermissionsInput = z.infer<typeof RoutePermissionsSchema>;
export type CreateRoutePermissionsInput = z.infer<typeof CreateRoutePermissionsSchema>;
export type UpdateRoutePermissionsInput = z.infer<typeof UpdateRoutePermissionsSchema>;
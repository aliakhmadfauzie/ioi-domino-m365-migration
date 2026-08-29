import { z } from 'zod';

/**
 * Zod schema for UserProfiles validation
 */
export const UserProfilesSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  departmentKey: z.enum(['DepartmentKey00', 'DepartmentKey01', 'DepartmentKey02', 'DepartmentKey03', 'DepartmentKey04', 'DepartmentKey05', 'DepartmentKey06', 'DepartmentKey07', 'DepartmentKey08', 'DepartmentKey09']).optional(),
  displayName: z.string().min(1, { message: "Display Name is required" }),
  email: z.string().min(1, { message: "Email is required" }),
  employeeID: z.string().optional(),
  isActive: z.boolean().optional(),
  phone: z.string().optional(),
  profilePhotoURL: z.string().url().optional(),
  siteKey: z.enum(['SiteKey0', 'SiteKey1', 'SiteKey2']).optional(),
  userID: z.string().optional(),
});

/**
 * Schema for creating a new UserProfiles (omits system-generated ID)
 */
export const CreateUserProfilesSchema = UserProfilesSchema.omit({ id: true });

/**
 * Schema for updating an existing UserProfiles
 */
export const UpdateUserProfilesSchema = UserProfilesSchema;

export type UserProfilesInput = z.infer<typeof UserProfilesSchema>;
export type CreateUserProfilesInput = z.infer<typeof CreateUserProfilesSchema>;
export type UpdateUserProfilesInput = z.infer<typeof UpdateUserProfilesSchema>;
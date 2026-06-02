import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserProfilesService } from "../services/user-profiles-service";
import type { UserProfiles } from "../models/user-profiles-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all UserProfiles records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, departmentKey, displayName, email, employeeID, isActive, phone, profilePhotoURL, siteKey, userID
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useUserProfilesList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["userProfiles-list", options],
    queryFn: () => UserProfilesService.getAll(options),
  });
}

/**
 * Retrieve a single UserProfiles record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useUserProfiles(id: string) {
  return useQuery({
    queryKey: ["userProfiles", id],
    queryFn: () => UserProfilesService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new UserProfiles record.
 * @remarks Form validation: use CreateUserProfilesSchema with zodResolver for type-safe create forms
 */
export function useCreateUserProfiles() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<UserProfiles, "id">) => UserProfilesService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["userProfiles-list"] });
    },
  });
}

/**
 * Update an existing UserProfiles record.
 * @remarks Form validation: use UpdateUserProfilesSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateUserProfiles() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<UserProfiles, "id">>;
    }) => UserProfilesService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["userProfiles-list"] });
      client.invalidateQueries({ queryKey: ["userProfiles", variables.id] });
    },
  });
}

/**
 * Delete a UserProfiles record by its unique identifier.
 */
export function useDeleteUserProfiles() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => UserProfilesService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["userProfiles-list"] });
      client.invalidateQueries({ queryKey: ["userProfiles", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const UserProfiles_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { UserProfilesSchema, CreateUserProfilesSchema, UpdateUserProfilesSchema } from "../validators/user-profiles-validator";
export type { UserProfilesInput, CreateUserProfilesInput, UpdateUserProfilesInput } from "../validators/user-profiles-validator";
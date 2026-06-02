import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserRolesService } from "../services/user-roles-service";
import type { UserRoles } from "../models/user-roles-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all UserRoles records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, canAdmin, canApprove, departmentKey, effectiveDate, email, expiryDate, moduleAccessKeys, roleKey, userID
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useUserRolesList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["userRoles-list", options],
    queryFn: () => UserRolesService.getAll(options),
  });
}

/**
 * Retrieve a single UserRoles record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useUserRoles(id: string) {
  return useQuery({
    queryKey: ["userRoles", id],
    queryFn: () => UserRolesService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new UserRoles record.
 * @remarks Form validation: use CreateUserRolesSchema with zodResolver for type-safe create forms
 */
export function useCreateUserRoles() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<UserRoles, "id">) => UserRolesService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["userRoles-list"] });
    },
  });
}

/**
 * Update an existing UserRoles record.
 * @remarks Form validation: use UpdateUserRolesSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateUserRoles() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<UserRoles, "id">>;
    }) => UserRolesService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["userRoles-list"] });
      client.invalidateQueries({ queryKey: ["userRoles", variables.id] });
    },
  });
}

/**
 * Delete a UserRoles record by its unique identifier.
 */
export function useDeleteUserRoles() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => UserRolesService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["userRoles-list"] });
      client.invalidateQueries({ queryKey: ["userRoles", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const UserRoles_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { UserRolesSchema, CreateUserRolesSchema, UpdateUserRolesSchema } from "../validators/user-roles-validator";
export type { UserRolesInput, CreateUserRolesInput, UpdateUserRolesInput } from "../validators/user-roles-validator";
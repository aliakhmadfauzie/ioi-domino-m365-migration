import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserRolesITService } from "../services/user-roles-it-service";
import type { UserRolesIT } from "../models/user-roles-it-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all UserRolesIT records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, appName, department, effectiveFrom, effectiveTo, entitySiteKey, isActive, roleCodeKey, roleDisplay, securityRole, siteKey, userDisplayName, userEmail
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useUserRolesITList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["userRolesIT-list", options],
    queryFn: () => UserRolesITService.getAll(options),
  });
}

/**
 * Retrieve a single UserRolesIT record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useUserRolesIT(id: string) {
  return useQuery({
    queryKey: ["userRolesIT", id],
    queryFn: () => UserRolesITService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new UserRolesIT record.
 * @remarks Form validation: use CreateUserRolesITSchema with zodResolver for type-safe create forms
 */
export function useCreateUserRolesIT() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<UserRolesIT, "id">) => UserRolesITService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["userRolesIT-list"] });
    },
  });
}

/**
 * Update an existing UserRolesIT record.
 * @remarks Form validation: use UpdateUserRolesITSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateUserRolesIT() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<UserRolesIT, "id">>;
    }) => UserRolesITService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["userRolesIT-list"] });
      client.invalidateQueries({ queryKey: ["userRolesIT", variables.id] });
    },
  });
}

/**
 * Delete a UserRolesIT record by its unique identifier.
 */
export function useDeleteUserRolesIT() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => UserRolesITService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["userRolesIT-list"] });
      client.invalidateQueries({ queryKey: ["userRolesIT", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const UserRolesIT_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { UserRolesITSchema, CreateUserRolesITSchema, UpdateUserRolesITSchema } from "../validators/user-roles-it-validator";
export type { UserRolesITInput, CreateUserRolesITInput, UpdateUserRolesITInput } from "../validators/user-roles-it-validator";
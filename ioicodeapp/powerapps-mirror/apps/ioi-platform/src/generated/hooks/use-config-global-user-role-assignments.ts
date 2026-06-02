import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ConfigGlobalUserRoleAssignmentsService } from "../services/config-global-user-role-assignments-service";
import type { ConfigGlobalUserRoleAssignments } from "../models/config-global-user-role-assignments-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ConfigGlobalUserRoleAssignments records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, assignmentScopeKey, departmentScope, isActive, moduleScope, notes, roleKey, userPrincipalName
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useConfigGlobalUserRoleAssignmentsList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["configGlobalUserRoleAssignments-list", options],
    queryFn: () => ConfigGlobalUserRoleAssignmentsService.getAll(options),
  });
}

/**
 * Retrieve a single ConfigGlobalUserRoleAssignments record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useConfigGlobalUserRoleAssignments(id: string) {
  return useQuery({
    queryKey: ["configGlobalUserRoleAssignments", id],
    queryFn: () => ConfigGlobalUserRoleAssignmentsService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ConfigGlobalUserRoleAssignments record.
 * @remarks Form validation: use CreateConfigGlobalUserRoleAssignmentsSchema with zodResolver for type-safe create forms
 */
export function useCreateConfigGlobalUserRoleAssignments() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ConfigGlobalUserRoleAssignments, "id">) => ConfigGlobalUserRoleAssignmentsService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["configGlobalUserRoleAssignments-list"] });
    },
  });
}

/**
 * Update an existing ConfigGlobalUserRoleAssignments record.
 * @remarks Form validation: use UpdateConfigGlobalUserRoleAssignmentsSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateConfigGlobalUserRoleAssignments() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ConfigGlobalUserRoleAssignments, "id">>;
    }) => ConfigGlobalUserRoleAssignmentsService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["configGlobalUserRoleAssignments-list"] });
      client.invalidateQueries({ queryKey: ["configGlobalUserRoleAssignments", variables.id] });
    },
  });
}

/**
 * Delete a ConfigGlobalUserRoleAssignments record by its unique identifier.
 */
export function useDeleteConfigGlobalUserRoleAssignments() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ConfigGlobalUserRoleAssignmentsService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["configGlobalUserRoleAssignments-list"] });
      client.invalidateQueries({ queryKey: ["configGlobalUserRoleAssignments", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ConfigGlobalUserRoleAssignments_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ConfigGlobalUserRoleAssignmentsSchema, CreateConfigGlobalUserRoleAssignmentsSchema, UpdateConfigGlobalUserRoleAssignmentsSchema } from "../validators/config-global-user-role-assignments-validator";
export type { ConfigGlobalUserRoleAssignmentsInput, CreateConfigGlobalUserRoleAssignmentsInput, UpdateConfigGlobalUserRoleAssignmentsInput } from "../validators/config-global-user-role-assignments-validator";
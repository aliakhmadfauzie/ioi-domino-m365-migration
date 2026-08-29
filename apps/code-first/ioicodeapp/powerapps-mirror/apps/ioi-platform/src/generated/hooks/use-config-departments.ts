import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ConfigDepartmentsService } from "../services/config-departments-service";
import type { ConfigDepartments } from "../models/config-departments-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ConfigDepartments records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, category, configKey, configValue, description
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useConfigDepartmentsList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["configDepartments-list", options],
    queryFn: () => ConfigDepartmentsService.getAll(options),
  });
}

/**
 * Retrieve a single ConfigDepartments record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useConfigDepartments(id: string) {
  return useQuery({
    queryKey: ["configDepartments", id],
    queryFn: () => ConfigDepartmentsService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ConfigDepartments record.
 * @remarks Form validation: use CreateConfigDepartmentsSchema with zodResolver for type-safe create forms
 */
export function useCreateConfigDepartments() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ConfigDepartments, "id">) => ConfigDepartmentsService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["configDepartments-list"] });
    },
  });
}

/**
 * Update an existing ConfigDepartments record.
 * @remarks Form validation: use UpdateConfigDepartmentsSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateConfigDepartments() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ConfigDepartments, "id">>;
    }) => ConfigDepartmentsService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["configDepartments-list"] });
      client.invalidateQueries({ queryKey: ["configDepartments", variables.id] });
    },
  });
}

/**
 * Delete a ConfigDepartments record by its unique identifier.
 */
export function useDeleteConfigDepartments() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ConfigDepartmentsService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["configDepartments-list"] });
      client.invalidateQueries({ queryKey: ["configDepartments", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ConfigDepartments_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ConfigDepartmentsSchema, CreateConfigDepartmentsSchema, UpdateConfigDepartmentsSchema } from "../validators/config-departments-validator";
export type { ConfigDepartmentsInput, CreateConfigDepartmentsInput, UpdateConfigDepartmentsInput } from "../validators/config-departments-validator";
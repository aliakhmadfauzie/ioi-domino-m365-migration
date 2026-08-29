import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ConfigEmployeeDirectoryService } from "../services/config-employee-directory-service";
import type { ConfigEmployeeDirectory } from "../models/config-employee-directory-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ConfigEmployeeDirectory records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, category, configKey, configValue, description
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useConfigEmployeeDirectoryList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["configEmployeeDirectory-list", options],
    queryFn: () => ConfigEmployeeDirectoryService.getAll(options),
  });
}

/**
 * Retrieve a single ConfigEmployeeDirectory record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useConfigEmployeeDirectory(id: string) {
  return useQuery({
    queryKey: ["configEmployeeDirectory", id],
    queryFn: () => ConfigEmployeeDirectoryService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ConfigEmployeeDirectory record.
 * @remarks Form validation: use CreateConfigEmployeeDirectorySchema with zodResolver for type-safe create forms
 */
export function useCreateConfigEmployeeDirectory() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ConfigEmployeeDirectory, "id">) => ConfigEmployeeDirectoryService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["configEmployeeDirectory-list"] });
    },
  });
}

/**
 * Update an existing ConfigEmployeeDirectory record.
 * @remarks Form validation: use UpdateConfigEmployeeDirectorySchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateConfigEmployeeDirectory() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ConfigEmployeeDirectory, "id">>;
    }) => ConfigEmployeeDirectoryService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["configEmployeeDirectory-list"] });
      client.invalidateQueries({ queryKey: ["configEmployeeDirectory", variables.id] });
    },
  });
}

/**
 * Delete a ConfigEmployeeDirectory record by its unique identifier.
 */
export function useDeleteConfigEmployeeDirectory() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ConfigEmployeeDirectoryService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["configEmployeeDirectory-list"] });
      client.invalidateQueries({ queryKey: ["configEmployeeDirectory", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ConfigEmployeeDirectory_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ConfigEmployeeDirectorySchema, CreateConfigEmployeeDirectorySchema, UpdateConfigEmployeeDirectorySchema } from "../validators/config-employee-directory-validator";
export type { ConfigEmployeeDirectoryInput, CreateConfigEmployeeDirectoryInput, UpdateConfigEmployeeDirectoryInput } from "../validators/config-employee-directory-validator";
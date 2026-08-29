import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ConfigApproverMatrixService } from "../services/config-approver-matrix-service";
import type { ConfigApproverMatrix } from "../models/config-approver-matrix-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ConfigApproverMatrix records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, category, configKey, configValue, description
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useConfigApproverMatrixList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["configApproverMatrix-list", options],
    queryFn: () => ConfigApproverMatrixService.getAll(options),
  });
}

/**
 * Retrieve a single ConfigApproverMatrix record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useConfigApproverMatrix(id: string) {
  return useQuery({
    queryKey: ["configApproverMatrix", id],
    queryFn: () => ConfigApproverMatrixService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ConfigApproverMatrix record.
 * @remarks Form validation: use CreateConfigApproverMatrixSchema with zodResolver for type-safe create forms
 */
export function useCreateConfigApproverMatrix() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ConfigApproverMatrix, "id">) => ConfigApproverMatrixService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["configApproverMatrix-list"] });
    },
  });
}

/**
 * Update an existing ConfigApproverMatrix record.
 * @remarks Form validation: use UpdateConfigApproverMatrixSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateConfigApproverMatrix() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ConfigApproverMatrix, "id">>;
    }) => ConfigApproverMatrixService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["configApproverMatrix-list"] });
      client.invalidateQueries({ queryKey: ["configApproverMatrix", variables.id] });
    },
  });
}

/**
 * Delete a ConfigApproverMatrix record by its unique identifier.
 */
export function useDeleteConfigApproverMatrix() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ConfigApproverMatrixService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["configApproverMatrix-list"] });
      client.invalidateQueries({ queryKey: ["configApproverMatrix", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ConfigApproverMatrix_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ConfigApproverMatrixSchema, CreateConfigApproverMatrixSchema, UpdateConfigApproverMatrixSchema } from "../validators/config-approver-matrix-validator";
export type { ConfigApproverMatrixInput, CreateConfigApproverMatrixInput, UpdateConfigApproverMatrixInput } from "../validators/config-approver-matrix-validator";
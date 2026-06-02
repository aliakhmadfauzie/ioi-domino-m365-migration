import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ConfigCompaniesService } from "../services/config-companies-service";
import type { ConfigCompanies } from "../models/config-companies-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ConfigCompanies records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, category, configKey, configValue, description
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useConfigCompaniesList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["configCompanies-list", options],
    queryFn: () => ConfigCompaniesService.getAll(options),
  });
}

/**
 * Retrieve a single ConfigCompanies record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useConfigCompanies(id: string) {
  return useQuery({
    queryKey: ["configCompanies", id],
    queryFn: () => ConfigCompaniesService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ConfigCompanies record.
 * @remarks Form validation: use CreateConfigCompaniesSchema with zodResolver for type-safe create forms
 */
export function useCreateConfigCompanies() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ConfigCompanies, "id">) => ConfigCompaniesService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["configCompanies-list"] });
    },
  });
}

/**
 * Update an existing ConfigCompanies record.
 * @remarks Form validation: use UpdateConfigCompaniesSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateConfigCompanies() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ConfigCompanies, "id">>;
    }) => ConfigCompaniesService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["configCompanies-list"] });
      client.invalidateQueries({ queryKey: ["configCompanies", variables.id] });
    },
  });
}

/**
 * Delete a ConfigCompanies record by its unique identifier.
 */
export function useDeleteConfigCompanies() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ConfigCompaniesService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["configCompanies-list"] });
      client.invalidateQueries({ queryKey: ["configCompanies", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ConfigCompanies_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ConfigCompaniesSchema, CreateConfigCompaniesSchema, UpdateConfigCompaniesSchema } from "../validators/config-companies-validator";
export type { ConfigCompaniesInput, CreateConfigCompaniesInput, UpdateConfigCompaniesInput } from "../validators/config-companies-validator";
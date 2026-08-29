import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ConfigNotesAdminRoutingService } from "../services/config-notes-admin-routing-service";
import type { ConfigNotesAdminRouting } from "../models/config-notes-admin-routing-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ConfigNotesAdminRouting records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, category, configKey, configValue, description
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useConfigNotesAdminRoutingList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["configNotesAdminRouting-list", options],
    queryFn: () => ConfigNotesAdminRoutingService.getAll(options),
  });
}

/**
 * Retrieve a single ConfigNotesAdminRouting record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useConfigNotesAdminRouting(id: string) {
  return useQuery({
    queryKey: ["configNotesAdminRouting", id],
    queryFn: () => ConfigNotesAdminRoutingService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ConfigNotesAdminRouting record.
 * @remarks Form validation: use CreateConfigNotesAdminRoutingSchema with zodResolver for type-safe create forms
 */
export function useCreateConfigNotesAdminRouting() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ConfigNotesAdminRouting, "id">) => ConfigNotesAdminRoutingService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["configNotesAdminRouting-list"] });
    },
  });
}

/**
 * Update an existing ConfigNotesAdminRouting record.
 * @remarks Form validation: use UpdateConfigNotesAdminRoutingSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateConfigNotesAdminRouting() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ConfigNotesAdminRouting, "id">>;
    }) => ConfigNotesAdminRoutingService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["configNotesAdminRouting-list"] });
      client.invalidateQueries({ queryKey: ["configNotesAdminRouting", variables.id] });
    },
  });
}

/**
 * Delete a ConfigNotesAdminRouting record by its unique identifier.
 */
export function useDeleteConfigNotesAdminRouting() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ConfigNotesAdminRoutingService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["configNotesAdminRouting-list"] });
      client.invalidateQueries({ queryKey: ["configNotesAdminRouting", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ConfigNotesAdminRouting_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ConfigNotesAdminRoutingSchema, CreateConfigNotesAdminRoutingSchema, UpdateConfigNotesAdminRoutingSchema } from "../validators/config-notes-admin-routing-validator";
export type { ConfigNotesAdminRoutingInput, CreateConfigNotesAdminRoutingInput, UpdateConfigNotesAdminRoutingInput } from "../validators/config-notes-admin-routing-validator";
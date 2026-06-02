import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ITM1SFARServersService } from "../services/itm1sfar-servers-service";
import type { ITM1SFARServers } from "../models/itm1sfar-servers-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ITM1SFARServers records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useITM1SFARServersList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["iTM1SFARServers-list", options],
    queryFn: () => ITM1SFARServersService.getAll(options),
  });
}

/**
 * Retrieve a single ITM1SFARServers record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useITM1SFARServers(id: string) {
  return useQuery({
    queryKey: ["iTM1SFARServers", id],
    queryFn: () => ITM1SFARServersService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ITM1SFARServers record.
 * @remarks Form validation: use CreateITM1SFARServersSchema with zodResolver for type-safe create forms
 */
export function useCreateITM1SFARServers() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ITM1SFARServers, "id">) => ITM1SFARServersService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["iTM1SFARServers-list"] });
    },
  });
}

/**
 * Update an existing ITM1SFARServers record.
 * @remarks Form validation: use UpdateITM1SFARServersSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateITM1SFARServers() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ITM1SFARServers, "id">>;
    }) => ITM1SFARServersService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["iTM1SFARServers-list"] });
      client.invalidateQueries({ queryKey: ["iTM1SFARServers", variables.id] });
    },
  });
}

/**
 * Delete a ITM1SFARServers record by its unique identifier.
 */
export function useDeleteITM1SFARServers() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ITM1SFARServersService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["iTM1SFARServers-list"] });
      client.invalidateQueries({ queryKey: ["iTM1SFARServers", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ITM1SFARServers_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ITM1SFARServersSchema, CreateITM1SFARServersSchema, UpdateITM1SFARServersSchema } from "../validators/itm1sfarservers-validator";
export type { ITM1SFARServersInput, CreateITM1SFARServersInput, UpdateITM1SFARServersInput } from "../validators/itm1sfarservers-validator";
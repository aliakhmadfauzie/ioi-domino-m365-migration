import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ITM1RSSystemsListService } from "../services/itm1rs-systems-list-service";
import type { ITM1RSSystemsList } from "../models/itm1rs-systems-list-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ITM1RSSystemsList records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useITM1RSSystemsListList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["iTM1RSSystemsList-list", options],
    queryFn: () => ITM1RSSystemsListService.getAll(options),
  });
}

/**
 * Retrieve a single ITM1RSSystemsList record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useITM1RSSystemsList(id: string) {
  return useQuery({
    queryKey: ["iTM1RSSystemsList", id],
    queryFn: () => ITM1RSSystemsListService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ITM1RSSystemsList record.
 * @remarks Form validation: use CreateITM1RSSystemsListSchema with zodResolver for type-safe create forms
 */
export function useCreateITM1RSSystemsList() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ITM1RSSystemsList, "id">) => ITM1RSSystemsListService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["iTM1RSSystemsList-list"] });
    },
  });
}

/**
 * Update an existing ITM1RSSystemsList record.
 * @remarks Form validation: use UpdateITM1RSSystemsListSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateITM1RSSystemsList() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ITM1RSSystemsList, "id">>;
    }) => ITM1RSSystemsListService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["iTM1RSSystemsList-list"] });
      client.invalidateQueries({ queryKey: ["iTM1RSSystemsList", variables.id] });
    },
  });
}

/**
 * Delete a ITM1RSSystemsList record by its unique identifier.
 */
export function useDeleteITM1RSSystemsList() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ITM1RSSystemsListService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["iTM1RSSystemsList-list"] });
      client.invalidateQueries({ queryKey: ["iTM1RSSystemsList", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ITM1RSSystemsList_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ITM1RSSystemsListSchema, CreateITM1RSSystemsListSchema, UpdateITM1RSSystemsListSchema } from "../validators/itm1rssystems-list-validator";
export type { ITM1RSSystemsListInput, CreateITM1RSSystemsListInput, UpdateITM1RSSystemsListInput } from "../validators/itm1rssystems-list-validator";
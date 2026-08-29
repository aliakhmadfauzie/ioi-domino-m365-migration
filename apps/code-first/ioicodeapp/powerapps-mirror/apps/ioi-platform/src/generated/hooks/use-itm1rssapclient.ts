import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ITM1RSSAPClientService } from "../services/itm1rssap-client-service";
import type { ITM1RSSAPClient } from "../models/itm1rssap-client-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ITM1RSSAPClient records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useITM1RSSAPClientList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["iTM1RSSAPClient-list", options],
    queryFn: () => ITM1RSSAPClientService.getAll(options),
  });
}

/**
 * Retrieve a single ITM1RSSAPClient record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useITM1RSSAPClient(id: string) {
  return useQuery({
    queryKey: ["iTM1RSSAPClient", id],
    queryFn: () => ITM1RSSAPClientService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ITM1RSSAPClient record.
 * @remarks Form validation: use CreateITM1RSSAPClientSchema with zodResolver for type-safe create forms
 */
export function useCreateITM1RSSAPClient() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ITM1RSSAPClient, "id">) => ITM1RSSAPClientService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["iTM1RSSAPClient-list"] });
    },
  });
}

/**
 * Update an existing ITM1RSSAPClient record.
 * @remarks Form validation: use UpdateITM1RSSAPClientSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateITM1RSSAPClient() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ITM1RSSAPClient, "id">>;
    }) => ITM1RSSAPClientService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["iTM1RSSAPClient-list"] });
      client.invalidateQueries({ queryKey: ["iTM1RSSAPClient", variables.id] });
    },
  });
}

/**
 * Delete a ITM1RSSAPClient record by its unique identifier.
 */
export function useDeleteITM1RSSAPClient() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ITM1RSSAPClientService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["iTM1RSSAPClient-list"] });
      client.invalidateQueries({ queryKey: ["iTM1RSSAPClient", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ITM1RSSAPClient_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ITM1RSSAPClientSchema, CreateITM1RSSAPClientSchema, UpdateITM1RSSAPClientSchema } from "../validators/itm1rssapclient-validator";
export type { ITM1RSSAPClientInput, CreateITM1RSSAPClientInput, UpdateITM1RSSAPClientInput } from "../validators/itm1rssapclient-validator";
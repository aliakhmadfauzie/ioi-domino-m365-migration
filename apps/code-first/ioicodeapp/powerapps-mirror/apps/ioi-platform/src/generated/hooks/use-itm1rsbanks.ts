import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ITM1RSBanksService } from "../services/itm1rs-banks-service";
import type { ITM1RSBanks } from "../models/itm1rs-banks-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ITM1RSBanks records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useITM1RSBanksList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["iTM1RSBanks-list", options],
    queryFn: () => ITM1RSBanksService.getAll(options),
  });
}

/**
 * Retrieve a single ITM1RSBanks record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useITM1RSBanks(id: string) {
  return useQuery({
    queryKey: ["iTM1RSBanks", id],
    queryFn: () => ITM1RSBanksService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ITM1RSBanks record.
 * @remarks Form validation: use CreateITM1RSBanksSchema with zodResolver for type-safe create forms
 */
export function useCreateITM1RSBanks() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ITM1RSBanks, "id">) => ITM1RSBanksService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["iTM1RSBanks-list"] });
    },
  });
}

/**
 * Update an existing ITM1RSBanks record.
 * @remarks Form validation: use UpdateITM1RSBanksSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateITM1RSBanks() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ITM1RSBanks, "id">>;
    }) => ITM1RSBanksService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["iTM1RSBanks-list"] });
      client.invalidateQueries({ queryKey: ["iTM1RSBanks", variables.id] });
    },
  });
}

/**
 * Delete a ITM1RSBanks record by its unique identifier.
 */
export function useDeleteITM1RSBanks() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ITM1RSBanksService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["iTM1RSBanks-list"] });
      client.invalidateQueries({ queryKey: ["iTM1RSBanks", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ITM1RSBanks_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ITM1RSBanksSchema, CreateITM1RSBanksSchema, UpdateITM1RSBanksSchema } from "../validators/itm1rsbanks-validator";
export type { ITM1RSBanksInput, CreateITM1RSBanksInput, UpdateITM1RSBanksInput } from "../validators/itm1rsbanks-validator";
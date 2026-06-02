import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LineItemsSTRService } from "../services/line-items-str-service";
import type { LineItemsSTR } from "../models/line-items-str-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all LineItemsSTR records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, appName, headerID, itemDescription, lineItemID, quantity, remarks, siteKey, totalCost, unitCost
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useLineItemsSTRList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["lineItemsSTR-list", options],
    queryFn: () => LineItemsSTRService.getAll(options),
  });
}

/**
 * Retrieve a single LineItemsSTR record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useLineItemsSTR(id: string) {
  return useQuery({
    queryKey: ["lineItemsSTR", id],
    queryFn: () => LineItemsSTRService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new LineItemsSTR record.
 * @remarks Form validation: use CreateLineItemsSTRSchema with zodResolver for type-safe create forms
 */
export function useCreateLineItemsSTR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<LineItemsSTR, "id">) => LineItemsSTRService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["lineItemsSTR-list"] });
    },
  });
}

/**
 * Update an existing LineItemsSTR record.
 * @remarks Form validation: use UpdateLineItemsSTRSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateLineItemsSTR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<LineItemsSTR, "id">>;
    }) => LineItemsSTRService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["lineItemsSTR-list"] });
      client.invalidateQueries({ queryKey: ["lineItemsSTR", variables.id] });
    },
  });
}

/**
 * Delete a LineItemsSTR record by its unique identifier.
 */
export function useDeleteLineItemsSTR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => LineItemsSTRService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["lineItemsSTR-list"] });
      client.invalidateQueries({ queryKey: ["lineItemsSTR", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const LineItemsSTR_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { LineItemsSTRSchema, CreateLineItemsSTRSchema, UpdateLineItemsSTRSchema } from "../validators/line-items-str-validator";
export type { LineItemsSTRInput, CreateLineItemsSTRInput, UpdateLineItemsSTRInput } from "../validators/line-items-str-validator";
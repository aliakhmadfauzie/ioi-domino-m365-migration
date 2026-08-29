import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QAActionItemsService } from "../services/qa-action-items-service";
import type { QAActionItems } from "../models/qa-action-items-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all QAActionItems records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, actionItem, actionRowID, actionTypeKey, dueDate, owner, statusKey
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useQAActionItemsList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["qAActionItems-list", options],
    queryFn: () => QAActionItemsService.getAll(options),
  });
}

/**
 * Retrieve a single QAActionItems record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useQAActionItems(id: string) {
  return useQuery({
    queryKey: ["qAActionItems", id],
    queryFn: () => QAActionItemsService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new QAActionItems record.
 * @remarks Form validation: use CreateQAActionItemsSchema with zodResolver for type-safe create forms
 */
export function useCreateQAActionItems() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<QAActionItems, "id">) => QAActionItemsService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["qAActionItems-list"] });
    },
  });
}

/**
 * Update an existing QAActionItems record.
 * @remarks Form validation: use UpdateQAActionItemsSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateQAActionItems() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<QAActionItems, "id">>;
    }) => QAActionItemsService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["qAActionItems-list"] });
      client.invalidateQueries({ queryKey: ["qAActionItems", variables.id] });
    },
  });
}

/**
 * Delete a QAActionItems record by its unique identifier.
 */
export function useDeleteQAActionItems() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => QAActionItemsService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["qAActionItems-list"] });
      client.invalidateQueries({ queryKey: ["qAActionItems", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const QAActionItems_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { QAActionItemsSchema, CreateQAActionItemsSchema, UpdateQAActionItemsSchema } from "../validators/qaaction-items-validator";
export type { QAActionItemsInput, CreateQAActionItemsInput, UpdateQAActionItemsInput } from "../validators/qaaction-items-validator";
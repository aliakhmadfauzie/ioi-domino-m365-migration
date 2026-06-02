import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QASubActionItemsService } from "../services/qa-sub-action-items-service";
import type { QASubActionItems } from "../models/qa-sub-action-items-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all QASubActionItems records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, subActionRowNo, subTaskDescription, verificationStatusKey, verifiedBy, verifiedDate
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useQASubActionItemsList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["qASubActionItems-list", options],
    queryFn: () => QASubActionItemsService.getAll(options),
  });
}

/**
 * Retrieve a single QASubActionItems record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useQASubActionItems(id: string) {
  return useQuery({
    queryKey: ["qASubActionItems", id],
    queryFn: () => QASubActionItemsService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new QASubActionItems record.
 * @remarks Form validation: use CreateQASubActionItemsSchema with zodResolver for type-safe create forms
 */
export function useCreateQASubActionItems() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<QASubActionItems, "id">) => QASubActionItemsService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["qASubActionItems-list"] });
    },
  });
}

/**
 * Update an existing QASubActionItems record.
 * @remarks Form validation: use UpdateQASubActionItemsSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateQASubActionItems() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<QASubActionItems, "id">>;
    }) => QASubActionItemsService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["qASubActionItems-list"] });
      client.invalidateQueries({ queryKey: ["qASubActionItems", variables.id] });
    },
  });
}

/**
 * Delete a QASubActionItems record by its unique identifier.
 */
export function useDeleteQASubActionItems() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => QASubActionItemsService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["qASubActionItems-list"] });
      client.invalidateQueries({ queryKey: ["qASubActionItems", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const QASubActionItems_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { QASubActionItemsSchema, CreateQASubActionItemsSchema, UpdateQASubActionItemsSchema } from "../validators/qasub-action-items-validator";
export type { QASubActionItemsInput, CreateQASubActionItemsInput, UpdateQASubActionItemsInput } from "../validators/qasub-action-items-validator";
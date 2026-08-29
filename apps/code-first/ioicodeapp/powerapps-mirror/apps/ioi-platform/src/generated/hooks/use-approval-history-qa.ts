import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApprovalHistoryQAService } from "../services/approval-history-qa-service";
import type { ApprovalHistoryQA } from "../models/approval-history-qa-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ApprovalHistoryQA records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, actionByEmail, actionByName, actionCode, actionComment, actionOn, appName, fromState, historyID, parentID, recordID, siteKey, toState
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useApprovalHistoryQAList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["approvalHistoryQA-list", options],
    queryFn: () => ApprovalHistoryQAService.getAll(options),
  });
}

/**
 * Retrieve a single ApprovalHistoryQA record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useApprovalHistoryQA(id: string) {
  return useQuery({
    queryKey: ["approvalHistoryQA", id],
    queryFn: () => ApprovalHistoryQAService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ApprovalHistoryQA record.
 * @remarks Form validation: use CreateApprovalHistoryQASchema with zodResolver for type-safe create forms
 */
export function useCreateApprovalHistoryQA() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ApprovalHistoryQA, "id">) => ApprovalHistoryQAService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["approvalHistoryQA-list"] });
    },
  });
}

/**
 * Update an existing ApprovalHistoryQA record.
 * @remarks Form validation: use UpdateApprovalHistoryQASchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateApprovalHistoryQA() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ApprovalHistoryQA, "id">>;
    }) => ApprovalHistoryQAService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["approvalHistoryQA-list"] });
      client.invalidateQueries({ queryKey: ["approvalHistoryQA", variables.id] });
    },
  });
}

/**
 * Delete a ApprovalHistoryQA record by its unique identifier.
 */
export function useDeleteApprovalHistoryQA() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ApprovalHistoryQAService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["approvalHistoryQA-list"] });
      client.invalidateQueries({ queryKey: ["approvalHistoryQA", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ApprovalHistoryQA_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ApprovalHistoryQASchema, CreateApprovalHistoryQASchema, UpdateApprovalHistoryQASchema } from "../validators/approval-history-qa-validator";
export type { ApprovalHistoryQAInput, CreateApprovalHistoryQAInput, UpdateApprovalHistoryQAInput } from "../validators/approval-history-qa-validator";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApprovalHistorySTRService } from "../services/approval-history-str-service";
import type { ApprovalHistorySTR } from "../models/approval-history-str-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ApprovalHistorySTR records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, actionByEmail, actionByName, actionCode, actionComment, actionOn, appName, fromState, historyID, parentID, recordID, siteKey, toState
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useApprovalHistorySTRList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["approvalHistorySTR-list", options],
    queryFn: () => ApprovalHistorySTRService.getAll(options),
  });
}

/**
 * Retrieve a single ApprovalHistorySTR record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useApprovalHistorySTR(id: string) {
  return useQuery({
    queryKey: ["approvalHistorySTR", id],
    queryFn: () => ApprovalHistorySTRService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ApprovalHistorySTR record.
 * @remarks Form validation: use CreateApprovalHistorySTRSchema with zodResolver for type-safe create forms
 */
export function useCreateApprovalHistorySTR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ApprovalHistorySTR, "id">) => ApprovalHistorySTRService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["approvalHistorySTR-list"] });
    },
  });
}

/**
 * Update an existing ApprovalHistorySTR record.
 * @remarks Form validation: use UpdateApprovalHistorySTRSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateApprovalHistorySTR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ApprovalHistorySTR, "id">>;
    }) => ApprovalHistorySTRService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["approvalHistorySTR-list"] });
      client.invalidateQueries({ queryKey: ["approvalHistorySTR", variables.id] });
    },
  });
}

/**
 * Delete a ApprovalHistorySTR record by its unique identifier.
 */
export function useDeleteApprovalHistorySTR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ApprovalHistorySTRService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["approvalHistorySTR-list"] });
      client.invalidateQueries({ queryKey: ["approvalHistorySTR", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ApprovalHistorySTR_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ApprovalHistorySTRSchema, CreateApprovalHistorySTRSchema, UpdateApprovalHistorySTRSchema } from "../validators/approval-history-str-validator";
export type { ApprovalHistorySTRInput, CreateApprovalHistorySTRInput, UpdateApprovalHistorySTRInput } from "../validators/approval-history-str-validator";
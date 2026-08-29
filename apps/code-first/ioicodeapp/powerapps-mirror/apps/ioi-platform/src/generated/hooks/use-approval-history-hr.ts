import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApprovalHistoryHRService } from "../services/approval-history-hr-service";
import type { ApprovalHistoryHR } from "../models/approval-history-hr-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ApprovalHistoryHR records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, actionbyemail, actionbyname, actioncode, actioncomment, actionon, appname, fromstate, historyid, parentid, recordid, siteKey, tostate
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useApprovalHistoryHRList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["approvalHistoryHR-list", options],
    queryFn: () => ApprovalHistoryHRService.getAll(options),
  });
}

/**
 * Retrieve a single ApprovalHistoryHR record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useApprovalHistoryHR(id: string) {
  return useQuery({
    queryKey: ["approvalHistoryHR", id],
    queryFn: () => ApprovalHistoryHRService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ApprovalHistoryHR record.
 * @remarks Form validation: use CreateApprovalHistoryHRSchema with zodResolver for type-safe create forms
 */
export function useCreateApprovalHistoryHR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ApprovalHistoryHR, "id">) => ApprovalHistoryHRService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["approvalHistoryHR-list"] });
    },
  });
}

/**
 * Update an existing ApprovalHistoryHR record.
 * @remarks Form validation: use UpdateApprovalHistoryHRSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateApprovalHistoryHR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ApprovalHistoryHR, "id">>;
    }) => ApprovalHistoryHRService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["approvalHistoryHR-list"] });
      client.invalidateQueries({ queryKey: ["approvalHistoryHR", variables.id] });
    },
  });
}

/**
 * Delete a ApprovalHistoryHR record by its unique identifier.
 */
export function useDeleteApprovalHistoryHR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ApprovalHistoryHRService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["approvalHistoryHR-list"] });
      client.invalidateQueries({ queryKey: ["approvalHistoryHR", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ApprovalHistoryHR_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ApprovalHistoryHRSchema, CreateApprovalHistoryHRSchema, UpdateApprovalHistoryHRSchema } from "../validators/approval-history-hr-validator";
export type { ApprovalHistoryHRInput, CreateApprovalHistoryHRInput, UpdateApprovalHistoryHRInput } from "../validators/approval-history-hr-validator";
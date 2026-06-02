import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApprovalHistorySHEService } from "../services/approval-history-she-service";
import type { ApprovalHistorySHE } from "../models/approval-history-she-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ApprovalHistorySHE records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, actionByEmail, actionCode, actionComment, actionOn, appName, fromState, historyID, parentID, recordID, toState
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useApprovalHistorySHEList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["approvalHistorySHE-list", options],
    queryFn: () => ApprovalHistorySHEService.getAll(options),
  });
}

/**
 * Retrieve a single ApprovalHistorySHE record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useApprovalHistorySHE(id: string) {
  return useQuery({
    queryKey: ["approvalHistorySHE", id],
    queryFn: () => ApprovalHistorySHEService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ApprovalHistorySHE record.
 * @remarks Form validation: use CreateApprovalHistorySHESchema with zodResolver for type-safe create forms
 */
export function useCreateApprovalHistorySHE() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ApprovalHistorySHE, "id">) => ApprovalHistorySHEService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["approvalHistorySHE-list"] });
    },
  });
}

/**
 * Update an existing ApprovalHistorySHE record.
 * @remarks Form validation: use UpdateApprovalHistorySHESchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateApprovalHistorySHE() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ApprovalHistorySHE, "id">>;
    }) => ApprovalHistorySHEService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["approvalHistorySHE-list"] });
      client.invalidateQueries({ queryKey: ["approvalHistorySHE", variables.id] });
    },
  });
}

/**
 * Delete a ApprovalHistorySHE record by its unique identifier.
 */
export function useDeleteApprovalHistorySHE() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ApprovalHistorySHEService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["approvalHistorySHE-list"] });
      client.invalidateQueries({ queryKey: ["approvalHistorySHE", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ApprovalHistorySHE_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ApprovalHistorySHESchema, CreateApprovalHistorySHESchema, UpdateApprovalHistorySHESchema } from "../validators/approval-history-she-validator";
export type { ApprovalHistorySHEInput, CreateApprovalHistorySHEInput, UpdateApprovalHistorySHEInput } from "../validators/approval-history-she-validator";
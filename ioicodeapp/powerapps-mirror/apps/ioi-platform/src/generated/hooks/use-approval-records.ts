import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApprovalRecordsService } from "../services/approval-records-service";
import type { ApprovalRecords } from "../models/approval-records-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ApprovalRecords records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, stagename, actionbyid, actionbyname, actiondate, actionKey, comments, formcode, formid, nextstage, stagenumber
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useApprovalRecordsList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["approvalRecords-list", options],
    queryFn: () => ApprovalRecordsService.getAll(options),
  });
}

/**
 * Retrieve a single ApprovalRecords record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useApprovalRecords(id: string) {
  return useQuery({
    queryKey: ["approvalRecords", id],
    queryFn: () => ApprovalRecordsService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ApprovalRecords record.
 * @remarks Form validation: use CreateApprovalRecordsSchema with zodResolver for type-safe create forms
 */
export function useCreateApprovalRecords() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ApprovalRecords, "id">) => ApprovalRecordsService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["approvalRecords-list"] });
    },
  });
}

/**
 * Update an existing ApprovalRecords record.
 * @remarks Form validation: use UpdateApprovalRecordsSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateApprovalRecords() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ApprovalRecords, "id">>;
    }) => ApprovalRecordsService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["approvalRecords-list"] });
      client.invalidateQueries({ queryKey: ["approvalRecords", variables.id] });
    },
  });
}

/**
 * Delete a ApprovalRecords record by its unique identifier.
 */
export function useDeleteApprovalRecords() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ApprovalRecordsService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["approvalRecords-list"] });
      client.invalidateQueries({ queryKey: ["approvalRecords", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ApprovalRecords_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ApprovalRecordsSchema, CreateApprovalRecordsSchema, UpdateApprovalRecordsSchema } from "../validators/approval-records-validator";
export type { ApprovalRecordsInput, CreateApprovalRecordsInput, UpdateApprovalRecordsInput } from "../validators/approval-records-validator";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QAHACCPReviewRecordService } from "../services/qahaccp-review-record-service";
import type { QAHACCPReviewRecord } from "../models/qahaccp-review-record-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all QAHACCPReviewRecord records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, designation, parentHACCPID, reviewDate, reviewerName, reviewNo
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useQAHACCPReviewRecordList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["qAHACCPReviewRecord-list", options],
    queryFn: () => QAHACCPReviewRecordService.getAll(options),
  });
}

/**
 * Retrieve a single QAHACCPReviewRecord record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useQAHACCPReviewRecord(id: string) {
  return useQuery({
    queryKey: ["qAHACCPReviewRecord", id],
    queryFn: () => QAHACCPReviewRecordService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new QAHACCPReviewRecord record.
 * @remarks Form validation: use CreateQAHACCPReviewRecordSchema with zodResolver for type-safe create forms
 */
export function useCreateQAHACCPReviewRecord() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<QAHACCPReviewRecord, "id">) => QAHACCPReviewRecordService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["qAHACCPReviewRecord-list"] });
    },
  });
}

/**
 * Update an existing QAHACCPReviewRecord record.
 * @remarks Form validation: use UpdateQAHACCPReviewRecordSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateQAHACCPReviewRecord() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<QAHACCPReviewRecord, "id">>;
    }) => QAHACCPReviewRecordService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["qAHACCPReviewRecord-list"] });
      client.invalidateQueries({ queryKey: ["qAHACCPReviewRecord", variables.id] });
    },
  });
}

/**
 * Delete a QAHACCPReviewRecord record by its unique identifier.
 */
export function useDeleteQAHACCPReviewRecord() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => QAHACCPReviewRecordService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["qAHACCPReviewRecord-list"] });
      client.invalidateQueries({ queryKey: ["qAHACCPReviewRecord", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const QAHACCPReviewRecord_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { QAHACCPReviewRecordSchema, CreateQAHACCPReviewRecordSchema, UpdateQAHACCPReviewRecordSchema } from "../validators/qahaccpreview-record-validator";
export type { QAHACCPReviewRecordInput, CreateQAHACCPReviewRecordInput, UpdateQAHACCPReviewRecordInput } from "../validators/qahaccpreview-record-validator";
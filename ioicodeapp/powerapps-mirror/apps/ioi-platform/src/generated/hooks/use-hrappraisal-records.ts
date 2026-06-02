import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HRAppraisalRecordsService } from "../services/hr-appraisal-records-service";
import type { HRAppraisalRecords } from "../models/hr-appraisal-records-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all HRAppraisalRecords records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, appraisalNo, cycleYear, employeeNo, rating, reviewerEmail, statusKey
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useHRAppraisalRecordsList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["hRAppraisalRecords-list", options],
    queryFn: () => HRAppraisalRecordsService.getAll(options),
  });
}

/**
 * Retrieve a single HRAppraisalRecords record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useHRAppraisalRecords(id: string) {
  return useQuery({
    queryKey: ["hRAppraisalRecords", id],
    queryFn: () => HRAppraisalRecordsService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new HRAppraisalRecords record.
 * @remarks Form validation: use CreateHRAppraisalRecordsSchema with zodResolver for type-safe create forms
 */
export function useCreateHRAppraisalRecords() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<HRAppraisalRecords, "id">) => HRAppraisalRecordsService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["hRAppraisalRecords-list"] });
    },
  });
}

/**
 * Update an existing HRAppraisalRecords record.
 * @remarks Form validation: use UpdateHRAppraisalRecordsSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateHRAppraisalRecords() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<HRAppraisalRecords, "id">>;
    }) => HRAppraisalRecordsService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["hRAppraisalRecords-list"] });
      client.invalidateQueries({ queryKey: ["hRAppraisalRecords", variables.id] });
    },
  });
}

/**
 * Delete a HRAppraisalRecords record by its unique identifier.
 */
export function useDeleteHRAppraisalRecords() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => HRAppraisalRecordsService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["hRAppraisalRecords-list"] });
      client.invalidateQueries({ queryKey: ["hRAppraisalRecords", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const HRAppraisalRecords_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { HRAppraisalRecordsSchema, CreateHRAppraisalRecordsSchema, UpdateHRAppraisalRecordsSchema } from "../validators/hrappraisal-records-validator";
export type { HRAppraisalRecordsInput, CreateHRAppraisalRecordsInput, UpdateHRAppraisalRecordsInput } from "../validators/hrappraisal-records-validator";
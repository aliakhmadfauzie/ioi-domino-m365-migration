import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OpsLogHRService } from "../services/ops-log-hr-service";
import type { OpsLogHR } from "../models/ops-log-hr-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all OpsLogHR records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, appName, flowError, payloadSummary, runID, siteKey, timestamp, userUPN
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useOpsLogHRList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["opsLogHR-list", options],
    queryFn: () => OpsLogHRService.getAll(options),
  });
}

/**
 * Retrieve a single OpsLogHR record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useOpsLogHR(id: string) {
  return useQuery({
    queryKey: ["opsLogHR", id],
    queryFn: () => OpsLogHRService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new OpsLogHR record.
 * @remarks Form validation: use CreateOpsLogHRSchema with zodResolver for type-safe create forms
 */
export function useCreateOpsLogHR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<OpsLogHR, "id">) => OpsLogHRService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["opsLogHR-list"] });
    },
  });
}

/**
 * Update an existing OpsLogHR record.
 * @remarks Form validation: use UpdateOpsLogHRSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateOpsLogHR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<OpsLogHR, "id">>;
    }) => OpsLogHRService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["opsLogHR-list"] });
      client.invalidateQueries({ queryKey: ["opsLogHR", variables.id] });
    },
  });
}

/**
 * Delete a OpsLogHR record by its unique identifier.
 */
export function useDeleteOpsLogHR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => OpsLogHRService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["opsLogHR-list"] });
      client.invalidateQueries({ queryKey: ["opsLogHR", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const OpsLogHR_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { OpsLogHRSchema, CreateOpsLogHRSchema, UpdateOpsLogHRSchema } from "../validators/ops-log-hr-validator";
export type { OpsLogHRInput, CreateOpsLogHRInput, UpdateOpsLogHRInput } from "../validators/ops-log-hr-validator";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HRRoutingMatrixService } from "../services/hr-routing-matrix-service";
import type { HRRoutingMatrix } from "../models/hr-routing-matrix-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all HRRoutingMatrix records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, appCode, approverTypeKey, approverValue, backupApproverEmail, department, formName, isActive, site1Key, siteKey, stageKey, stageNo
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useHRRoutingMatrixList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["hRRoutingMatrix-list", options],
    queryFn: () => HRRoutingMatrixService.getAll(options),
  });
}

/**
 * Retrieve a single HRRoutingMatrix record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useHRRoutingMatrix(id: string) {
  return useQuery({
    queryKey: ["hRRoutingMatrix", id],
    queryFn: () => HRRoutingMatrixService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new HRRoutingMatrix record.
 * @remarks Form validation: use CreateHRRoutingMatrixSchema with zodResolver for type-safe create forms
 */
export function useCreateHRRoutingMatrix() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<HRRoutingMatrix, "id">) => HRRoutingMatrixService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["hRRoutingMatrix-list"] });
    },
  });
}

/**
 * Update an existing HRRoutingMatrix record.
 * @remarks Form validation: use UpdateHRRoutingMatrixSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateHRRoutingMatrix() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<HRRoutingMatrix, "id">>;
    }) => HRRoutingMatrixService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["hRRoutingMatrix-list"] });
      client.invalidateQueries({ queryKey: ["hRRoutingMatrix", variables.id] });
    },
  });
}

/**
 * Delete a HRRoutingMatrix record by its unique identifier.
 */
export function useDeleteHRRoutingMatrix() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => HRRoutingMatrixService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["hRRoutingMatrix-list"] });
      client.invalidateQueries({ queryKey: ["hRRoutingMatrix", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const HRRoutingMatrix_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { HRRoutingMatrixSchema, CreateHRRoutingMatrixSchema, UpdateHRRoutingMatrixSchema } from "../validators/hrrouting-matrix-validator";
export type { HRRoutingMatrixInput, CreateHRRoutingMatrixInput, UpdateHRRoutingMatrixInput } from "../validators/hrrouting-matrix-validator";
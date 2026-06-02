import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ITRoutingMatrixService } from "../services/it-routing-matrix-service";
import type { ITRoutingMatrix } from "../models/it-routing-matrix-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ITRoutingMatrix records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, approverRole, approverSPGroup, escalationDays, formName, isActive, siteScopeKey, stageKey, stageLabel
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useITRoutingMatrixList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["iTRoutingMatrix-list", options],
    queryFn: () => ITRoutingMatrixService.getAll(options),
  });
}

/**
 * Retrieve a single ITRoutingMatrix record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useITRoutingMatrix(id: string) {
  return useQuery({
    queryKey: ["iTRoutingMatrix", id],
    queryFn: () => ITRoutingMatrixService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ITRoutingMatrix record.
 * @remarks Form validation: use CreateITRoutingMatrixSchema with zodResolver for type-safe create forms
 */
export function useCreateITRoutingMatrix() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ITRoutingMatrix, "id">) => ITRoutingMatrixService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["iTRoutingMatrix-list"] });
    },
  });
}

/**
 * Update an existing ITRoutingMatrix record.
 * @remarks Form validation: use UpdateITRoutingMatrixSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateITRoutingMatrix() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ITRoutingMatrix, "id">>;
    }) => ITRoutingMatrixService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["iTRoutingMatrix-list"] });
      client.invalidateQueries({ queryKey: ["iTRoutingMatrix", variables.id] });
    },
  });
}

/**
 * Delete a ITRoutingMatrix record by its unique identifier.
 */
export function useDeleteITRoutingMatrix() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ITRoutingMatrixService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["iTRoutingMatrix-list"] });
      client.invalidateQueries({ queryKey: ["iTRoutingMatrix", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ITRoutingMatrix_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ITRoutingMatrixSchema, CreateITRoutingMatrixSchema, UpdateITRoutingMatrixSchema } from "../validators/itrouting-matrix-validator";
export type { ITRoutingMatrixInput, CreateITRoutingMatrixInput, UpdateITRoutingMatrixInput } from "../validators/itrouting-matrix-validator";
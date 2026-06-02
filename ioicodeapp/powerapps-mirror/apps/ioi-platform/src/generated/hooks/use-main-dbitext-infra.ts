import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBITExtInfraService } from "../services/main-dbit-ext-infra-service";
import type { MainDBITExtInfra } from "../models/main-dbit-ext-infra-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

/**
 * Retrieve all MainDBITExtInfra records with optional filtering and sorting.
 * Used for M2 infrastructure logs (IAL1-5) and M3 hardware/server requests (SRVR, HWRR).
 * Filtering supports OData syntax, e.g., "parentFormCode eq 'IAL1'"
 */
export function useMainDBITExtInfraList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["mainDBITExtInfra-list", options],
    queryFn: () => MainDBITExtInfraService.getAll(options),
  });
}

/**
 * Retrieve a single MainDBITExtInfra record by its unique identifier.
 */
export function useMainDBITExtInfra(id: string) {
  return useQuery({
    queryKey: ["mainDBITExtInfra", id],
    queryFn: () => MainDBITExtInfraService.get(id),
    enabled: !!id,
  });
}

/**
 * Create a new MainDBITExtInfra record.
 */
export function useCreateMainDBITExtInfra() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MainDBITExtInfra, "id">) => MainDBITExtInfraService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["mainDBITExtInfra-list"] });
    },
  });
}

/**
 * Update an existing MainDBITExtInfra record.
 */
export function useUpdateMainDBITExtInfra() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, changedFields }: { id: string; changedFields: Partial<Omit<MainDBITExtInfra, "id">> }) =>
      MainDBITExtInfraService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["mainDBITExtInfra-list"] });
      client.invalidateQueries({ queryKey: ["mainDBITExtInfra", variables.id] });
    },
  });
}

/**
 * Delete a MainDBITExtInfra record by its unique identifier.
 */
export function useDeleteMainDBITExtInfra() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MainDBITExtInfraService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["mainDBITExtInfra-list"] });
      client.invalidateQueries({ queryKey: ["mainDBITExtInfra", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const MainDBITExtInfra_DATA_SOURCE_TYPE = 'SharePoint' as const;

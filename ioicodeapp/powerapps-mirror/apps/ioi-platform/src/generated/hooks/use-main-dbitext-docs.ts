import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBITExtDocsService } from "../services/main-dbit-ext-docs-service";
import type { MainDBITExtDocs } from "../models/main-dbit-ext-docs-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

/**
 * Retrieve all MainDBITExtDocs records with optional filtering and sorting.
 * Used for M5 documentation forms (ITP, ITP2, IOIP, ITI).
 * Filtering supports OData syntax, e.g., "parentFormCode eq 'ITP'"
 */
export function useMainDBITExtDocsList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["mainDBITExtDocs-list", options],
    queryFn: () => MainDBITExtDocsService.getAll(options),
  });
}

/**
 * Retrieve a single MainDBITExtDocs record by its unique identifier.
 */
export function useMainDBITExtDocs(id: string) {
  return useQuery({
    queryKey: ["mainDBITExtDocs", id],
    queryFn: () => MainDBITExtDocsService.get(id),
    enabled: !!id,
  });
}

/**
 * Create a new MainDBITExtDocs record.
 */
export function useCreateMainDBITExtDocs() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MainDBITExtDocs, "id">) => MainDBITExtDocsService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["mainDBITExtDocs-list"] });
    },
  });
}

/**
 * Update an existing MainDBITExtDocs record.
 */
export function useUpdateMainDBITExtDocs() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, changedFields }: { id: string; changedFields: Partial<Omit<MainDBITExtDocs, "id">> }) =>
      MainDBITExtDocsService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["mainDBITExtDocs-list"] });
      client.invalidateQueries({ queryKey: ["mainDBITExtDocs", variables.id] });
    },
  });
}

/**
 * Delete a MainDBITExtDocs record by its unique identifier.
 */
export function useDeleteMainDBITExtDocs() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MainDBITExtDocsService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["mainDBITExtDocs-list"] });
      client.invalidateQueries({ queryKey: ["mainDBITExtDocs", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const MainDBITExtDocs_DATA_SOURCE_TYPE = 'SharePoint' as const;

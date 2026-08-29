import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBLOGService } from "../services/main-dblog-service";
import type { MainDBLOG } from "../models/main-dblog-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all MainDBLOG records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 */
export function useMainDBLOGList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["mainDBLOG-list", options],
    queryFn: () => MainDBLOGService.getAll(options),
  });
}

/**
 * Retrieve a single MainDBLOG record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useMainDBLOG(id: string) {
  return useQuery({
    queryKey: ["mainDBLOG", id],
    queryFn: () => MainDBLOGService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new MainDBLOG record.
 */
export function useCreateMainDBLOG() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MainDBLOG, "id">) => MainDBLOGService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["mainDBLOG-list"] });
    },
  });
}

/**
 * Update an existing MainDBLOG record.
 */
export function useUpdateMainDBLOG() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<MainDBLOG, "id">>;
    }) => MainDBLOGService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["mainDBLOG-list"] });
      client.invalidateQueries({ queryKey: ["mainDBLOG", variables.id] });
    },
  });
}

/**
 * Delete a MainDBLOG record by its unique identifier.
 */
export function useDeleteMainDBLOG() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MainDBLOGService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["mainDBLOG-list"] });
      client.invalidateQueries({ queryKey: ["mainDBLOG", id] });
    },
  });
}

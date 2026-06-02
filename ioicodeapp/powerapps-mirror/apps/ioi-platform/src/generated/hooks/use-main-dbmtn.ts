import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBMTNService } from "../services/main-dbmtn-service";
import type { MainDBMTN } from "../models/main-dbmtn-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all MainDBMTN records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 */
export function useMainDBMTNList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["mainDBMTN-list", options],
    queryFn: () => MainDBMTNService.getAll(options),
  });
}

/**
 * Retrieve a single MainDBMTN record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useMainDBMTN(id: string) {
  return useQuery({
    queryKey: ["mainDBMTN", id],
    queryFn: () => MainDBMTNService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new MainDBMTN record.
 */
export function useCreateMainDBMTN() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MainDBMTN, "id">) => MainDBMTNService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["mainDBMTN-list"] });
    },
  });
}

/**
 * Update an existing MainDBMTN record.
 */
export function useUpdateMainDBMTN() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<MainDBMTN, "id">>;
    }) => MainDBMTNService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["mainDBMTN-list"] });
      client.invalidateQueries({ queryKey: ["mainDBMTN", variables.id] });
    },
  });
}

/**
 * Delete a MainDBMTN record by its unique identifier.
 */
export function useDeleteMainDBMTN() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MainDBMTNService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["mainDBMTN-list"] });
      client.invalidateQueries({ queryKey: ["mainDBMTN", id] });
    },
  });
}

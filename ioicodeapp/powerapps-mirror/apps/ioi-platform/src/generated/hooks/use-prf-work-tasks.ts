import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PRFWorkTasksService } from "../services/prf-work-tasks-service";
import type { PRFWorkTasks } from "../models/prf-work-tasks-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

/**
 * Retrieve all PRFWorkTasks records with optional filtering and sorting.
 * Used for work task items linked to a PRF record.
 * Filtering supports OData syntax, e.g., "parentFormCode eq 'PRF'"
 */
export function usePRFWorkTasksList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["prfWorkTasks-list", options],
    queryFn: () => PRFWorkTasksService.getAll(options),
  });
}

/**
 * Retrieve a single PRFWorkTasks record by its unique identifier.
 */
export function usePRFWorkTasks(id: string) {
  return useQuery({
    queryKey: ["prfWorkTasks", id],
    queryFn: () => PRFWorkTasksService.get(id),
    enabled: !!id,
  });
}

/**
 * Create a new PRFWorkTasks record.
 */
export function useCreatePRFWorkTasks() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<PRFWorkTasks, "id">) => PRFWorkTasksService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["prfWorkTasks-list"] });
    },
  });
}

/**
 * Update an existing PRFWorkTasks record.
 */
export function useUpdatePRFWorkTasks() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, changedFields }: { id: string; changedFields: Partial<Omit<PRFWorkTasks, "id">> }) =>
      PRFWorkTasksService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["prfWorkTasks-list"] });
      client.invalidateQueries({ queryKey: ["prfWorkTasks", variables.id] });
    },
  });
}

/**
 * Delete a PRFWorkTasks record by its unique identifier.
 */
export function useDeletePRFWorkTasks() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => PRFWorkTasksService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["prfWorkTasks-list"] });
      client.invalidateQueries({ queryKey: ["prfWorkTasks", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const PRFWorkTasks_DATA_SOURCE_TYPE = 'SharePoint' as const;

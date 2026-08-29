import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBITService } from "../services/main-dbit-service";
import type { MainDBIT } from "../models/main-dbit-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

/**
 * Retrieve all MainDBIT records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, currentstatusKey, environmenttagKey, formcode, formTypeKey, hODApproverRemarks, hTMLEMAILTEMPLATE, islocked, remarks, requestoremail, siteKey, submitteddate, workflowstage
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useMainDBITList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["mainDBIT-list", options],
    queryFn: () => MainDBITService.getAll(options),
  });
}

/**
 * Retrieve a single MainDBIT record by its unique identifier.
 * @param id The numeric id of the record
 */
export function useMainDBIT(id: string) {
  return useQuery({
    queryKey: ["mainDBIT", id],
    queryFn: () => MainDBITService.get(id),
    enabled: !!id && !isNaN(Number(id)),
  });
}

/**
 * Create a new MainDBIT record.
 * @remarks Form validation: use CreateMainDBITSchema with zodResolver for type-safe create forms
 */
export function useCreateMainDBIT() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MainDBIT, "id">) => MainDBITService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["mainDBIT-list"] });
    },
  });
}

/**
 * Update an existing MainDBIT record.
 * @remarks Form validation: use UpdateMainDBITSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateMainDBIT() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<MainDBIT, "id">>;
    }) => MainDBITService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["mainDBIT-list"] });
      client.invalidateQueries({ queryKey: ["mainDBIT", variables.id] });
    },
  });
}

/**
 * Delete a MainDBIT record by its unique identifier.
 */
export function useDeleteMainDBIT() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MainDBITService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["mainDBIT-list"] });
      client.invalidateQueries({ queryKey: ["mainDBIT", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const MainDBIT_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { MainDBITSchema, CreateMainDBITSchema, UpdateMainDBITSchema } from "../validators/main-dbit-validator";
export type { MainDBITInput, CreateMainDBITInput, UpdateMainDBITInput } from "../validators/main-dbit-validator";
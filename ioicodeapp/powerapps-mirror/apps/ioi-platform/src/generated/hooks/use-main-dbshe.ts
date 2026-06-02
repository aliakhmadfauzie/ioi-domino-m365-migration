import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBSHEService } from "../services/main-dbshe-service";
import type { MainDBSHE } from "../models/main-dbshe-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all MainDBSHE records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, appName, attachmentLinks, currentApproverEmail, currentStage, departmentKey, dueDate, finalStatus, formCode, formVersion, iMSRefNo, iMSRelated, priorityKey, requestorEmail, requestTitle, siteKey, statusKey, submittedDate, targetDate, workflowAction
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useMainDBSHEList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["mainDBSHE-list", options],
    queryFn: () => MainDBSHEService.getAll(options),
  });
}

/**
 * Retrieve a single MainDBSHE record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useMainDBSHE(id: string) {
  return useQuery({
    queryKey: ["mainDBSHE", id],
    queryFn: () => MainDBSHEService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new MainDBSHE record.
 * @remarks Form validation: use CreateMainDBSHESchema with zodResolver for type-safe create forms
 */
export function useCreateMainDBSHE() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MainDBSHE, "id">) => MainDBSHEService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["mainDBSHE-list"] });
    },
  });
}

/**
 * Update an existing MainDBSHE record.
 * @remarks Form validation: use UpdateMainDBSHESchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateMainDBSHE() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<MainDBSHE, "id">>;
    }) => MainDBSHEService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["mainDBSHE-list"] });
      client.invalidateQueries({ queryKey: ["mainDBSHE", variables.id] });
    },
  });
}

/**
 * Delete a MainDBSHE record by its unique identifier.
 */
export function useDeleteMainDBSHE() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MainDBSHEService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["mainDBSHE-list"] });
      client.invalidateQueries({ queryKey: ["mainDBSHE", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const MainDBSHE_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { MainDBSHESchema, CreateMainDBSHESchema, UpdateMainDBSHESchema } from "../validators/main-dbshe-validator";
export type { MainDBSHEInput, CreateMainDBSHEInput, UpdateMainDBSHEInput } from "../validators/main-dbshe-validator";
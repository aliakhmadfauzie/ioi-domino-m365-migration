import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBQAService } from "../services/main-dbqa-service";
import type { MainDBQA } from "../models/main-dbqa-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all MainDBQA records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, appName, attachmentLinks, changeControlNumber, currentApproverEmail, currentStage, departmentKey, dueDate, finalStatus, formCode, formReferenceID, formTypeKey, formVersion, iMSRefNo, iMSRelated, incidentIssueType, plannedEndDate, plannedStartDate, priorityKey, requestorEmail, requestTitle, rootCause, severityLevelKey, siteKey, statusKey, submittedDate, targetDate, targetResolutionDate, workflowAction
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useMainDBQAList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["mainDBQA-list", options],
    queryFn: () => MainDBQAService.getAll(options),
  });
}

/**
 * Retrieve a single MainDBQA record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useMainDBQA(id: string) {
  return useQuery({
    queryKey: ["mainDBQA", id],
    queryFn: () => MainDBQAService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new MainDBQA record.
 * @remarks Form validation: use CreateMainDBQASchema with zodResolver for type-safe create forms
 */
export function useCreateMainDBQA() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MainDBQA, "id">) => MainDBQAService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["mainDBQA-list"] });
    },
  });
}

/**
 * Update an existing MainDBQA record.
 * @remarks Form validation: use UpdateMainDBQASchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateMainDBQA() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<MainDBQA, "id">>;
    }) => MainDBQAService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["mainDBQA-list"] });
      client.invalidateQueries({ queryKey: ["mainDBQA", variables.id] });
    },
  });
}

/**
 * Delete a MainDBQA record by its unique identifier.
 */
export function useDeleteMainDBQA() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MainDBQAService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["mainDBQA-list"] });
      client.invalidateQueries({ queryKey: ["mainDBQA", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const MainDBQA_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { MainDBQASchema, CreateMainDBQASchema, UpdateMainDBQASchema } from "../validators/main-dbqa-validator";
export type { MainDBQAInput, CreateMainDBQAInput, UpdateMainDBQAInput } from "../validators/main-dbqa-validator";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ITFormsService } from "../services/it-forms-service";
import type { ITForms } from "../models/it-forms-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ITForms records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, applicantName, comments, createdDate, currentAction, currentStage, department, designation, environmentTagKey, formCode, justification, modifiedDate, siteKey, statusKey, submittedByID, submittedByName, submittedDate
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useITFormsList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["iTForms-list", options],
    queryFn: () => ITFormsService.getAll(options),
  });
}

/**
 * Retrieve a single ITForms record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useITForms(id: string) {
  return useQuery({
    queryKey: ["iTForms", id],
    queryFn: () => ITFormsService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ITForms record.
 * @remarks Form validation: use CreateITFormsSchema with zodResolver for type-safe create forms
 */
export function useCreateITForms() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ITForms, "id">) => ITFormsService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["iTForms-list"] });
    },
  });
}

/**
 * Update an existing ITForms record.
 * @remarks Form validation: use UpdateITFormsSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateITForms() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ITForms, "id">>;
    }) => ITFormsService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["iTForms-list"] });
      client.invalidateQueries({ queryKey: ["iTForms", variables.id] });
    },
  });
}

/**
 * Delete a ITForms record by its unique identifier.
 */
export function useDeleteITForms() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ITFormsService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["iTForms-list"] });
      client.invalidateQueries({ queryKey: ["iTForms", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ITForms_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ITFormsSchema, CreateITFormsSchema, UpdateITFormsSchema } from "../validators/itforms-validator";
export type { ITFormsInput, CreateITFormsInput, UpdateITFormsInput } from "../validators/itforms-validator";
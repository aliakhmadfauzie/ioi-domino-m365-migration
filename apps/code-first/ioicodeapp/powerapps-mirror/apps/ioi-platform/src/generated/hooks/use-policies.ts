import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PoliciesService } from "../services/policies-service";
import type { Policies } from "../models/policies-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all Policies records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, approvedByID, approvedDate, comments, currentActionKey, dateIssued, documentAuthorID, environmentTagKey, formCode, policyNumber, policyOwnerID, revisionNumber, statusKey, subject, submittedByID, submittedDate
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function usePoliciesList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["policies-list", options],
    queryFn: () => PoliciesService.getAll(options),
  });
}

/**
 * Retrieve a single Policies record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function usePolicies(id: string) {
  return useQuery({
    queryKey: ["policies", id],
    queryFn: () => PoliciesService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new Policies record.
 * @remarks Form validation: use CreatePoliciesSchema with zodResolver for type-safe create forms
 */
export function useCreatePolicies() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Policies, "id">) => PoliciesService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["policies-list"] });
    },
  });
}

/**
 * Update an existing Policies record.
 * @remarks Form validation: use UpdatePoliciesSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdatePolicies() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<Policies, "id">>;
    }) => PoliciesService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["policies-list"] });
      client.invalidateQueries({ queryKey: ["policies", variables.id] });
    },
  });
}

/**
 * Delete a Policies record by its unique identifier.
 */
export function useDeletePolicies() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => PoliciesService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["policies-list"] });
      client.invalidateQueries({ queryKey: ["policies", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const Policies_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { PoliciesSchema, CreatePoliciesSchema, UpdatePoliciesSchema } from "../validators/policies-validator";
export type { PoliciesInput, CreatePoliciesInput, UpdatePoliciesInput } from "../validators/policies-validator";
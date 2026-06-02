import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IssueAndBugTrackerService } from "../services/issue-and-bug-tracker-service";
import type { IssueAndBugTracker } from "../models/issue-and-bug-tracker-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all IssueAndBugTracker records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, comment, department, formCode, issueDescription, priorityKey, statusKey
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useIssueAndBugTrackerList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["issueAndBugTracker-list", options],
    queryFn: () => IssueAndBugTrackerService.getAll(options),
  });
}

/**
 * Retrieve a single IssueAndBugTracker record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useIssueAndBugTracker(id: string) {
  return useQuery({
    queryKey: ["issueAndBugTracker", id],
    queryFn: () => IssueAndBugTrackerService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new IssueAndBugTracker record.
 * @remarks Form validation: use CreateIssueAndBugTrackerSchema with zodResolver for type-safe create forms
 */
export function useCreateIssueAndBugTracker() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<IssueAndBugTracker, "id">) => IssueAndBugTrackerService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["issueAndBugTracker-list"] });
    },
  });
}

/**
 * Update an existing IssueAndBugTracker record.
 * @remarks Form validation: use UpdateIssueAndBugTrackerSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateIssueAndBugTracker() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<IssueAndBugTracker, "id">>;
    }) => IssueAndBugTrackerService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["issueAndBugTracker-list"] });
      client.invalidateQueries({ queryKey: ["issueAndBugTracker", variables.id] });
    },
  });
}

/**
 * Delete a IssueAndBugTracker record by its unique identifier.
 */
export function useDeleteIssueAndBugTracker() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => IssueAndBugTrackerService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["issueAndBugTracker-list"] });
      client.invalidateQueries({ queryKey: ["issueAndBugTracker", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const IssueAndBugTracker_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { IssueAndBugTrackerSchema, CreateIssueAndBugTrackerSchema, UpdateIssueAndBugTrackerSchema } from "../validators/issue-and-bug-tracker-validator";
export type { IssueAndBugTrackerInput, CreateIssueAndBugTrackerInput, UpdateIssueAndBugTrackerInput } from "../validators/issue-and-bug-tracker-validator";
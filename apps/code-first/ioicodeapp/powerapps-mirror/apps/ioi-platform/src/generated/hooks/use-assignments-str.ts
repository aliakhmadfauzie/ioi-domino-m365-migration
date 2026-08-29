import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AssignmentsSTRService } from "../services/assignments-str-service";
import type { AssignmentsSTR } from "../models/assignments-str-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all AssignmentsSTR records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, appName, assignedOn, assignedRole, assignedToEmail, assignmentID, completedOn, completionStatus, dueDate, escalationLevel, nextReminderDate, recordID, remarks, reminderDate, siteKey, taskType
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useAssignmentsSTRList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["assignmentsSTR-list", options],
    queryFn: () => AssignmentsSTRService.getAll(options),
  });
}

/**
 * Retrieve a single AssignmentsSTR record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useAssignmentsSTR(id: string) {
  return useQuery({
    queryKey: ["assignmentsSTR", id],
    queryFn: () => AssignmentsSTRService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new AssignmentsSTR record.
 * @remarks Form validation: use CreateAssignmentsSTRSchema with zodResolver for type-safe create forms
 */
export function useCreateAssignmentsSTR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<AssignmentsSTR, "id">) => AssignmentsSTRService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["assignmentsSTR-list"] });
    },
  });
}

/**
 * Update an existing AssignmentsSTR record.
 * @remarks Form validation: use UpdateAssignmentsSTRSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateAssignmentsSTR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<AssignmentsSTR, "id">>;
    }) => AssignmentsSTRService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["assignmentsSTR-list"] });
      client.invalidateQueries({ queryKey: ["assignmentsSTR", variables.id] });
    },
  });
}

/**
 * Delete a AssignmentsSTR record by its unique identifier.
 */
export function useDeleteAssignmentsSTR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AssignmentsSTRService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["assignmentsSTR-list"] });
      client.invalidateQueries({ queryKey: ["assignmentsSTR", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const AssignmentsSTR_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { AssignmentsSTRSchema, CreateAssignmentsSTRSchema, UpdateAssignmentsSTRSchema } from "../validators/assignments-str-validator";
export type { AssignmentsSTRInput, CreateAssignmentsSTRInput, UpdateAssignmentsSTRInput } from "../validators/assignments-str-validator";
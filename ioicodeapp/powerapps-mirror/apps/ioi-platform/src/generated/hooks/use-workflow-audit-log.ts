import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WorkflowAuditLogService } from "../services/workflow-audit-log-service";
import type { WorkflowAuditLog } from "../models/workflow-audit-log-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all WorkflowAuditLog records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, actionTaken, actorEmail, actorName, comment, formCode, newStatus, oldStatus, requestItemID, siteTag, timestamp
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useWorkflowAuditLogList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["workflowAuditLog-list", options],
    queryFn: () => WorkflowAuditLogService.getAll(options),
  });
}

/**
 * Retrieve a single WorkflowAuditLog record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useWorkflowAuditLog(id: string) {
  return useQuery({
    queryKey: ["workflowAuditLog", id],
    queryFn: () => WorkflowAuditLogService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new WorkflowAuditLog record.
 * @remarks Form validation: use CreateWorkflowAuditLogSchema with zodResolver for type-safe create forms
 */
export function useCreateWorkflowAuditLog() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<WorkflowAuditLog, "id">) => WorkflowAuditLogService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["workflowAuditLog-list"] });
    },
  });
}

/**
 * Update an existing WorkflowAuditLog record.
 * @remarks Form validation: use UpdateWorkflowAuditLogSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateWorkflowAuditLog() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<WorkflowAuditLog, "id">>;
    }) => WorkflowAuditLogService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["workflowAuditLog-list"] });
      client.invalidateQueries({ queryKey: ["workflowAuditLog", variables.id] });
    },
  });
}

/**
 * Delete a WorkflowAuditLog record by its unique identifier.
 */
export function useDeleteWorkflowAuditLog() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => WorkflowAuditLogService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["workflowAuditLog-list"] });
      client.invalidateQueries({ queryKey: ["workflowAuditLog", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const WorkflowAuditLog_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { WorkflowAuditLogSchema, CreateWorkflowAuditLogSchema, UpdateWorkflowAuditLogSchema } from "../validators/workflow-audit-log-validator";
export type { WorkflowAuditLogInput, CreateWorkflowAuditLogInput, UpdateWorkflowAuditLogInput } from "../validators/workflow-audit-log-validator";
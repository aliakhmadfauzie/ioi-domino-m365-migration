import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuditLogsService } from "../services/audit-logs-service";
import type { AuditLogs } from "../models/audit-logs-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all AuditLogs records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, actionKey, departmentKey, details, iPAddress, resourceID, resourceType, timestamp, userID
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useAuditLogsList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["auditLogs-list", options],
    queryFn: () => AuditLogsService.getAll(options),
  });
}

/**
 * Retrieve a single AuditLogs record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useAuditLogs(id: string) {
  return useQuery({
    queryKey: ["auditLogs", id],
    queryFn: () => AuditLogsService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new AuditLogs record.
 * @remarks Form validation: use CreateAuditLogsSchema with zodResolver for type-safe create forms
 */
export function useCreateAuditLogs() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<AuditLogs, "id">) => AuditLogsService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["auditLogs-list"] });
    },
  });
}

/**
 * Update an existing AuditLogs record.
 * @remarks Form validation: use UpdateAuditLogsSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateAuditLogs() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<AuditLogs, "id">>;
    }) => AuditLogsService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["auditLogs-list"] });
      client.invalidateQueries({ queryKey: ["auditLogs", variables.id] });
    },
  });
}

/**
 * Delete a AuditLogs record by its unique identifier.
 */
export function useDeleteAuditLogs() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AuditLogsService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["auditLogs-list"] });
      client.invalidateQueries({ queryKey: ["auditLogs", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const AuditLogs_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { AuditLogsSchema, CreateAuditLogsSchema, UpdateAuditLogsSchema } from "../validators/audit-logs-validator";
export type { AuditLogsInput, CreateAuditLogsInput, UpdateAuditLogsInput } from "../validators/audit-logs-validator";
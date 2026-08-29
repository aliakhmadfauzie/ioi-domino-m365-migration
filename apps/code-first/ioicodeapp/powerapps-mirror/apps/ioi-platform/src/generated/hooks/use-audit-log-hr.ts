import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuditLogHRService } from "../services/audit-log-hr-service";
import type { AuditLogHR } from "../models/audit-log-hr-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all AuditLogHR records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, appName, changedBy, changedOnUTC, correlationId, fieldName, itemID, listName, newValue, oldValue, siteKey
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useAuditLogHRList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["auditLogHR-list", options],
    queryFn: () => AuditLogHRService.getAll(options),
  });
}

/**
 * Retrieve a single AuditLogHR record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useAuditLogHR(id: string) {
  return useQuery({
    queryKey: ["auditLogHR", id],
    queryFn: () => AuditLogHRService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new AuditLogHR record.
 * @remarks Form validation: use CreateAuditLogHRSchema with zodResolver for type-safe create forms
 */
export function useCreateAuditLogHR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<AuditLogHR, "id">) => AuditLogHRService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["auditLogHR-list"] });
    },
  });
}

/**
 * Update an existing AuditLogHR record.
 * @remarks Form validation: use UpdateAuditLogHRSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateAuditLogHR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<AuditLogHR, "id">>;
    }) => AuditLogHRService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["auditLogHR-list"] });
      client.invalidateQueries({ queryKey: ["auditLogHR", variables.id] });
    },
  });
}

/**
 * Delete a AuditLogHR record by its unique identifier.
 */
export function useDeleteAuditLogHR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AuditLogHRService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["auditLogHR-list"] });
      client.invalidateQueries({ queryKey: ["auditLogHR", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const AuditLogHR_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { AuditLogHRSchema, CreateAuditLogHRSchema, UpdateAuditLogHRSchema } from "../validators/audit-log-hr-validator";
export type { AuditLogHRInput, CreateAuditLogHRInput, UpdateAuditLogHRInput } from "../validators/audit-log-hr-validator";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBSTRService } from "../services/main-dbstr-service";
import type { MainDBSTR } from "../models/main-dbstr-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all MainDBSTR records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, appName, approverRemarks, attachmentLinks, businessArea, correctiveActionSummary, currentApproverDisplayName, currentApproverEmail, currentApproverGroup, currentStage, departmentKey, description, documentNo, documentType, dueDate, effectiveDate, finalStatus, formCode, formVersion, inspectedBy, inspectionDate, inspectionRemarks, inspectionTime, lastImmediateProduct, priority, productToLoad, qCApprovalBy, qCApprovalDate, qCApprovalStatus, quantityMT, reasonForChange, recipientHODEmail, requestedBy, requestorDisplayName, requestorEmail, requestTitle, requiresCOOApproval, responseDueDate, responseExtendedDueDate, revisionNo, rootCauseSummary, siteKey, statusKey, submittedOn, systemCode, tankNo, targetDate, urgencyReason, workflowAction
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useMainDBSTRList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["mainDBSTR-list", options],
    queryFn: () => MainDBSTRService.getAll(options),
  });
}

/**
 * Retrieve a single MainDBSTR record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useMainDBSTR(id: string) {
  return useQuery({
    queryKey: ["mainDBSTR", id],
    queryFn: () => MainDBSTRService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new MainDBSTR record.
 * @remarks Form validation: use CreateMainDBSTRSchema with zodResolver for type-safe create forms
 */
export function useCreateMainDBSTR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MainDBSTR, "id">) => MainDBSTRService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["mainDBSTR-list"] });
    },
  });
}

/**
 * Update an existing MainDBSTR record.
 * @remarks Form validation: use UpdateMainDBSTRSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateMainDBSTR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<MainDBSTR, "id">>;
    }) => MainDBSTRService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["mainDBSTR-list"] });
      client.invalidateQueries({ queryKey: ["mainDBSTR", variables.id] });
    },
  });
}

/**
 * Delete a MainDBSTR record by its unique identifier.
 */
export function useDeleteMainDBSTR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MainDBSTRService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["mainDBSTR-list"] });
      client.invalidateQueries({ queryKey: ["mainDBSTR", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const MainDBSTR_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { MainDBSTRSchema, CreateMainDBSTRSchema, UpdateMainDBSTRSchema } from "../validators/main-dbstr-validator";
export type { MainDBSTRInput, CreateMainDBSTRInput, UpdateMainDBSTRInput } from "../validators/main-dbstr-validator";
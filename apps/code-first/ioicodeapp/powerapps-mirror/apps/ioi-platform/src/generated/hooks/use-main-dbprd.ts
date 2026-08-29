import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBPRDService } from "../services/main-dbprd-service";
import type { MainDBPRD } from "../models/main-dbprd-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all MainDBPRD records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, appName, approverRemarks, attachmentLinks, businessArea, correctiveActionSummary, currentApproverDisplayName, currentApproverEmail, currentApproverGroup, currentStage, departmentKey, description, documentNo, documentType, dueDate, effectiveDate, finalStatus, formCode, formReferenceID, formVersion, inspectedBy, inspectionDate, inspectionRemarks, inspectionTime, lastImmediateProduct, priority, productCode, productionBatchNumber, productionDate, productToLoad, qCApprovalBy, qCApprovalDate, qCApprovalStatus, quantityMT, reasonForChange, recipientHODEmail, requestedBy, requestorDisplayName, requestorEmail, requestTitle, requiresCOOApproval, responseDueDate, responseExtendedDueDate, revisionNo, rootCauseSummary, shiftInformation, siteKey, statusKey, submittedOn, systemCode, tankNo, targetDate, urgencyReason, workflowAction
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useMainDBPRDList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["mainDBPRD-list", options],
    queryFn: () => MainDBPRDService.getAll(options),
  });
}

/**
 * Retrieve a single MainDBPRD record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useMainDBPRD(id: string) {
  return useQuery({
    queryKey: ["mainDBPRD", id],
    queryFn: () => MainDBPRDService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new MainDBPRD record.
 * @remarks Form validation: use CreateMainDBPRDSchema with zodResolver for type-safe create forms
 */
export function useCreateMainDBPRD() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MainDBPRD, "id">) => MainDBPRDService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["mainDBPRD-list"] });
    },
  });
}

/**
 * Update an existing MainDBPRD record.
 * @remarks Form validation: use UpdateMainDBPRDSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateMainDBPRD() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<MainDBPRD, "id">>;
    }) => MainDBPRDService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["mainDBPRD-list"] });
      client.invalidateQueries({ queryKey: ["mainDBPRD", variables.id] });
    },
  });
}

/**
 * Delete a MainDBPRD record by its unique identifier.
 */
export function useDeleteMainDBPRD() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MainDBPRDService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["mainDBPRD-list"] });
      client.invalidateQueries({ queryKey: ["mainDBPRD", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const MainDBPRD_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { MainDBPRDSchema, CreateMainDBPRDSchema, UpdateMainDBPRDSchema } from "../validators/main-dbprd-validator";
export type { MainDBPRDInput, CreateMainDBPRDInput, UpdateMainDBPRDInput } from "../validators/main-dbprd-validator";
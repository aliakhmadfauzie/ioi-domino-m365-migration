import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBFINService } from "../services/main-dbfin-service";
import type { MainDBFIN } from "../models/main-dbfin-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all MainDBFIN records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, amount, appName, approverRemarks, attachmentLinks, businessArea, companyKey, contractAmount, correctiveActionSummary, currentApproverDisplayName, currentApproverEmail, currentApproverGroup, currentStage, departmentKey, description, documentNo, documentType, dueDate, effectiveDate, finalStatus, formCode, formVersion, inspectedBy, inspectionDate, inspectionRemarks, inspectionTime, iRRPercent, lastImmediateProduct, module2Key, paybackPeriod, priority, problemDesc, productToLoad, qCApprovalBy, qCApprovalDate, qCApprovalStatus, quantityMT, reasonForChange, recipientHODEmail, requestedBy, requestorDisplayName, requestorEmail, requestTitle, requiresCOOApproval, responseDueDate, responseExtendedDueDate, revisionNo, rootCauseSummary, section, siteKey, statusKey, statusRequest, submittedOn, systemCode, tankNo, targetDate, urgencyReason, workflowAction
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useMainDBFINList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["mainDBFIN-list", options],
    queryFn: () => MainDBFINService.getAll(options),
  });
}

/**
 * Retrieve a single MainDBFIN record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useMainDBFIN(id: string) {
  return useQuery({
    queryKey: ["mainDBFIN", id],
    queryFn: () => MainDBFINService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new MainDBFIN record.
 * @remarks Form validation: use CreateMainDBFINSchema with zodResolver for type-safe create forms
 */
export function useCreateMainDBFIN() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MainDBFIN, "id">) => MainDBFINService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["mainDBFIN-list"] });
    },
  });
}

/**
 * Update an existing MainDBFIN record.
 * @remarks Form validation: use UpdateMainDBFINSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateMainDBFIN() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<MainDBFIN, "id">>;
    }) => MainDBFINService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["mainDBFIN-list"] });
      client.invalidateQueries({ queryKey: ["mainDBFIN", variables.id] });
    },
  });
}

/**
 * Delete a MainDBFIN record by its unique identifier.
 */
export function useDeleteMainDBFIN() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MainDBFINService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["mainDBFIN-list"] });
      client.invalidateQueries({ queryKey: ["mainDBFIN", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const MainDBFIN_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { MainDBFINSchema, CreateMainDBFINSchema, UpdateMainDBFINSchema } from "../validators/main-dbfin-validator";
export type { MainDBFINInput, CreateMainDBFINInput, UpdateMainDBFINInput } from "../validators/main-dbfin-validator";
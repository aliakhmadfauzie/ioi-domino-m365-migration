import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBHRService } from "../services/main-dbhr-service";
import type { MainDBHR } from "../models/main-dbhr-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all MainDBHR records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, appliedPosition, appname, approverremarks, attachmentlinks, backupPIC, businessarea, candidateName, caseStatusKey, company, correctiveactionsummary, currentapproverdisplayname, currentapproveremail, currentapprovergroup, currentstage, department, dept, description, details, division, documentno, documenttype, duedate, effectivedate, empAge, employeedepartment, employeeid, employeename, empName, empNo, ephrcompany, ephrdept, ephrfollowup, ephrfullname, ephrgender, ephrhp, ephric, ephrmedhist, ephrvision, ephrvisual, esfage, esfcategory, esfdatesubmitted, esfhr, esfit, esfservers, esfservice, esfsuggestion, exitCategoryKey, exitTypeKey, finalstatus, formcode, formType, formversion, fwwpdcomemo, fwwpdcompany, fwwpddepartment, fwwpdempno, fwwpdhostel, fwwpdname, fwwpdpassportnonew, fwwpdreason, fwwpdremark, hODEmail, inDate, iNO, inspectedby, inspectiondate, inspectionremarks, inspectiontime, jobdesignation, lastimmediateproduct, lastWorkingDay, linkedJDRefKey, linkedSRRefKey, module2Key, moduleKey, nationality, phoneExtension, pIC, pICEmail, pICPosition, priority, problemDesc, producttoload, profileDetails, qcapprovalby, qcapprovaldate, qcapprovalstatus, quantitymt, reasonforchange, reasonForLeaving, recipienthodemail, remarks, requestedby, requestordisplayname, requestoremail, requesttitle, requesttypeKey, requirescooapproval, responseduedate, responseextendedduedate, revisionno, rootcausesummary, section, siteKey, statusKey, submittedon, systemcode, systemNameKey, tankno, targetdate, urgencyreason, vacancyTitle, workerID, workerName, workflowaction
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useMainDBHRList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["mainDBHR-list", options],
    queryFn: () => MainDBHRService.getAll(options),
  });
}

/**
 * Retrieve a single MainDBHR record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useMainDBHR(id: string) {
  return useQuery({
    queryKey: ["mainDBHR", id],
    queryFn: () => MainDBHRService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new MainDBHR record.
 * @remarks Form validation: use CreateMainDBHRSchema with zodResolver for type-safe create forms
 */
export function useCreateMainDBHR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MainDBHR, "id">) => MainDBHRService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["mainDBHR-list"] });
    },
  });
}

/**
 * Update an existing MainDBHR record.
 * @remarks Form validation: use UpdateMainDBHRSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateMainDBHR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<MainDBHR, "id">>;
    }) => MainDBHRService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["mainDBHR-list"] });
      client.invalidateQueries({ queryKey: ["mainDBHR", variables.id] });
    },
  });
}

/**
 * Delete a MainDBHR record by its unique identifier.
 */
export function useDeleteMainDBHR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MainDBHRService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["mainDBHR-list"] });
      client.invalidateQueries({ queryKey: ["mainDBHR", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const MainDBHR_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { MainDBHRSchema, CreateMainDBHRSchema, UpdateMainDBHRSchema } from "../validators/main-dbhr-validator";
export type { MainDBHRInput, CreateMainDBHRInput, UpdateMainDBHRInput } from "../validators/main-dbhr-validator";
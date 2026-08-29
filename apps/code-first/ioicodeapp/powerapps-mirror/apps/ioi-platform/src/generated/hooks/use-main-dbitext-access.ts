import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBITExtAccessService } from "../services/main-dbit-ext-access-service";
import type { MainDBITExtAccess } from "../models/main-dbit-ext-access-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all MainDBITExtAccess records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, eAFApplication, eAFDDAppApprovedBy, eAFDDAppComment, eAFDDAppDate, eAFDDAppStatus, eAFDeptHeadComment, eAFDeptHeadDate, eAFDeptHeadEmail, eAFDeptHeadStatus, eAFIsPCN, eAFITCompletedBy, eAFITCompletedDate, eAFITCompletionStatus, eAFITManagerApprovedBy, eAFITManagerComment, eAFITManagerDate, eAFITManagerStatus, eAFJustification, eAFReminderTo, eAFSystemName, eAFTargetUserEmail, nIRDepartment, nIRFullName, nIRHODApprovalStatus, nIRHODApprovedBy, nIRHODApprovedDate, nIRITHardwareBy, nIRITHardwareStatus, nIRNotesAdminBy, nIRNotesAdminDate, nIRNotesAdminStatus, nIRRequestType, parentFormCode, parentSite, rSEDApprovedBy, rSEDApprovedDate, rSITProcessedBy, rSITProcessedDate, rSNeedsEDApproval, rSRequestType, rSTargetUserEmail, sFARAccessLevel, sFARFolderPath, sFARReviewedBy, sFARReviewedDate, uRITAdminBy, uRITAdminDate, uRSystemAccess, uRUserDepartment, uRUserFullName
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useMainDBITExtAccessList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["mainDBITExtAccess-list", options],
    queryFn: () => MainDBITExtAccessService.getAll(options),
  });
}

/**
 * Retrieve a single MainDBITExtAccess record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useMainDBITExtAccess(id: string) {
  return useQuery({
    queryKey: ["mainDBITExtAccess", id],
    queryFn: () => MainDBITExtAccessService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new MainDBITExtAccess record.
 * @remarks Form validation: use CreateMainDBITExtAccessSchema with zodResolver for type-safe create forms
 */
export function useCreateMainDBITExtAccess() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MainDBITExtAccess, "id">) => MainDBITExtAccessService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["mainDBITExtAccess-list"] });
    },
  });
}

/**
 * Update an existing MainDBITExtAccess record.
 * @remarks Form validation: use UpdateMainDBITExtAccessSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateMainDBITExtAccess() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<MainDBITExtAccess, "id">>;
    }) => MainDBITExtAccessService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["mainDBITExtAccess-list"] });
      client.invalidateQueries({ queryKey: ["mainDBITExtAccess", variables.id] });
    },
  });
}

/**
 * Delete a MainDBITExtAccess record by its unique identifier.
 */
export function useDeleteMainDBITExtAccess() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MainDBITExtAccessService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["mainDBITExtAccess-list"] });
      client.invalidateQueries({ queryKey: ["mainDBITExtAccess", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const MainDBITExtAccess_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { MainDBITExtAccessSchema, CreateMainDBITExtAccessSchema, UpdateMainDBITExtAccessSchema } from "../validators/main-dbitext-access-validator";
export type { MainDBITExtAccessInput, CreateMainDBITExtAccessInput, UpdateMainDBITExtAccessInput } from "../validators/main-dbitext-access-validator";
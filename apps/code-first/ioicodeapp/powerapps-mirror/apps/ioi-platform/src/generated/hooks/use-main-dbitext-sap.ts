import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBITExtSAPService } from "../services/main-dbit-ext-sap-service";
import type { MainDBITExtSAP } from "../models/main-dbit-ext-sap-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all MainDBITExtSAP records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, parentFormCode, parentSite, pRFDeptManagerEmail, pRFIsSAP, pRFITApprovedDate, pRFITApprovedEmail, pRFRequestNo, pRFRequestType, sAPClient, sAPModule, sAPPlant, sAPRemarks, sAPReviewedBy, sAPReviewedDate, sAPSOFCurrentStage, sAPSOFFinalDecision, sAPSOFIsBPORequired, sAPSOFITSubmittedDate, sAPTRNumber
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useMainDBITExtSAPList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["mainDBITExtSAP-list", options],
    queryFn: () => MainDBITExtSAPService.getAll(options),
  });
}

/**
 * Retrieve a single MainDBITExtSAP record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useMainDBITExtSAP(id: string) {
  return useQuery({
    queryKey: ["mainDBITExtSAP", id],
    queryFn: () => MainDBITExtSAPService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new MainDBITExtSAP record.
 * @remarks Form validation: use CreateMainDBITExtSAPSchema with zodResolver for type-safe create forms
 */
export function useCreateMainDBITExtSAP() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MainDBITExtSAP, "id">) => MainDBITExtSAPService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["mainDBITExtSAP-list"] });
    },
  });
}

/**
 * Update an existing MainDBITExtSAP record.
 * @remarks Form validation: use UpdateMainDBITExtSAPSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateMainDBITExtSAP() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<MainDBITExtSAP, "id">>;
    }) => MainDBITExtSAPService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["mainDBITExtSAP-list"] });
      client.invalidateQueries({ queryKey: ["mainDBITExtSAP", variables.id] });
    },
  });
}

/**
 * Delete a MainDBITExtSAP record by its unique identifier.
 */
export function useDeleteMainDBITExtSAP() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MainDBITExtSAPService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["mainDBITExtSAP-list"] });
      client.invalidateQueries({ queryKey: ["mainDBITExtSAP", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const MainDBITExtSAP_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { MainDBITExtSAPSchema, CreateMainDBITExtSAPSchema, UpdateMainDBITExtSAPSchema } from "../validators/main-dbitext-sap-validator";
export type { MainDBITExtSAPInput, CreateMainDBITExtSAPInput, UpdateMainDBITExtSAPInput } from "../validators/main-dbitext-sap-validator";
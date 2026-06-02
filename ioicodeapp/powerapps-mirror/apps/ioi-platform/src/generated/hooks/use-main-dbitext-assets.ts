import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBITExtAssetsService } from "../services/main-dbit-ext-assets-service";
import type { MainDBITExtAssets } from "../models/main-dbit-ext-assets-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all MainDBITExtAssets records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, hIAssetNo, hICompany, hIComputerName, hIDepartment, hILastAuditedDate, hILocation, hIMachineID, hIMonth, hIOfficeVersion, hIPurchaseDate, hISerialNo, hIStatus, hITagNo, hIType, hIUsedByEmail, hIVendor, hIWindowsVersion, hIYear, iTSCChecklistYear, iTSCReviewedBy, iTSCReviewedDate, iTSCServerName, parentFormCode, parentSite
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useMainDBITExtAssetsList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["mainDBITExtAssets-list", options],
    queryFn: () => MainDBITExtAssetsService.getAll(options),
  });
}

/**
 * Retrieve a single MainDBITExtAssets record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useMainDBITExtAssets(id: string) {
  return useQuery({
    queryKey: ["mainDBITExtAssets", id],
    queryFn: () => MainDBITExtAssetsService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new MainDBITExtAssets record.
 * @remarks Form validation: use CreateMainDBITExtAssetsSchema with zodResolver for type-safe create forms
 */
export function useCreateMainDBITExtAssets() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MainDBITExtAssets, "id">) => MainDBITExtAssetsService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["mainDBITExtAssets-list"] });
    },
  });
}

/**
 * Update an existing MainDBITExtAssets record.
 * @remarks Form validation: use UpdateMainDBITExtAssetsSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateMainDBITExtAssets() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<MainDBITExtAssets, "id">>;
    }) => MainDBITExtAssetsService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["mainDBITExtAssets-list"] });
      client.invalidateQueries({ queryKey: ["mainDBITExtAssets", variables.id] });
    },
  });
}

/**
 * Delete a MainDBITExtAssets record by its unique identifier.
 */
export function useDeleteMainDBITExtAssets() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MainDBITExtAssetsService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["mainDBITExtAssets-list"] });
      client.invalidateQueries({ queryKey: ["mainDBITExtAssets", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const MainDBITExtAssets_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { MainDBITExtAssetsSchema, CreateMainDBITExtAssetsSchema, UpdateMainDBITExtAssetsSchema } from "../validators/main-dbitext-assets-validator";
export type { MainDBITExtAssetsInput, CreateMainDBITExtAssetsInput, UpdateMainDBITExtAssetsInput } from "../validators/main-dbitext-assets-validator";
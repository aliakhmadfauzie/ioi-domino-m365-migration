import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ITSAPSOFTestEvidenceService } from "../services/it-sapsof-test-evidence-service";
import type { ITSAPSOFTestEvidence } from "../models/it-sapsof-test-evidence-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

/**
 * Retrieve all ITSAPSOFTestEvidence records with optional filtering and sorting.
 * Used for test evidence items linked to SAPSOF / SAPSOF2 sign-off forms.
 * Filtering supports OData syntax, e.g., "parentFormCode eq 'SAPSOF'"
 */
export function useITSAPSOFTestEvidenceList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["itSAPSOFTestEvidence-list", options],
    queryFn: () => ITSAPSOFTestEvidenceService.getAll(options),
  });
}

/**
 * Retrieve a single ITSAPSOFTestEvidence record by its unique identifier.
 */
export function useITSAPSOFTestEvidence(id: string) {
  return useQuery({
    queryKey: ["itSAPSOFTestEvidence", id],
    queryFn: () => ITSAPSOFTestEvidenceService.get(id),
    enabled: !!id,
  });
}

/**
 * Create a new ITSAPSOFTestEvidence record.
 */
export function useCreateITSAPSOFTestEvidence() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ITSAPSOFTestEvidence, "id">) => ITSAPSOFTestEvidenceService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["itSAPSOFTestEvidence-list"] });
    },
  });
}

/**
 * Update an existing ITSAPSOFTestEvidence record.
 */
export function useUpdateITSAPSOFTestEvidence() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, changedFields }: { id: string; changedFields: Partial<Omit<ITSAPSOFTestEvidence, "id">> }) =>
      ITSAPSOFTestEvidenceService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["itSAPSOFTestEvidence-list"] });
      client.invalidateQueries({ queryKey: ["itSAPSOFTestEvidence", variables.id] });
    },
  });
}

/**
 * Delete an ITSAPSOFTestEvidence record by its unique identifier.
 */
export function useDeleteITSAPSOFTestEvidence() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ITSAPSOFTestEvidenceService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["itSAPSOFTestEvidence-list"] });
      client.invalidateQueries({ queryKey: ["itSAPSOFTestEvidence", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ITSAPSOFTestEvidence_DATA_SOURCE_TYPE = 'SharePoint' as const;

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HRInterviewPipelineService } from "../services/hr-interview-pipeline-service";
import type { HRInterviewPipeline } from "../models/hr-interview-pipeline-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all HRInterviewPipeline records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, candidateName, ownerEmail, pipelineNo, position, site1Key, siteKey, stage
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useHRInterviewPipelineList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["hRInterviewPipeline-list", options],
    queryFn: () => HRInterviewPipelineService.getAll(options),
  });
}

/**
 * Retrieve a single HRInterviewPipeline record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useHRInterviewPipeline(id: string) {
  return useQuery({
    queryKey: ["hRInterviewPipeline", id],
    queryFn: () => HRInterviewPipelineService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new HRInterviewPipeline record.
 * @remarks Form validation: use CreateHRInterviewPipelineSchema with zodResolver for type-safe create forms
 */
export function useCreateHRInterviewPipeline() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<HRInterviewPipeline, "id">) => HRInterviewPipelineService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["hRInterviewPipeline-list"] });
    },
  });
}

/**
 * Update an existing HRInterviewPipeline record.
 * @remarks Form validation: use UpdateHRInterviewPipelineSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateHRInterviewPipeline() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<HRInterviewPipeline, "id">>;
    }) => HRInterviewPipelineService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["hRInterviewPipeline-list"] });
      client.invalidateQueries({ queryKey: ["hRInterviewPipeline", variables.id] });
    },
  });
}

/**
 * Delete a HRInterviewPipeline record by its unique identifier.
 */
export function useDeleteHRInterviewPipeline() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => HRInterviewPipelineService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["hRInterviewPipeline-list"] });
      client.invalidateQueries({ queryKey: ["hRInterviewPipeline", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const HRInterviewPipeline_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { HRInterviewPipelineSchema, CreateHRInterviewPipelineSchema, UpdateHRInterviewPipelineSchema } from "../validators/hrinterview-pipeline-validator";
export type { HRInterviewPipelineInput, CreateHRInterviewPipelineInput, UpdateHRInterviewPipelineInput } from "../validators/hrinterview-pipeline-validator";
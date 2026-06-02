import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AttachmentIndexHRService } from "../services/attachment-index-hr-service";
import type { AttachmentIndexHR } from "../models/attachment-index-hr-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all AttachmentIndexHR records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, appName, attachmentID, fileName, fileURL, recordID, siteKey, uploadedBy, uploadedOn
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useAttachmentIndexHRList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["attachmentIndexHR-list", options],
    queryFn: () => AttachmentIndexHRService.getAll(options),
  });
}

/**
 * Retrieve a single AttachmentIndexHR record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useAttachmentIndexHR(id: string) {
  return useQuery({
    queryKey: ["attachmentIndexHR", id],
    queryFn: () => AttachmentIndexHRService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new AttachmentIndexHR record.
 * @remarks Form validation: use CreateAttachmentIndexHRSchema with zodResolver for type-safe create forms
 */
export function useCreateAttachmentIndexHR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<AttachmentIndexHR, "id">) => AttachmentIndexHRService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["attachmentIndexHR-list"] });
    },
  });
}

/**
 * Update an existing AttachmentIndexHR record.
 * @remarks Form validation: use UpdateAttachmentIndexHRSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateAttachmentIndexHR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<AttachmentIndexHR, "id">>;
    }) => AttachmentIndexHRService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["attachmentIndexHR-list"] });
      client.invalidateQueries({ queryKey: ["attachmentIndexHR", variables.id] });
    },
  });
}

/**
 * Delete a AttachmentIndexHR record by its unique identifier.
 */
export function useDeleteAttachmentIndexHR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AttachmentIndexHRService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["attachmentIndexHR-list"] });
      client.invalidateQueries({ queryKey: ["attachmentIndexHR", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const AttachmentIndexHR_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { AttachmentIndexHRSchema, CreateAttachmentIndexHRSchema, UpdateAttachmentIndexHRSchema } from "../validators/attachment-index-hr-validator";
export type { AttachmentIndexHRInput, CreateAttachmentIndexHRInput, UpdateAttachmentIndexHRInput } from "../validators/attachment-index-hr-validator";
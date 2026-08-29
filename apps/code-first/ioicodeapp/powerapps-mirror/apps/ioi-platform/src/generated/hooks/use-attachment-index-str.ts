import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AttachmentIndexSTRService } from "../services/attachment-index-str-service";
import type { AttachmentIndexSTR } from "../models/attachment-index-str-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all AttachmentIndexSTR records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, appName, attachmentCategory, attachmentID, fileHash, fileName, fileSizeKB, fileUrl, isMandatory, recordID, site1Key, siteKey, uploadedBy, uploadedOn
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useAttachmentIndexSTRList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["attachmentIndexSTR-list", options],
    queryFn: () => AttachmentIndexSTRService.getAll(options),
  });
}

/**
 * Retrieve a single AttachmentIndexSTR record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useAttachmentIndexSTR(id: string) {
  return useQuery({
    queryKey: ["attachmentIndexSTR", id],
    queryFn: () => AttachmentIndexSTRService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new AttachmentIndexSTR record.
 * @remarks Form validation: use CreateAttachmentIndexSTRSchema with zodResolver for type-safe create forms
 */
export function useCreateAttachmentIndexSTR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<AttachmentIndexSTR, "id">) => AttachmentIndexSTRService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["attachmentIndexSTR-list"] });
    },
  });
}

/**
 * Update an existing AttachmentIndexSTR record.
 * @remarks Form validation: use UpdateAttachmentIndexSTRSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateAttachmentIndexSTR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<AttachmentIndexSTR, "id">>;
    }) => AttachmentIndexSTRService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["attachmentIndexSTR-list"] });
      client.invalidateQueries({ queryKey: ["attachmentIndexSTR", variables.id] });
    },
  });
}

/**
 * Delete a AttachmentIndexSTR record by its unique identifier.
 */
export function useDeleteAttachmentIndexSTR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AttachmentIndexSTRService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["attachmentIndexSTR-list"] });
      client.invalidateQueries({ queryKey: ["attachmentIndexSTR", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const AttachmentIndexSTR_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { AttachmentIndexSTRSchema, CreateAttachmentIndexSTRSchema, UpdateAttachmentIndexSTRSchema } from "../validators/attachment-index-str-validator";
export type { AttachmentIndexSTRInput, CreateAttachmentIndexSTRInput, UpdateAttachmentIndexSTRInput } from "../validators/attachment-index-str-validator";
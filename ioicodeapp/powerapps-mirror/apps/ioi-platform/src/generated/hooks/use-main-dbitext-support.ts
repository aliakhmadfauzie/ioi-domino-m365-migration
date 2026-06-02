import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBITExtSupportService } from "../services/main-dbit-ext-support-service";
import type { MainDBITExtSupport } from "../models/main-dbit-ext-support-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all MainDBITExtSupport records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, iTDR2AssignedTo, iTDR2ClosedDate, iTDR2DueDate, iTDR2TaskDescription, iTDR2TaskStatus, iTDRActivityType, iTDRCategory, iTDRDateFrom, iTDRDateTo, iTDRParticipants, iTDRVenue, iTSSRAssignedToEmail, iTSSRCaseNo, iTSSRDateAccepted, iTSSRDateResolved, iTSSRDateStarted, iTSSRProblemCategory, iTSSRProblemDescription, iTSSRReportedByEmail, iTSSRSatisfactionRating, iTSSRServiceType, iTSSRSolution, iTSSRSupportMethod, parentFormCode, parentSite
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useMainDBITExtSupportList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["mainDBITExtSupport-list", options],
    queryFn: () => MainDBITExtSupportService.getAll(options),
  });
}

/**
 * Retrieve a single MainDBITExtSupport record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useMainDBITExtSupport(id: string) {
  return useQuery({
    queryKey: ["mainDBITExtSupport", id],
    queryFn: () => MainDBITExtSupportService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new MainDBITExtSupport record.
 * @remarks Form validation: use CreateMainDBITExtSupportSchema with zodResolver for type-safe create forms
 */
export function useCreateMainDBITExtSupport() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MainDBITExtSupport, "id">) => MainDBITExtSupportService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["mainDBITExtSupport-list"] });
    },
  });
}

/**
 * Update an existing MainDBITExtSupport record.
 * @remarks Form validation: use UpdateMainDBITExtSupportSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateMainDBITExtSupport() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<MainDBITExtSupport, "id">>;
    }) => MainDBITExtSupportService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["mainDBITExtSupport-list"] });
      client.invalidateQueries({ queryKey: ["mainDBITExtSupport", variables.id] });
    },
  });
}

/**
 * Delete a MainDBITExtSupport record by its unique identifier.
 */
export function useDeleteMainDBITExtSupport() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MainDBITExtSupportService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["mainDBITExtSupport-list"] });
      client.invalidateQueries({ queryKey: ["mainDBITExtSupport", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const MainDBITExtSupport_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { MainDBITExtSupportSchema, CreateMainDBITExtSupportSchema, UpdateMainDBITExtSupportSchema } from "../validators/main-dbitext-support-validator";
export type { MainDBITExtSupportInput, CreateMainDBITExtSupportInput, UpdateMainDBITExtSupportInput } from "../validators/main-dbitext-support-validator";
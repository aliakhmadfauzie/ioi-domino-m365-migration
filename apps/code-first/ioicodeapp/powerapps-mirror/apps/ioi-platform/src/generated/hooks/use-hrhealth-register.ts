import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HRHealthRegisterService } from "../services/hr-health-register-service";
import type { HRHealthRegister } from "../models/hr-health-register-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all HRHealthRegister records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, employeeNo, healthItem, recordNo, result, site1Key, siteKey, statusKey
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useHRHealthRegisterList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["hRHealthRegister-list", options],
    queryFn: () => HRHealthRegisterService.getAll(options),
  });
}

/**
 * Retrieve a single HRHealthRegister record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useHRHealthRegister(id: string) {
  return useQuery({
    queryKey: ["hRHealthRegister", id],
    queryFn: () => HRHealthRegisterService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new HRHealthRegister record.
 * @remarks Form validation: use CreateHRHealthRegisterSchema with zodResolver for type-safe create forms
 */
export function useCreateHRHealthRegister() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<HRHealthRegister, "id">) => HRHealthRegisterService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["hRHealthRegister-list"] });
    },
  });
}

/**
 * Update an existing HRHealthRegister record.
 * @remarks Form validation: use UpdateHRHealthRegisterSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateHRHealthRegister() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<HRHealthRegister, "id">>;
    }) => HRHealthRegisterService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["hRHealthRegister-list"] });
      client.invalidateQueries({ queryKey: ["hRHealthRegister", variables.id] });
    },
  });
}

/**
 * Delete a HRHealthRegister record by its unique identifier.
 */
export function useDeleteHRHealthRegister() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => HRHealthRegisterService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["hRHealthRegister-list"] });
      client.invalidateQueries({ queryKey: ["hRHealthRegister", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const HRHealthRegister_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { HRHealthRegisterSchema, CreateHRHealthRegisterSchema, UpdateHRHealthRegisterSchema } from "../validators/hrhealth-register-validator";
export type { HRHealthRegisterInput, CreateHRHealthRegisterInput, UpdateHRHealthRegisterInput } from "../validators/hrhealth-register-validator";
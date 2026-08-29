import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppSettingsService } from "../services/app-settings-service";
import type { AppSettings } from "../models/app-settings-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all AppSettings records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, categoryKey, dataTypeKey, description, isEditable, settingKey, settingValue
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useAppSettingsList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["appSettings-list", options],
    queryFn: () => AppSettingsService.getAll(options),
  });
}

/**
 * Retrieve a single AppSettings record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useAppSettings(id: string) {
  return useQuery({
    queryKey: ["appSettings", id],
    queryFn: () => AppSettingsService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new AppSettings record.
 * @remarks Form validation: use CreateAppSettingsSchema with zodResolver for type-safe create forms
 */
export function useCreateAppSettings() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<AppSettings, "id">) => AppSettingsService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["appSettings-list"] });
    },
  });
}

/**
 * Update an existing AppSettings record.
 * @remarks Form validation: use UpdateAppSettingsSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateAppSettings() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<AppSettings, "id">>;
    }) => AppSettingsService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["appSettings-list"] });
      client.invalidateQueries({ queryKey: ["appSettings", variables.id] });
    },
  });
}

/**
 * Delete a AppSettings record by its unique identifier.
 */
export function useDeleteAppSettings() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AppSettingsService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["appSettings-list"] });
      client.invalidateQueries({ queryKey: ["appSettings", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const AppSettings_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { AppSettingsSchema, CreateAppSettingsSchema, UpdateAppSettingsSchema } from "../validators/app-settings-validator";
export type { AppSettingsInput, CreateAppSettingsInput, UpdateAppSettingsInput } from "../validators/app-settings-validator";
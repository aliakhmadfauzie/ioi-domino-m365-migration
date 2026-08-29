import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RoutePermissionsService } from "../services/route-permissions-service";
import type { RoutePermissions } from "../models/route-permissions-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all RoutePermissions records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, allowedRolesKeys, departmentKey, isPublic, redirectPath, requiresAuth, routeName, routePath
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useRoutePermissionsList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["routePermissions-list", options],
    queryFn: () => RoutePermissionsService.getAll(options),
  });
}

/**
 * Retrieve a single RoutePermissions record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useRoutePermissions(id: string) {
  return useQuery({
    queryKey: ["routePermissions", id],
    queryFn: () => RoutePermissionsService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new RoutePermissions record.
 * @remarks Form validation: use CreateRoutePermissionsSchema with zodResolver for type-safe create forms
 */
export function useCreateRoutePermissions() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<RoutePermissions, "id">) => RoutePermissionsService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["routePermissions-list"] });
    },
  });
}

/**
 * Update an existing RoutePermissions record.
 * @remarks Form validation: use UpdateRoutePermissionsSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateRoutePermissions() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<RoutePermissions, "id">>;
    }) => RoutePermissionsService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["routePermissions-list"] });
      client.invalidateQueries({ queryKey: ["routePermissions", variables.id] });
    },
  });
}

/**
 * Delete a RoutePermissions record by its unique identifier.
 */
export function useDeleteRoutePermissions() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => RoutePermissionsService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["routePermissions-list"] });
      client.invalidateQueries({ queryKey: ["routePermissions", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const RoutePermissions_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { RoutePermissionsSchema, CreateRoutePermissionsSchema, UpdateRoutePermissionsSchema } from "../validators/route-permissions-validator";
export type { RoutePermissionsInput, CreateRoutePermissionsInput, UpdateRoutePermissionsInput } from "../validators/route-permissions-validator";